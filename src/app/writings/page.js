import Link from 'next/link';
import { getSortedPostsData } from '../../lib/posts';
import BlogArchive from '../../components/BlogArchive';

export default function Blog() {
    const allPostsData = getSortedPostsData();

    return (
        <div className="pt-32 px-6 pb-20 max-w-4xl mx-auto relative z-10">
            <div className="mb-12">
                <Link href="/" className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 dark:hover:text-emerald-300 mb-4 inline-block">
                    ← Back to Home
                </Link>
                <h1 className="text-4xl font-bold mb-4 text-slate-900 dark:text-slate-100">Writing</h1>
                <p className="text-slate-600 dark:text-slate-400">
                    These are some articles which excited me to explore.
                </p>
            </div>

            <BlogArchive posts={allPostsData} />
        </div>
    );
}