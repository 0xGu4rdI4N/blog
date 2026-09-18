'use client';

import { useMemo, useState } from 'react';
import { Search, Flag } from 'lucide-react';

const TONE_CLASSES = {
    bio: 'text-emerald-600 dark:text-emerald-400 border-emerald-600 dark:border-emerald-400',
    sci: 'text-sky-600 dark:text-sky-400 border-sky-600 dark:border-sky-400',
    soft: 'text-amber-600 dark:text-amber-400 border-amber-600 dark:border-amber-400',
};

function GroupChip({ group, active, onClick }) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-pressed={active}
            className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${active
                ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white'
                : 'bg-stone-50 dark:bg-neutral-900/50 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-neutral-800 hover:border-stone-400 dark:hover:border-neutral-600'
                }`}
        >
            {group.code}
        </button>
    );
}

function LabRow({ row }) {
    return (
        <div className="rounded-xl border border-stone-200 dark:border-neutral-800 bg-stone-50/60 dark:bg-neutral-900/40 p-4">
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <span
                    className={`inline-block w-1.5 h-1.5 rounded-full shrink-0 self-center ${row.c ? 'bg-emerald-500' : 'bg-amber-500'
                        }`}
                    title={row.c ? 'Confirmed' : 'Borderline'}
                />
                <span className="font-bold text-[15px] text-gray-900 dark:text-gray-100">{row.lab}</span>
                <span className="text-sm text-stone-500 dark:text-stone-400">— {row.pi}</span>
            </div>
            <p className="mt-1.5 text-sm text-gray-800 dark:text-gray-300 leading-relaxed">{row.kw}</p>
            <p className="mt-1 text-[13px] italic text-stone-500 dark:text-stone-500 leading-relaxed">{row.evi}</p>
            {row.note && (
                <p className="mt-2 flex items-start gap-1.5 text-[12px] font-medium text-amber-700 dark:text-amber-400">
                    <Flag size={12} className="shrink-0 mt-0.5" />
                    {row.note}
                </p>
            )}
            <div className="mt-2.5 flex flex-wrap gap-1.5">
                {row.progs.map((p) => (
                    <span
                        key={p}
                        className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-stone-100 dark:bg-neutral-800 text-stone-500 dark:text-stone-400"
                    >
                        {p}
                    </span>
                ))}
            </div>
        </div>
    );
}

export default function LabsAtlas({ universities }) {
    const [uniId, setUniId] = useState(universities[0]?.id);
    const [query, setQuery] = useState('');
    const [activeGroup, setActiveGroup] = useState(null);
    const [confirmedOnly, setConfirmedOnly] = useState(false);

    const uni = universities.find((u) => u.id === uniId) ?? universities[0];

    const filteredByGroup = useMemo(() => {
        const q = query.trim().toLowerCase();

        return uni.groups
            .filter((g) => !activeGroup || activeGroup === g.key)
            .map((g) => {
                let rows = uni.rows.filter((r) => r.g === g.key);
                if (confirmedOnly) rows = rows.filter((r) => r.c === 1);
                if (q) {
                    rows = rows.filter((r) =>
                        `${r.lab} ${r.pi} ${r.kw} ${r.evi} ${r.progs.join(' ')}`.toLowerCase().includes(q)
                    );
                }
                return { group: g, rows };
            })
            .filter((entry) => entry.rows.length > 0);
    }, [uni, query, activeGroup, confirmedOnly]);

    const totalShown = filteredByGroup.reduce((n, e) => n + e.rows.length, 0);

    return (
        <div className="max-w-4xl mx-auto px-6 pt-6 pb-16">
            <header className="mb-6">
                <h1 className="font-serif text-3xl sm:text-4xl font-bold text-black dark:text-white mb-2">
                    AI4Science Atlas
                </h1>
                <p className="text-[15px] text-gray-700 dark:text-gray-300 leading-relaxed max-w-2xl">
                    {uni.blurb}
                </p>
                <p className="mt-2 text-xs text-stone-400 dark:text-stone-500">
                    Source:{' '}
                    <a href={uni.programsUrl} className="underline hover:text-emerald-600">
                        {uni.name} doctoral programs
                    </a>
                    . More universities coming soon.
                </p>
            </header>

            {universities.length > 1 && (
                <div className="mb-4 flex flex-wrap gap-2">
                    {universities.map((u) => (
                        <button
                            key={u.id}
                            onClick={() => {
                                setUniId(u.id);
                                setActiveGroup(null);
                            }}
                            className={`px-3 py-1.5 rounded-lg text-sm font-semibold border transition-colors ${u.id === uniId
                                ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white'
                                : 'bg-stone-50 dark:bg-neutral-900/50 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-neutral-800'
                                }`}
                        >
                            {u.name}
                        </button>
                    ))}
                </div>
            )}

            <div className="sticky top-0 z-10 -mx-6 px-6 py-3 bg-white/90 dark:bg-neutral-950/90 backdrop-blur border-b border-stone-200 dark:border-neutral-800">
                <div className="relative">
                    <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search lab, PI, program or keyword…"
                        className="w-full pl-9 pr-3 py-2 rounded-lg border border-stone-200 dark:border-neutral-800 bg-stone-50 dark:bg-neutral-900 text-sm text-gray-900 dark:text-gray-100 outline-none focus:border-emerald-500"
                    />
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-1.5">
                    {uni.groups.map((g) => (
                        <GroupChip
                            key={g.key}
                            group={g}
                            active={activeGroup === g.key}
                            onClick={() => setActiveGroup(activeGroup === g.key ? null : g.key)}
                        />
                    ))}
                    <button
                        type="button"
                        onClick={() => setConfirmedOnly((v) => !v)}
                        aria-pressed={confirmedOnly}
                        className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${confirmedOnly
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'bg-stone-50 dark:bg-neutral-900/50 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-neutral-800'
                            }`}
                    >
                        confirmed only
                    </button>
                    <span className="ml-auto font-mono text-xs text-stone-400 whitespace-nowrap">
                        {totalShown} lab{totalShown === 1 ? '' : 's'}
                    </span>
                </div>
            </div>

            <div className="mt-6 space-y-8">
                {filteredByGroup.map(({ group, rows }) => (
                    <section key={group.key}>
                        <div
                            className={`flex items-baseline gap-2 pb-1.5 mb-3 border-b-2 ${TONE_CLASSES[group.tone] ?? TONE_CLASSES.sci
                                }`}
                        >
                            <h2 className="font-serif text-lg font-bold">{group.label}</h2>
                            <span className="font-mono text-[11px] text-stone-400">
                                {group.code} · {rows.length}
                            </span>
                        </div>
                        <div className="space-y-2.5">
                            {rows.map((row, i) => (
                                <LabRow key={`${row.lab}-${i}`} row={row} />
                            ))}
                        </div>
                    </section>
                ))}

                {totalShown === 0 && (
                    <p className="text-center text-stone-400 text-sm py-12">No labs match that search.</p>
                )}
            </div>

            <footer className="mt-12 pt-4 border-t border-stone-200 dark:border-neutral-800 text-xs text-stone-400 leading-relaxed">
                <span className="inline-flex items-center gap-1.5 mr-4">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" /> confirmed
                </span>
                <span className="inline-flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" /> borderline
                </span>
                <p className="mt-2">
                    A lab affiliated with several doctoral programs is listed once, tagged with every program
                    where it was found. Screened lab-by-lab against stated research pillars and recent
                    publications — not just names or hunches.
                </p>
            </footer>
        </div>
    );
}
