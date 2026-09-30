// Shared engine: fetch openings from a careers URL, diff against previous state, build alert emails.
const UA = 'Mozilla/5.0 (compatible; StartupWatch/0.1)';
const crypto = require('crypto');

// ---------- fetching ----------
async function assertPublic(url) {
  const { hostname } = new URL(url);
  const addrs = await require('dns').promises.lookup(hostname, { all: true });
  for (const { address: a } of addrs) if (/^(127\.|10\.|192\.168\.|169\.254\.|172\.(1[6-9]|2\d|3[01])\.|0\.|::1$|fc|fd|fe80)/i.test(a)) throw new Error('Blocked: private address');
}
async function get(url, opts = {}) {
  await assertPublic(url);
  const r = await fetch(url, { headers: { 'user-agent': UA, accept: 'text/html,application/json' }, redirect: 'follow', signal: AbortSignal.timeout(20000), ...opts });
  if (!r.ok) throw new Error(`HTTP ${r.status} for ${url}`);
  return r;
}
const strip = (h) => h.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/\s+/g, ' ').trim();
const decode = (s) => s.replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');

// ---------- checkers: each returns [{title, url, location?}] ----------
async function greenhouse(token) {
  const j = await (await get(`https://boards-api.greenhouse.io/v1/boards/${token}/jobs`)).json();
  return j.jobs.map((x) => ({ title: x.title, url: x.absolute_url, location: x.location?.name }));
}
async function lever(slug) {
  const j = await (await get(`https://api.lever.co/v0/postings/${slug}?mode=json`)).json();
  return j.map((x) => ({ title: x.text, url: x.hostedUrl, location: x.categories?.location }));
}
async function ashby(slug) {
  const j = await (await get(`https://api.ashbyhq.com/posting-api/job-board/${slug}`)).json();
  return j.jobs.map((x) => ({ title: x.title, url: x.jobUrl, location: x.location }));
}
async function workable(slug) {
  const j = await (await get(`https://apply.workable.com/api/v1/widget/accounts/${slug}`)).json();
  return (j.jobs || []).map((x) => ({ title: x.title, url: x.url, location: [x.city, x.country].filter(Boolean).join(', ') }));
}

// YC pages embed Inertia props in a data-page attribute
function ycJobs(html) {
  const m = html.match(/data-page="([^"]+)"/);
  if (!m) return null;
  let page; try { page = JSON.parse(decode(m[1])); } catch { return null; }
  let found = null;
  (function walk(o) {
    if (found || !o || typeof o !== 'object') return;
    if (Array.isArray(o.jobPostings)) { found = o.jobPostings; return; }
    for (const v of Object.values(o)) walk(v);
  })(page);
  if (!found) return null;
  return found.map((x) => ({ title: x.title, url: x.url ? new URL(x.url, 'https://www.ycombinator.com').href : undefined, location: x.location }));
}

