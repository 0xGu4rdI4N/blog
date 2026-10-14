import { GDOC_EMBEDS } from '../../lib/data';
import Link from 'next/link';
import { FileText, ExternalLink } from 'lucide-react';

export const metadata = {
    title: 'Notes – Raunak Kumar',
    description: 'Living documents and running notes on various topics.',
};

export default function NotesPage() {
    return (
        <div className="max-w-2xl mx-auto px-6 pt-20 pb-32">
            <div className="mb-12">
                <h1 className="font-serif text-4xl font-bold mb-4 text-black dark:text-white">Notes</h1>
                <p className="text-stone-500 dark:text-stone-400 leading-relaxed">
                    Living documents — things I'm actively collecting and updating. Backed by Google Docs so they stay current without requiring a site rebuild.
                </p>
            </div>

            {GDOC_EMBEDS.length === 0 ? (
                <div className="border border-dashed border-stone-300 dark:border-neutral-700 rounded-2xl p-8 text-center text-stone-400">
                    <FileText size={28} className="mx-auto mb-3 opacity-40" />
                    <p className="text-sm">No notes yet.</p>
                    <p className="text-xs mt-1 text-stone-500">
                        Add entries to <code className="bg-stone-100 dark:bg-neutral-800 px-1 rounded">GDOC_EMBEDS</code> in{' '}
                        <code className="bg-stone-100 dark:bg-neutral-800 px-1 rounded">src/lib/data.js</code>.
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {GDOC_EMBEDS.map((doc) => (
                        <Link
                            key={doc.slug}
                            href={`/notes/${doc.slug}`}
                            className="group flex items-start gap-4 p-5 rounded-2xl border border-stone-200 dark:border-neutral-800 hover:border-emerald-400 dark:hover:border-emerald-600 bg-stone-50 dark:bg-neutral-900/50 transition-all"
                        >
                            <FileText size={20} className="text-stone-400 group-hover:text-emerald-500 mt-0.5 shrink-0 transition-colors" />
                            <div className="flex-1 min-w-0">
                                <h2 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-emerald-600 transition-colors">
                                    {doc.title}
                                </h2>
                                {doc.description && (
                                    <p className="text-sm text-stone-500 dark:text-stone-400 mt-1 leading-snug">
                                        {doc.description}
                                    </p>
                                )}
                                <span className="inline-flex items-center gap-1 text-xs text-stone-400 mt-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                    Live document
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
