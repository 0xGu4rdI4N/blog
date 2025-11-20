import Link from 'next/link';
import { getSortedPostsData } from '../../lib/posts';
import { Calendar, Clock } from 'lucide-react';

export default function Blog() {
    const allPostsData = getSortedPostsData();

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 p-8 sm:p-20">
            <div className="max-w-6xl mx-auto">
                <div className="mb-12">
                    <Link href="/" className="text-emerald-400 hover:text-emerald-300 mb-4 inline-block">
                        ← Back to Home
                    </Link>
                    <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-emerald-400 to-violet-500 bg-clip-text text-transparent">
                        Blog Archive
                    </h1>
                    <p className="text-slate-400">Exploring Biology, ML, and everything in between</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {allPostsData.map(({ id, date, title, excerpt, tags, readTime }) => (
                        <Link
                            key={id}
                            href={`/blog/${id}`}
                            className="group p-6 rounded-lg border border-slate-800 hover:border-emerald-500/50 bg-slate-900/50 backdrop-blur transition-all hover:shadow-lg hover:shadow-emerald-500/10"
                        >
                            <div className="flex flex-wrap gap-2 mb-3">
                                {tags && tags.map(tag => (
                                    <span key={tag} className="px-2 py-1 text-xs font-semibold rounded bg-violet-500/20 text-violet-400">
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            <h2 className="text-2xl font-bold mb-2 group-hover:text-emerald-400 transition-colors">
                                {title}
                            </h2>

                            {excerpt && (
                                <p className="text-slate-400 mb-4 line-clamp-2">{excerpt}</p>
                            )}

                            <div className="flex items-center gap-4 text-sm text-slate-500">
                                <span className="flex items-center gap-1">
                                    <Calendar size={14} /> {date}
                                </span>
                                {readTime && (
                                    <span className="flex items-center gap-1">
                                        <Clock size={14} /> {readTime}
                                    </span>
                                )}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}