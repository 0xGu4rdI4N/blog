import Link from 'next/link';
import { getSortedPostsData } from '../../lib/posts';

export default function Blog() {
    const allPostsData = getSortedPostsData();

    return (
        <div className="min-h-screen p-8 sm:p-20">
            <h1 className="text-3xl font-bold mb-8">Blog</h1>
            <ul className="space-y-4">
                {allPostsData.map(({ id, date, title }) => (
                    <li key={id} className="border p-4 rounded-lg">
                        <Link href={`/blog/${id}`} className="text-xl font-semibold text-blue-600 hover:underline">
                            {title}
                        </Link>
                        <br />
                        <small className="text-gray-500">{date}</small>
                    </li>
                ))}
            </ul>
            <div className="mt-8">
                <Link href="/" className="text-blue-500 hover:underline">
                    ← Back to Home
                </Link>
            </div>
        </div>
    );
}
