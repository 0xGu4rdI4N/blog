'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';

export default function BlogArchive({ posts }) {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredPosts = useMemo(() => {
        if (!searchQuery) return posts;
        const lowerQ = searchQuery.toLowerCase();
        return posts.filter(post =>
            post.title.toLowerCase().includes(lowerQ) ||
            (post.tags && post.tags.some(tag => tag.toLowerCase().includes(lowerQ))) ||
            (post.type && post.type.toLowerCase().includes(lowerQ)) ||
            (post.excerpt && post.excerpt.toLowerCase().includes(lowerQ))
        );
    }, [searchQuery, posts]);

    const groupedPosts = useMemo(() => {
        const groups = {};
        filteredPosts.forEach(post => {
            const year = post.date.split('-')[0];
            if (!groups[year]) groups[year] = [];
            groups[year].push(post);
        });
        return groups;
    }, [filteredPosts]);

    const years = Object.keys(groupedPosts).sort((a, b) => b - a);

    return (
        <>
            <div className="mb-12 relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="text-slate-500" size={20} />
                </div>
                <input
                    type="text"
                    placeholder="Search by title, tag, or keyword..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-xl border text-lg outline-none transition-all bg-white/50 dark:bg-neutral-900/50 border-slate-200 dark:border-neutral-800 text-slate-900 dark:text-slate-200 focus:border-violet-500/50 focus:bg-white dark:focus:bg-neutral-900"
                />
            </div>

            <div className="space-y-16">
                {years.map(year => (
                    <div key={year} className="relative">
                        <div className="sticky top-24 z-20 inline-block px-3 py-1 rounded-md text-sm font-bold mb-6 bg-slate-100 dark:bg-neutral-800 text-slate-700 dark:text-slate-300">
                            {year}
                        </div>
                        <div className="grid gap-4 pl-2">
                            {groupedPosts[year].map(post => (
                                <Link
                                    key={post.id}
                                    href={`/writings/${post.id}`}
                                    className="cursor-pointer group relative p-6 rounded-2xl border transition-all bg-white dark:bg-neutral-900/30 border-slate-200 dark:border-neutral-800 hover:bg-slate-50 dark:hover:bg-neutral-900 hover:border-slate-300 dark:hover:border-neutral-700"
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                                        <h3 className="text-xl font-semibold transition-colors text-slate-800 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                                            {post.title}
                                        </h3>
                                        <div className="flex items-center gap-4 text-xs font-mono whitespace-nowrap text-slate-500">
                                            <span>{post.date}</span>
                                        </div>
                                    </div>
                                    {post.excerpt && (
                                        <p className="text-base leading-relaxed mb-4 max-w-2xl font-serif text-slate-600 dark:text-slate-400">
                                            {post.excerpt}
                                        </p>
                                    )}
                                    <div className="flex gap-2">
                                        {post.type && (
                                            <span className="text-xs px-2 py-1 rounded-md bg-slate-100 dark:bg-neutral-800 text-slate-600 dark:text-slate-400">#{post.type}</span>
                                        )}
                                        {post.tags && post.tags.map(tag => (
                                            <span key={tag} className="text-xs px-2 py-1 rounded-md bg-slate-100 dark:bg-neutral-800 text-slate-600 dark:text-slate-400">#{tag}</span>
                                        ))}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}
