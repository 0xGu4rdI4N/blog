

import Link from 'next/link';
import { getSortedPostsData } from '../lib/posts';
import { PUBLICATIONS } from '../lib/data';

export default function Home() {
    const recentPosts = getSortedPostsData().slice(0, 3);

    return (
        <div className="max-w-2xl mx-auto px-6 pt-10 pb-10">
            {/* Header */}
            <header className="mb-8">
                <h1 className="font-serif text-4xl font-bold mb-2 text-black dark:text-white">
                    Raunak
                </h1>
                <p className="text-lg italic text-gray-600 dark:text-gray-400 mb-4">
                    Undergraduate @IITR, exploring AI & Biology
                </p>

                <div className="space-y-3 text-gray-800 dark:text-gray-300 leading-relaxed">
                    <p>
                        I'm interested in <strong>AI for Science</strong>, trying to find the magna carta moment of biology and AI.
                    </p>
                    <p>
                        Currently working on cryo-em imaging, unified PLMs & protein design. Also exploring neuroevolutionary networks and NNPs.
                    </p>

                    {/* Emphasized Line (Optional, mimicking the reference) */}
                    {/* <p className="text-red-500 font-bold uppercase text-sm tracking-wide">
                        Open for collaborations!
                    </p> */}

                    <p>
                        I write about my learnings and random thoughts (<Link href="/writings" className="text-emerald-600 hover:underline">blog</Link>).
                    </p>
                </div>

                {/* Social Links */}
                <div className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-emerald-600 dark:text-emerald-400 text-sm font-medium">
                    <a href="https://x.com/Gu4rd_I4N" className="hover:underline">x (twitter)</a>
                    <span className="text-gray-300">/</span>
                    <a href="mailto:raunak0831@gmail.com" className="hover:underline">email</a>
                    <span className="text-gray-300">/</span>
                    <a href="/blog/cv.pdf" className="hover:underline">cv</a>
                    <span className="text-gray-300">/</span>
                    <a href="https://github.com/0xGu4rdI4N" className="hover:underline">github</a>
                </div>
            </header>

            {/* Publications */}
            <section className="mb-8">
                <h2 className="font-serif text-2xl font-bold mb-4 text-black dark:text-white">
                    Publications
                </h2>
                <div className="space-y-6">
                    {PUBLICATIONS.length > 0 ? (
                        PUBLICATIONS.map((paper, i) => (
                            <div key={i}>
                                <h3 className="font-bold text-gray-900 dark:text-gray-100">
                                    {paper.title}
                                </h3>
                                <p className="text-sm text-gray-500 mb-1">{paper.venue}</p>
                                <p className="text-gray-700 dark:text-gray-300 text-sm">
                                    {paper.desc}
                                </p>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 italic">Work in progress...</p>
                    )}
                </div>
            </section>

            {/* Recent Writing */}
            <section className="mb-8">
                <h2 className="font-serif text-2xl font-bold mb-4 text-black dark:text-white">
                    Recent Writing
                </h2>
                <ul className="space-y-3">
                    {recentPosts.map((post) => (
                        <li key={post.id} className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                            <Link href={`/writings/${post.id}`} className="font-medium text-gray-900 dark:text-gray-100 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                                {post.title}
                            </Link>
                            <span className="text-sm text-gray-400 font-mono shrink-0">
                                {post.date}
                            </span>
                        </li>
                    ))}
                </ul>
                <div className="mt-4">
                    <Link href="/writings" className="text-sm text-emerald-600 hover:underline">
                        View all posts &rarr;
                    </Link>
                </div>
            </section>

            {/* Cool Stuff / Extras */}
            <section>
                <h2 className="font-serif text-2xl font-bold mb-4 text-black dark:text-white">
                    Things I find cool
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    Drug Discovery, Molecular Dynamics, Protein Design, Geometric Deep Learning, <span className="font-bold"><span className="text-rose-500">C</span><span className="text-orange-500">o</span><span className="text-amber-500">l</span><span className="text-green-500">o</span><span className="text-blue-500">r</span><span className="text-indigo-500">s</span></span>, Physics induced Models
                </p>
            </section>
        </div>
    );
}
