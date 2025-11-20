import { getPostData, getSortedPostsData } from '../../../../lib/posts';
import Link from 'next/link';
import { ChevronLeft, Calendar, Clock } from 'lucide-react';

// This function generates the static paths for GitHub Pages export
export async function generateStaticParams() {
    const posts = getSortedPostsData();
    return posts.map((post) => ({
        slug: post.id,
    }));
}

export default async function Post({ params }) {
    const postData = await getPostData(params.slug);

    return (
        <article className="pt-32 pb-24 px-6 max-w-3xl mx-auto">
            <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-emerald-500 mb-8 transition-colors">
                <ChevronLeft size={16} /> Back to Archive
            </Link>

            <header className="mb-12 text-center">
                <div className="flex justify-center gap-2 mb-6">
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
        </article>
    );
}