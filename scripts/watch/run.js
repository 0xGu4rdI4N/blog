// Runs in GitHub Actions. Usage: node scripts/watch/run.js <path/to/watch.json>
// Env: TRACK_TITLE / TRACK_BODY (issue that adds or removes a startup), SMTP_* + ALERT_TO (email), XAI_API_KEY / ANTHROPIC_API_KEY (optional AI fallback)
const fs = require('fs');
const path = require('path');
const { check, nameFromUrl, notify } = require('./engine');

const file = process.argv[2];
const load = () => { try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch { return null; } };

(async () => {
  let db = load();
  if (!db) db = { startups: JSON.parse(fs.readFileSync(path.join(__dirname, 'seed.json'), 'utf8')).map((s) => ({ ...s, id: require('crypto').randomUUID(), addedAt: new Date().toISOString(), jobs: [], history: [] })) };
  let msg = '';

  // add/remove request coming from an issue
  const title = (process.env.TRACK_TITLE || '').trim().toLowerCase();
  const url = ((process.env.TRACK_BODY || '').match(/https?:\/\/[^\s)>\]]+/) || [])[0];
  if (title && url) {
    let link; try { link = new URL(url).href; } catch {}
    if (!link) msg = `Couldn't parse a URL from the issue body.`;
    else if (title.startsWith('untrack')) {
      const before = db.startups.length;
      db.startups = db.startups.filter((s) => s.url !== link);
      msg = before === db.startups.length ? `${link} wasn't being tracked.` : `Stopped tracking ${link}.`;
    } else if (title.startsWith('track')) {
      if (db.startups.some((s) => s.url === link)) msg = `Already tracking ${link}.`;
      else { db.startups.unshift({ id: require('crypto').randomUUID(), url: link, name: nameFromUrl(link), addedAt: new Date().toISOString(), jobs: [], history: [] }); msg = `Now tracking ${link}.`; }
    }
  }

  for (const s of db.startups) await check(s);
  await notify(db.startups);

  db.updatedAt = new Date().toISOString();
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(db, null, 1));
  const open = db.startups.reduce((n, s) => n + s.jobs.length, 0), fresh = db.startups.reduce((n, s) => n + (s.newCount || 0), 0);
  fs.writeFileSync(path.join(path.dirname(file), '_result.txt'), `${msg} ${db.startups.length} startups, ${open} open roles, ${fresh} new.`.trim());
  console.log(fs.readFileSync(path.join(path.dirname(file), '_result.txt'), 'utf8'));
})();
