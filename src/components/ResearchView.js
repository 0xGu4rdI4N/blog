'use client';

import { useState } from 'react';
import ResearchGraphWrapper from './ResearchGraphWrapper';
import ResearchList from './ResearchList';
import { Network, List } from 'lucide-react';

export default function ResearchView({ data }) {
    const [viewMode, setViewMode] = useState('graph'); // 'graph' | 'list'

    return (
        <div className="max-w-6xl mx-auto px-6 pt-20 pb-32">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="font-serif text-4xl font-bold mb-2 text-black dark:text-white">Research Map</h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                        An interconnected view of my active projects, concepts, and tools.
                    </p>
                </div>
                
                {/* Toggle Switch */}
                <div className="flex items-center bg-stone-100 dark:bg-neutral-900 p-1 rounded-lg border border-stone-200 dark:border-neutral-800 self-start sm:self-auto shrink-0">
                    <button
                        onClick={() => setViewMode('graph')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                            viewMode === 'graph' 
                            ? 'bg-white dark:bg-neutral-800 text-black dark:text-white shadow-sm' 
                            : 'text-stone-500 hover:text-stone-700 dark:hover:text-stone-300'
                        }`}
                    >
                        <Network size={16} />
                        Graph
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                            viewMode === 'list' 
                            ? 'bg-white dark:bg-neutral-800 text-black dark:text-white shadow-sm' 
                            : 'text-stone-500 hover:text-stone-700 dark:hover:text-stone-300'
                        }`}
                    >
                        <List size={16} />
                        List
                    </button>
                </div>
            </div>

            {viewMode === 'graph' ? (
                <div className="animate-in fade-in zoom-in-95 duration-500">
                    <ResearchGraphWrapper data={data} />
                    <p className="text-xs text-center text-stone-500 mt-4 italic">Drag nodes to explore the connections. Scroll to zoom.</p>
                </div>
            ) : (
                <ResearchList data={data} />
            )}
        </div>
    );
}
