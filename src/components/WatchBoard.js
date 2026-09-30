'use client';

import { useEffect, useMemo, useState } from 'react';
import { Search, Plus, ExternalLink, X, RefreshCw } from 'lucide-react';

const REPO = '0xGu4rdI4N/blog';
const DATA_URL = `https://raw.githubusercontent.com/${REPO}/watch-data/watch.json`;
const issueUrl = (title, url) =>
    `https://github.com/${REPO}/issues/new?title=${title}&body=${encodeURIComponent(url)}`;

const ago = (iso) => {
    if (!iso) return 'never';
    const m = (Date.now() - new Date(iso)) / 6e4;
    return m < 60 ? `${Math.max(1, m | 0)}m ago` : m < 1440 ? `${(m / 60) | 0}h ago` : `${(m / 1440) | 0}d ago`;
};

function Chip({ on, onClick, children }) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-pressed={on}
            className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${on
                ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white'
                : 'bg-stone-50 dark:bg-neutral-900/50 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-neutral-800 hover:border-stone-400 dark:hover:border-neutral-600'
                }`}
        >
            {children}
        </button>
    );
}

function Card({ s, term }) {
    const jobs = s.jobs
        .filter((j) => !term || s.name.toLowerCase().includes(term) || j.title.toLowerCase().includes(term))
        .sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    return (
        <div className="rounded-xl border border-stone-200 dark:border-neutral-800 bg-stone-50/60 dark:bg-neutral-900/40 p-4 flex flex-col gap-3">
            <div className="flex items-start gap-2">
                <div className="min-w-0">
                    <div className="font-bold text-[15px] text-gray-900 dark:text-gray-100">{s.name}</div>
                    <a href={s.url} target="_blank" rel="noopener noreferrer"
                        className="text-xs text-stone-500 dark:text-stone-400 hover:underline break-all inline-flex items-center gap-1">
                        {new URL(s.url).host}<ExternalLink size={10} />
                    </a>
                </div>
                <a href={issueUrl('untrack', s.url)} target="_blank" rel="noopener noreferrer" title="Stop tracking (opens a GitHub issue)"
                    className="ml-auto text-stone-400 hover:text-red-500"><X size={14} /></a>
            </div>
            <div className="flex flex-wrap gap-1.5 text-[11px] font-semibold">
                {s.error
                    ? <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300" title={s.error}>check failed</span>
                    : <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">{s.jobs.length} open</span>}
                {s.newCount > 0 && <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">+{s.newCount} new</span>}
            </div>
            {jobs.length > 0 ? (
                <ul className="flex flex-col max-h-48 overflow-auto -mx-1">
                    {jobs.map((j, i) => (
                        <li key={i}>
                            <a href={j.url || s.url} target="_blank" rel="noopener noreferrer"
                                className="flex justify-between gap-3 px-1 py-1 rounded text-sm text-gray-800 dark:text-gray-300 hover:bg-stone-100 dark:hover:bg-neutral-800">
                                <span>{j.isNew && <b className="text-[10px] text-emerald-600 dark:text-emerald-400 mr-1.5">NEW</b>}{j.title}</span>
                                {j.location && <span className="text-xs text-stone-500 truncate max-w-[40%]">{j.location}</span>}
                            </a>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-sm text-stone-500">{s.error || 'No openings found.'}</p>
            )}
            <div className="mt-auto text-xs text-stone-500">Checked {ago(s.lastChecked)}</div>
        </div>
    );
}

export default function WatchBoard() {
    const [db, setDb] = useState(null);
    const [err, setErr] = useState('');
    const [q, setQ] = useState('');
    const [onlyNew, setOnlyNew] = useState(false);
    const [onlyOpen, setOnlyOpen] = useState(false);
    const [link, setLink] = useState('');

    useEffect(() => {
        const local = new URLSearchParams(window.location.search).get('data'); // dev preview: ?data=/some.json
        fetch(local && local.startsWith('/') ? local : DATA_URL, { cache: 'no-store' })
            .then((r) => { if (!r.ok) throw new Error('No data yet — run the “Startup Watch” workflow once from the Actions tab.'); return r.json(); })
            .then(setDb)
            .catch((e) => setErr(e.message));
    }, []);

    const term = q.toLowerCase();
    const list = useMemo(() => (db?.startups || []).filter((s) =>
        (!onlyNew || s.newCount) && (!onlyOpen || s.jobs.length) &&
        (!term || s.name.toLowerCase().includes(term) || s.jobs.some((j) => j.title.toLowerCase().includes(term)))
    ), [db, term, onlyNew, onlyOpen]);

    const total = (db?.startups || []).reduce((n, s) => n + s.jobs.length, 0);
    const fresh = (db?.startups || []).reduce((n, s) => n + (s.newCount || 0), 0);

    return (
        <div className="max-w-4xl mx-auto px-6 pb-24">
            <h1 className="text-3xl font-serif font-bold text-gray-900 dark:text-gray-100">Startup Watch</h1>
            <p className="mt-2 text-sm text-stone-500 dark:text-stone-400 flex items-center gap-2">
                Open roles at startups I follow, checked daily.
                {db && <span className="inline-flex items-center gap-1"><RefreshCw size={11} /> updated {ago(db.updatedAt)}</span>}
            </p>

            <form
                className="mt-6 flex gap-2"
                onSubmit={(e) => { e.preventDefault(); if (link.trim()) window.open(issueUrl('track', /^https?:/.test(link.trim()) ? link.trim() : `https://${link.trim()}`), '_blank'); }}
            >
                <input value={link} onChange={(e) => setLink(e.target.value)} placeholder="Paste a careers / YC / Greenhouse / Lever link to track…"
                    className="flex-1 min-w-0 rounded-lg border border-stone-200 dark:border-neutral-800 bg-transparent px-3 py-2 text-sm outline-none focus:border-stone-400 dark:focus:border-neutral-600" />
                <button className="inline-flex items-center gap-1 rounded-lg bg-black dark:bg-white text-white dark:text-black px-3 py-2 text-sm font-semibold"><Plus size={14} /> Track</button>
            </form>
            <p className="mt-1.5 text-xs text-stone-500">Opens a pre-filled GitHub issue — hit “Submit new issue” and the next run adds it (owner only).</p>

            {err && <p className="mt-10 text-sm text-stone-500">{err}</p>}
            {!db && !err && <p className="mt-10 text-sm text-stone-500">Loading…</p>}

            {db && (
                <>
                    <div className="mt-6 flex flex-wrap items-center gap-2">
                        <div className="relative flex-1 min-w-[200px]">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search startups or roles…"
                                className="w-full rounded-lg border border-stone-200 dark:border-neutral-800 bg-transparent pl-8 pr-3 py-1.5 text-sm outline-none focus:border-stone-400 dark:focus:border-neutral-600" />
                        </div>
                        <Chip on={onlyNew} onClick={() => setOnlyNew(!onlyNew)}>New only</Chip>
                        <Chip on={onlyOpen} onClick={() => setOnlyOpen(!onlyOpen)}>Hiring only</Chip>
                    </div>
                    <p className="mt-3 text-xs text-stone-500">{db.startups.length} startups · {total} open roles · {fresh} new</p>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        {list.map((s) => <Card key={s.id} s={s} term={term} />)}
                    </div>
                </>
            )}
        </div>
    );
}
