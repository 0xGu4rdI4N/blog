import Link from 'next/link';
import { EXTRAS } from '../../lib/data';
import { Lightbulb, Link as LinkIcon, Wrench, Quote, ArrowRight } from 'lucide-react';

export default function ExtrasPage() {
    return (
        <div className="pt-32 px-6 pb-20 max-w-6xl mx-auto relative z-10">
            <div className="mb-16 text-center max-w-2xl mx-auto">
                <h1 className="text-4xl font-bold mb-4 text-slate-200">Digital Garden</h1>
                <p className="text-slate-400">
                    A collection of micro-thoughts, tools, and readings that don't fit into a full blog post.
                    Consider this my public notebook.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-auto">
                {EXTRAS.map((item) => (
                    <div key={item.id} className="p-6 rounded-2xl border transition-all hover:-translate-y-1 duration-300 bg-neutral-900/50 border-neutral-800 hover:border-neutral-700">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-2 rounded-lg ${item.type === 'insight' ? 'bg-amber-500/10 text-amber-400' :
                                    item.type === 'link' ? 'bg-blue-500/10 text-blue-400' :
                                        item.type === 'tool' ? 'bg-purple-500/10 text-purple-400' :
                                            'bg-slate-800 text-slate-400'
                                }`}>
                                {item.type === 'insight' && <Lightbulb size={18} />}
                                {item.type === 'link' && <LinkIcon size={18} />}
                                {item.type === 'tool' && <Wrench size={18} />}
                                {item.type === 'quote' && <Quote size={18} />}
                            </div>
                            <span className="text-xs font-mono text-slate-500 opacity-70">{item.date}</span>
                        </div>

                        <h3 className="text-lg font-bold mb-2 text-slate-200">
                            {item.title || "Thought"}
                        </h3>

                        <p className="text-sm leading-relaxed mb-4 text-slate-400">
                            {item.content}
                        </p>

                        {item.url && (
                            <a href={item.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wide hover:underline text-blue-400">
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
        </div>
    );
}
