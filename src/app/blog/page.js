'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { getSortedPostsData } from '../../lib/posts';
import { Search } from 'lucide-react';

export default function Blog() {
    const [searchQuery, setSearchQuery] = useState("");
    const allPostsData = getSortedPostsData();

    const filteredPosts = useMemo(() => {
        if (!searchQuery) return allPostsData;
        const lowerQ = searchQuery.toLowerCase();
        return allPostsData.filter(post =>
            post.title.toLowerCase().includes(lowerQ) ||
            (post.tags && post.tags.some(tag => tag.toLowerCase().includes(lowerQ))) ||
            (post.excerpt && post.excerpt.toLowerCase().includes(lowerQ))
        );
    }, [searchQuery, allPostsData]);

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
        <div className="pt-32 px-6 pb-20 max-w-4xl mx-auto relative z-10">
            <div className="mb-12">
                <Link href="/" className="text-emerald-400 hover:text-emerald-300 mb-4 inline-block">
                    ← Back to Home
                </Link>
                <h1 className="text-4xl font-bold mb-4 text-slate-100">Writing</h1>
                <p className="text-slate-400">
                    Archive of thoughts on computational biology, mathematics, and code.
                </p>
            </div>

            <div className="mb-12 relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="text-slate-500" size={20} />
                </div>
                <input
                    type="text"
                    placeholder="Search by title, tag, or keyword..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-xl border text-lg outline-none transition-all bg-neutral-900/50 border-neutral-800 text-slate-200 focus:border-violet-500/50 focus:bg-neutral-900"
                />
            </div>

            <div className="space-y-16">
                {years.map(year => (
                    <div key={year} className="relative">
                        <div className="sticky top-24 z-20 inline-block px-3 py-1 rounded-md text-sm font-bold mb-6 bg-neutral-800 text-slate-300">
                            {year}
                        </div>
                        <div className="grid gap-4 pl-2">
                            {groupedPosts[year].map(post => (
                                <Link
                                    key={post.id}
                                    href={`/blog/${post.id}`}
                                    className="cursor-pointer group relative p-6 rounded-2xl border transition-all bg-neutral-900/30 border-neutral-800 hover:bg-neutral-900 hover:border-neutral-700"
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                                        <h3 className="text-xl font-semibold transition-colors text-slate-200 group-hover:text-emerald-400">
                                            {post.title}
                                        </h3>
                                        <div className="flex items-center gap-4 text-xs font-mono whitespace-nowrap text-slate-500">
                                            <span>{post.date}</span>
                                        </div>
                                    </div>
                                    {post.excerpt && (
                                        <p className="text-base leading-relaxed mb-4 max-w-2xl font-serif text-slate-400">
                                            {post.excerpt}
                                        </p>
                                    )}
                                    {post.tags && (
                                        <div className="flex gap-2">
                                            {post.tags.map(tag => (
                                                <span key={tag} className="text-xs px-2 py-1 rounded-md bg-neutral-800 text-slate-400">#{tag}</span>
                                            ))}
                                        </div>
                                    )}
                                </Link>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}