// heuristic: anchors that look like job postings
function genericLinks(html, base) {
  const out = new Map();
  const re = /<a\b[^>]*href=["']([^"'#]+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let m;
  while ((m = re.exec(html))) {
    const text = strip(m[2]);
    if (!text || text.length < 3 || text.length > 120) continue;
    let href; try { href = new URL(m[1], base).href; } catch { continue; }
    const looksJob = /\/(jobs?|careers?|positions?|openings?|roles?)\/[^/]+/i.test(href) || /(engineer|designer|manager|developer|scientist|analyst|intern|recruiter|founding|lead\b|head of|sales|marketing|operations)/i.test(text);
    if (looksJob && !/^(careers?|jobs?|open (roles|positions)|view all|apply)$/i.test(text)) out.set(href, { title: text, url: href });
  }
  return [...out.values()];
}

// heuristic: job cards where a heading is followed by an "Apply" control before the next heading
function genericHeadings(html, base) {
  const body = html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<!--[\s\S]*?-->/gi, '');
  const parts = body.split(/(?=<h[1-4][\s>])/i).slice(1);
  const out = [];
  for (const seg of parts) {
    const h = seg.match(/^<h[1-4][^>]*>([\s\S]*?)<\/h[1-4]>/i);
    if (!h) continue;
    const title = strip(h[1]);
    const rest = seg.slice(h[0].length, h[0].length + 4000);
    if (!title || title.length > 90 || !/apply|view (role|job|position)|learn more/i.test(strip(rest.slice(0, 3000)))) continue;
    if (/^(careers?|open roles?|join us|life at|benefits|perks|our (values|mission|team))/i.test(title)) continue;
    const a = rest.match(/<a\b[^>]*href=["']([^"']+)["'][^>]*>[^<]*(apply|view|learn)/i) || rest.match(/<a\b[^>]*apply[^>]*href=["']([^"']+)["']/i);
    let href = base; try { if (a) href = new URL(a[1], base).href; } catch {}
    const tag = rest.match(/<(?:span|p|div)[^>]*class=["'][^"']*(?:tag|location|meta|badge)[^"']*["'][^>]*>([\s\S]*?)<\/(?:span|p|div)>/i);
    out.push({ title, url: href, location: tag ? strip(tag[1]).slice(0, 60) : undefined });
  }
  return out;
}

// heuristic: bullet lists under a "roles / positions / looking for" heading
function genericLists(html, base) {
  const body = html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<!--[\s\S]*?-->/gi, '');
  const out = [];
  for (const seg of body.split(/(?=<h[1-4][\s>])/i).slice(1)) {
    const h = seg.match(/^<h[1-4][^>]*>([\s\S]*?)<\/h[1-4]>/i);
    if (!h || !/(open (roles|positions)|positions|openings|looking for|we'?re hiring|roles)/i.test(strip(h[1]))) continue;
    const re = /<li[^>]*>([\s\S]*?)<\/li>/gi; let m;
    while ((m = re.exec(seg))) { const t = strip(m[1]); if (t.length > 2 && t.length < 80) out.push({ title: t, url: base }); }
  }
  return out;
}

// optional AI fallback (xAI Grok or Claude) for pages that resist heuristics
async function aiExtract(text, url) {
  const prompt = `Below is text from a company careers page (${url}). Return ONLY a JSON array of open job postings: [{"title":"","location":"","url":""}]. Return [] if none.\n\n${text.slice(0, 24000)}`;
  let body, res;
  if (process.env.XAI_API_KEY) {
    res = await fetch('https://api.x.ai/v1/chat/completions', { method: 'POST', headers: { 'content-type': 'application/json', authorization: `Bearer ${process.env.XAI_API_KEY}` }, body: JSON.stringify({ model: process.env.XAI_MODEL || 'grok-4', messages: [{ role: 'user', content: prompt }] }) });
    body = (await res.json()).choices?.[0]?.message?.content;
  } else if (process.env.ANTHROPIC_API_KEY) {
    res = await fetch('https://api.anthropic.com/v1/messages', { method: 'POST', headers: { 'content-type': 'application/json', 'x-api-key': process.env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' }, body: JSON.stringify({ model: process.env.ANTHROPIC_MODEL || 'claude-haiku-4-5-20251001', max_tokens: 4000, messages: [{ role: 'user', content: prompt }] }) });
    body = (await res.json()).content?.[0]?.text;
  } else return null;
  const arr = body?.match(/\[[\s\S]*\]/);
  return arr ? JSON.parse(arr[0]) : [];
}

async function fetchJobs(url, depth = 0) {
  const u = new URL(url);
  const host = u.hostname.replace(/^www\./, '');
  const parts = u.pathname.split('/').filter(Boolean);

  // direct ATS urls
  if (/greenhouse\.io$/.test(host)) return { source: 'greenhouse', jobs: await greenhouse(parts[0]) };
  if (host === 'jobs.lever.co') return { source: 'lever', jobs: await lever(parts[0]) };
  if (host === 'jobs.ashbyhq.com') return { source: 'ashby', jobs: await ashby(parts[0]) };
  if (host === 'apply.workable.com') return { source: 'workable', jobs: await workable(parts[0]) };

  // YC company page -> /jobs subpage
  let target = url;
  if (host === 'ycombinator.com' && parts[0] === 'companies' && parts[1]) target = `https://www.ycombinator.com/companies/${parts[1]}/jobs`;

  const html = await (await get(target)).text();

  if (host === 'ycombinator.com') {
    const yc = ycJobs(html);
    if (yc) return { source: 'yc', jobs: yc };
  }
  // ATS embedded/linked in the page
  let m;
  if ((m = html.match(/boards(?:-api)?\.greenhouse\.io\/(?:embed\/job_board\?for=|v1\/boards\/)?([a-z0-9_-]+)/i)) && !['embed', 'v1'].includes(m[1])) { try { return { source: 'greenhouse', jobs: await greenhouse(m[1]) }; } catch {} }
  if ((m = html.match(/jobs\.lever\.co\/([a-z0-9_-]+)/i))) { try { return { source: 'lever', jobs: await lever(m[1]) }; } catch {} }
  if ((m = html.match(/jobs\.ashbyhq\.com\/([a-z0-9_.-]+)/i))) { try { return { source: 'ashby', jobs: await ashby(m[1]) }; } catch {} }
  if ((m = html.match(/apply\.workable\.com\/([a-z0-9_-]+)/i))) { try { return { source: 'workable', jobs: await workable(m[1]) }; } catch {} }

  const cards = genericHeadings(html, target);
  if (cards.length) return { source: 'page', jobs: cards };
  const lists = genericLists(html, target);
  if (lists.length) return { source: 'page', jobs: lists };
  const links = genericLinks(html, target);
  if (links.length) return { source: 'links', jobs: links };
  // homepage pasted? follow its careers/jobs link (or try common paths) once
  if (depth === 0) {
    const cands = new Set();
    const re = /<a\b[^>]*href=["']([^"'#]+)["'][^>]*>([\s\S]*?)<\/a>/gi; let a;
    while ((a = re.exec(html))) { if (/^\s*(careers?|jobs?|join us|we'?re hiring|work with us|open roles)\s*$/i.test(strip(a[2])) || /\/(careers?|jobs)\/?$/i.test(a[1])) { try { cands.add(new URL(a[1], target).href); } catch {} } }
    for (const p of ['/careers', '/jobs', '/careers/']) cands.add(new URL(p, target).origin + p);
    for (const c of [...cands].slice(0, 5)) {
      if (c === target) continue;
      try { const r = await fetchJobs(c, 1); if (r.jobs.length) return r; } catch {}
    }
  }
  const ai = await aiExtract(strip(html), target).catch(() => null);
  if (ai) return { source: 'ai', jobs: ai };
  return { source: 'none', jobs: [] };
}


// ---------- check + diff ----------
const jobKey = (j) => (j.url || j.title).toLowerCase();
async function check(s) {
  try {
    const { source, jobs } = await fetchJobs(s.url);
    const prev = new Set((s.jobs || []).map(jobKey));
    const first = !s.lastChecked || s.error;
    const now = new Date().toISOString();
    const seen = new Map((s.jobs || []).map((j) => [jobKey(j), j.firstSeen]));
    s.jobs = jobs.map((j) => ({ ...j, firstSeen: seen.get(jobKey(j)) || now, isNew: !first && !prev.has(jobKey(j)) }));
    s.source = source;
    s.error = null;
    s.newCount = s.jobs.filter((j) => j.isNew).length;
    s.history = [...(s.history || []).slice(-29), { at: now, count: s.jobs.length }];
    s.lastChecked = now;
  } catch (e) {
    s.error = e.message;
    s.lastChecked = new Date().toISOString();
  }
  return s;
}

// ---------- names ----------
function nameFromUrl(url) {
  const u = new URL(url); const parts = u.pathname.split('/').filter(Boolean);
  const host = u.hostname.replace(/^(www|jobs|careers|boards|apply)\./, '');
  const slug = (/ycombinator|greenhouse|lever|ashbyhq|workable/.test(host) ? (parts[0] === 'companies' ? parts[1] : parts[0]) : host.split('.')[0]) || host;
  return slug.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}


// ---------- email ----------
const esc = (x = '') => String(x).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const mailReady = () => !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS && process.env.ALERT_TO);
let transport;
function mailer() {
  if (!transport) transport = require('nodemailer').createTransport({ host: process.env.SMTP_HOST, port: +(process.env.SMTP_PORT || 465), secure: (process.env.SMTP_PORT || '465') === '465', auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } });
  return transport;
}
async function notify(startups) {
  const hit = startups.filter((s) => s.newCount);
  if (!hit.length || !mailReady()) return;
  const total = hit.reduce((n, s) => n + s.newCount, 0);
  const html = `<div style="font-family:-apple-system,Segoe UI,sans-serif;max-width:560px;color:#12141a">
    <h2 style="margin:0 0 12px">${total} new role${total > 1 ? 's' : ''} on Startup Watch</h2>` + hit.map((s) => `
    <div style="border:1px solid #e8eaf0;border-radius:12px;padding:14px 16px;margin-bottom:12px">
      <b>${esc(s.name)}</b> <a href="${esc(s.url)}" style="color:#6b7280;font-size:12px">careers page</a>
      <ul style="padding-left:18px;margin:8px 0 0">${s.jobs.filter((j) => j.isNew).map((j) => `<li><a href="${esc(j.url || s.url)}" style="color:#5b5bf0">${esc(j.title)}</a>${j.location ? ` <span style="color:#6b7280">· ${esc(j.location)}</span>` : ''}</li>`).join('')}</ul>
    </div>`).join('') + `</div>`;
  const text = hit.map((s) => `${s.name}\n` + s.jobs.filter((j) => j.isNew).map((j) => `  - ${j.title} ${j.url || ''}`).join('\n')).join('\n\n');
  try { await mailer().sendMail({ from: `Startup Watch <${process.env.SMTP_USER}>`, to: process.env.ALERT_TO, subject: `${total} new role${total > 1 ? 's' : ''}: ${hit.map((s) => s.name).join(', ')}`.slice(0, 120), text, html }); console.log(`alert sent: ${total} new roles`); }
  catch (e) { console.error('email failed:', e.message); }
}

module.exports = { fetchJobs, check, nameFromUrl, notify, mailReady, mailer };
