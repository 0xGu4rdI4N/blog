import { getAllPostIds, getPostData } from '../../../lib/posts';
import Link from 'next/link';

export async function generateStaticParams() {
    const paths = getAllPostIds();
    return paths.map(p => ({ slug: p.params.slug }));
}

export default async function Post({ params }) {
    const { slug } = await params;
    const postData = await getPostData(slug);

    return (
        <div className="min-h-screen p-8 sm:p-20 max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold mb-4">{postData.title}</h1>
            <div className="text-gray-500 mb-8">{postData.date}</div>
            <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} className="prose dark:prose-invert" />
            <div className="mt-12">
                <Link href="/blog" className="text-blue-500 hover:underline">
                    ← Back to Blog
                </Link>
            </div>
        </div>
    );
}
