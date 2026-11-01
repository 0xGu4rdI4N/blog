import { getPostData, getSortedPostsData } from '../../../lib/posts';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Calendar, Clock } from 'lucide-react';

// This function generates the static paths for GitHub Pages export
export async function generateStaticParams() {
    const posts = getSortedPostsData();
    return posts.map((post) => ({
        slug: post.id,
    }));
}

export const dynamicParams = false;

export default async function Post({ params }) {
    const { slug } = await params;
    const postData = await getPostData(slug);

    return (
        <article className="pt-32 pb-24 px-6 max-w-3xl mx-auto">
            <Link href="/writings" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-emerald-500 mb-8 transition-colors">
                <ChevronLeft size={16} /> Back to Archive
            </Link>

            <header className="mb-12 text-center">
                <div className="flex justify-center gap-2 mb-6">
                    {postData.type && (
                        <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider border rounded-full border-slate-200 dark:border-neutral-800 text-violet-600 dark:text-violet-400">
                            {postData.type}
                        </span>
                    )}
                    {postData.tags && postData.tags.map(tag => (
                        <span key={tag} className="px-3 py-1 text-xs font-bold uppercase tracking-wider border rounded-full border-slate-200 dark:border-neutral-800 text-violet-600 dark:text-violet-400">
                            {tag}
                        </span>
                    ))}
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-slate-900 dark:text-slate-100">
                    {postData.title}
                </h1>
                <div className="flex items-center justify-center gap-6 text-sm text-slate-500 font-mono">
                    <span className="flex items-center gap-2"><Calendar size={14} /> {postData.date}</span>
                    <span className="flex items-center gap-2"><Clock size={14} /> {postData.readTime}</span>
                </div>
            </header>

            {/* The Content Renderer */}
            {/* We use 'prose' from @tailwindcss/typography to handle basic styling, 
          then custom CSS for the specific math/code colors you wanted */}
            <div
                className="prose prose-lg dark:prose-invert max-w-none
                   prose-headings:font-sans prose-headings:font-bold 
                   prose-p:font-serif prose-p:leading-loose
                   prose-pre:bg-[#1e1e1e] prose-pre:border prose-pre:border-violet-500/20
                   dark:prose-math:text-cyan-400 prose-math:text-emerald-600"
                dangerouslySetInnerHTML={{ __html: postData.contentHtml }}
            />

            {(postData.prevPost || postData.nextPost) && (
                <nav className="mt-16 pt-8 border-t border-slate-200 dark:border-neutral-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {postData.prevPost ? (
                        <Link
                            href={`/writings/${postData.prevPost.slug}`}
                            className="group p-4 rounded-xl border border-slate-200 dark:border-neutral-800 bg-slate-50/50 dark:bg-neutral-900/30 hover:border-emerald-500/50 transition-all flex flex-col justify-between"
                        >
                            <span className="text-xs font-mono text-stone-400 flex items-center gap-1 group-hover:text-emerald-500 transition-colors">
                                <ChevronLeft size={14} /> Previous Part
                            </span>
                            <span className="font-semibold text-sm text-slate-800 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 mt-2 line-clamp-2">
                                {postData.prevPost.title}
                            </span>
                        </Link>
                    ) : (
                        <div className="hidden sm:block" />
                    )}

                    {postData.nextPost && (
                        postData.nextPost.comingSoon ? (
                            <div className="p-4 rounded-xl border border-dashed border-slate-200 dark:border-neutral-800 bg-slate-50/20 dark:bg-neutral-900/10 flex flex-col justify-between opacity-60 text-right sm:items-end">
                                <span className="text-xs font-mono text-stone-400">Next Part (Coming Soon)</span>
                                <span className="font-semibold text-sm text-slate-600 dark:text-slate-400 mt-2 line-clamp-2">
                                    {postData.nextPost.title}
                                </span>
                            </div>
                        ) : (
                            <Link
                                href={`/writings/${postData.nextPost.slug}`}
                                className="group p-4 rounded-xl border border-slate-200 dark:border-neutral-800 bg-slate-50/50 dark:bg-neutral-900/30 hover:border-emerald-500/50 transition-all flex flex-col justify-between text-right sm:items-end"
                            >
                                <span className="text-xs font-mono text-stone-400 flex items-center gap-1 group-hover:text-emerald-500 transition-colors justify-end">
                                    Next Part <ChevronRight size={14} />
                                </span>
                                <span className="font-semibold text-sm text-slate-800 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 mt-2 line-clamp-2">
                                    {postData.nextPost.title}
                                </span>
                            </Link>
                        )
                    )}
                </nav>
            )}

            {!postData.contentHtml.includes('<footer') && (
                <footer className="mt-16 pt-8 border-t border-slate-200 dark:border-neutral-800 text-sm text-slate-500 dark:text-slate-400 italic font-serif">
                    “If I have seen further, it is by standing on the shoulders of giants.”
                </footer>
            )}
        </article>
    );
}