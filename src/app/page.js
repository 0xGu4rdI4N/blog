import Link from 'next/link';

export default function Home() {
    return (
        <div className="min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
                <h1 className="text-4xl font-bold">Raunak's Portfolio</h1>
                <p className="text-lg">BioScience + Machine Learning</p>

                <div className="flex gap-4">
                    <Link href="/blog" className="text-blue-500 hover:underline">
                        Read the Blog
                    </Link>
                </div>
            </main>
        </div>
    );
}
