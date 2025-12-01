"use client";

import { useState } from 'react';
import { Book, Video, FileText, Lightbulb, ArrowRight, Quote, Wrench, Link as LinkIcon } from 'lucide-react';

export default function ExtrasList({ items }) {
    const [activeCategory, setActiveCategory] = useState('All');

    const categories = [
        { id: 'All', label: 'All' },
        { id: 'book', label: 'Books', icon: Book },
        { id: 'video', label: 'Videos', icon: Video },
        { id: 'article', label: 'Articles', icon: FileText },
        { id: 'thought', label: 'Thoughts', icon: Lightbulb },
    ];

    const filteredItems = activeCategory === 'All'
        ? items
        : items.filter(item => item.type === activeCategory);

    return (
        <div>
            {/* Category Tabs */}
            <div className="flex flex-wrap justify-center gap-2 mb-12">
                {categories.map((cat) => {
                    const Icon = cat.icon;
                    return (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${activeCategory === cat.id
                                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-lg'
                                : 'bg-white dark:bg-neutral-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-neutral-800 hover:border-slate-300 dark:hover:border-neutral-700'
                                }`}
                        >
                            {Icon && <Icon size={16} />}
                            {cat.label}
                        </button>
                    );
                })}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-auto">
                {filteredItems.map((item) => (
                    <div key={item.id} className="p-6 rounded-2xl border transition-all hover:-translate-y-1 duration-300 bg-white dark:bg-neutral-900/50 border-slate-200 dark:border-neutral-800 hover:border-slate-300 dark:hover:border-neutral-700 flex flex-col h-full">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-2 rounded-lg ${item.type === 'thought' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' :
                                item.type === 'article' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400' :
                                    item.type === 'book' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
                                        item.type === 'video' ? 'bg-red-500/10 text-red-600 dark:text-red-400' :
                                            'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                                }`}>
                                {item.type === 'thought' && <Lightbulb size={18} />}
                                {item.type === 'article' && <FileText size={18} />}
                                {item.type === 'book' && <Book size={18} />}
                                {item.type === 'video' && <Video size={18} />}
                                {item.type === 'link' && <LinkIcon size={18} />}
                                {item.type === 'tool' && <Wrench size={18} />}
                                {item.type === 'quote' && <Quote size={18} />}
                            </div>
                            <span className="text-xs font-mono text-slate-500 opacity-70">{item.date}</span>
                        </div>

                        <h3 className="text-lg font-bold mb-2 text-slate-900 dark:text-slate-200">
                            {item.title || "Untitled"}
                        </h3>

                        <p className="text-sm leading-relaxed mb-4 text-slate-600 dark:text-slate-400 flex-grow">
                            {item.content}
                        </p>

                        {item.url && (
                            <a href={item.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wide hover:underline text-blue-600 dark:text-blue-400 mt-auto">
                                Read Source <ArrowRight size={12} />
                            </a>
                        )}

                        {item.author && (
                            <div className="text-xs font-serif italic text-right mt-2 text-slate-500">
                                — {item.author}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {filteredItems.length === 0 && (
                <div className="text-center py-20 text-slate-500 dark:text-slate-400">
                    <p>No items found in this category yet.</p>
                </div>
            )}
        </div>
    );
}
