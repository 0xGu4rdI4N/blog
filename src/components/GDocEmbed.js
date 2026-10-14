'use client';

import { useState, useEffect } from 'react';
import { ExternalLink, RefreshCw, AlertCircle } from 'lucide-react';

export default function GDocEmbed({ title, description, docUrl }) {
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);
    const [key, setKey] = useState(0); // used to force iframe refresh

    const handleLoad = () => setLoaded(true);
    const handleError = () => { setLoaded(true); setError(true); };
    const handleRefresh = () => { setLoaded(false); setError(false); setKey(k => k + 1); };

    // Add ?rm=minimal to strip Google Doc's header/footer chrome if using published URL
    const embedUrl = docUrl?.includes('?') ? `${docUrl}&embedded=true` : `${docUrl}?embedded=true`;

    if (!docUrl) {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-stone-400">
                <AlertCircle size={32} className="mb-3 opacity-50" />
                <p className="text-sm">No Google Doc URL configured.</p>
                <p className="text-xs mt-1 text-stone-500">Add a <code className="bg-stone-100 dark:bg-neutral-800 px-1 rounded">docUrl</code> to <code className="bg-stone-100 dark:bg-neutral-800 px-1 rounded">GDOC_EMBEDS</code> in <code className="bg-stone-100 dark:bg-neutral-800 px-1 rounded">src/lib/data.js</code>.</p>
            </div>
        );
    }

    return (
        <div className="w-full">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-stone-200 dark:border-neutral-800">
                <div className="flex items-center gap-2 text-xs text-stone-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Live from Google Docs · updates automatically
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleRefresh}
                        className="flex items-center gap-1.5 text-xs text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors"
                        title="Reload"
                    >
                        <RefreshCw size={12} className={!loaded ? 'animate-spin' : ''} />
                        Refresh
                    </button>
                    <a
                        href={docUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 hover:underline"
                    >
                        <ExternalLink size={12} />
                        Open in Google Docs
                    </a>
                </div>
            </div>

            {/* Loading skeleton */}
            {!loaded && (
                <div className="animate-pulse space-y-3 py-8">
                    <div className="h-4 bg-stone-200 dark:bg-neutral-800 rounded w-3/4" />
                    <div className="h-4 bg-stone-200 dark:bg-neutral-800 rounded w-full" />
                    <div className="h-4 bg-stone-200 dark:bg-neutral-800 rounded w-5/6" />
                    <div className="h-4 bg-stone-200 dark:bg-neutral-800 rounded w-full" />
                    <div className="h-4 bg-stone-200 dark:bg-neutral-800 rounded w-2/3" />
                </div>
            )}

            {error ? (
                <div className="flex flex-col items-center justify-center py-16 text-stone-400 gap-3">
                    <AlertCircle size={28} className="opacity-60" />
                    <p className="text-sm">Could not load the document.</p>
                    <p className="text-xs text-stone-500">Make sure the Google Doc is published to the web (File → Share → Publish to web).</p>
                    <button onClick={handleRefresh} className="mt-2 text-xs text-emerald-600 hover:underline">Try again</button>
                </div>
            ) : (
                <iframe
                    key={key}
                    src={embedUrl}
                    onLoad={handleLoad}
                    onError={handleError}
                    className={`w-full rounded-lg border border-stone-200 dark:border-neutral-800 transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0 absolute'}`}
                    style={{ height: '80vh', minHeight: '600px' }}
                    title={title || 'Google Doc Embed'}
                    frameBorder="0"
                    allowFullScreen
                />
            )}
        </div>
    );
}
