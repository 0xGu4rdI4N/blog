"use client";

import { useState } from 'react';
import { Book, Video, FileText, Lightbulb, ArrowRight, Quote, Wrench, Link as LinkIcon } from 'lucide-react';

export default function ExtrasList({ items }) {
    const [activeCategory, setActiveCategory] = useState('All');

    const categories = [
        { id: 'All', label: 'All' },
        { id: 'book', label: 'Books' },
        { id: 'video', label: 'Videos' },
        { id: 'article', label: 'Articles' },
        { id: 'thought', label: 'Thoughts' },
    ];

    const filteredItems = activeCategory === 'All'
        ? items
        : items.filter(item => item.type === activeCategory);

    return (
        <div>
            {/* Category Tabs */}
            <div className="flex flex-wrap gap-4 mb-12 border-b border-gray-200 dark:border-gray-800 pb-4">
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={`text-sm font-medium transition-colors ${activeCategory === cat.id
                            ? 'text-black dark:text-white font-bold'
                            : 'text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white'
                            }`}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>

            {/* List */}
            <div className="space-y-12">
                {filteredItems.map((item) => (
                    <div key={item.id} className="group flex gap-6">
                        {item.image && (
                            <div className="shrink-0 mt-1">
                                <img src={`/blog${item.image}`} alt={item.title || "Cover Image"} className="w-24 sm:w-28 h-auto rounded shadow-sm object-cover border border-gray-200 dark:border-gray-800" />
                            </div>
                        )}
                        <div className="flex-1">
                            <div className="flex items-baseline justify-between mb-1">
                                <h3 className="text-lg font-bold text-black dark:text-white">
                                    {item.title || "Untitled"}
                                </h3>
                            </div>

                            <div className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2 text-sm sm:text-base">
                                {item.content}
                            </div>

                            {item.url && (
                                <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-sm text-emerald-600 hover:underline inline-flex items-center gap-1">
                                    Source <ArrowRight size={12} />
                                </a>
                            )}

                            {item.author && (
                                <div className="text-sm text-gray-500 italic mt-1">
                                    — {item.author}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {filteredItems.length === 0 && (
                <div className="py-20 text-gray-500 italic">
                    <p>No items found.</p>
                </div>
            )}
        </div>
    );
}
