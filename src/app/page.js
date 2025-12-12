

import Link from 'next/link';
import { getSortedPostsData } from '../lib/posts';
import { PUBLICATIONS } from '../lib/data';

export default function Home() {
    const recentPosts = getSortedPostsData().slice(0, 3);

    return (
        <div className="max-w-2xl mx-auto px-6 pt-20 pb-32">
            {/* Header */}
            <header className="mb-16">
                <h1 className="font-serif text-4xl font-bold mb-2 text-black dark:text-white">
                    Raunak
                </h1>
                <p className="text-lg italic text-gray-600 dark:text-gray-400 mb-6">
                    Curious researcher, exploring AI & Biology
                </p>

                <div className="space-y-6 text-gray-800 dark:text-gray-300 leading-relaxed">
                    <p>
                        Hey! I'm interested in <strong>AI for Science</strong>, trying to find the magna carta moment of biology and AI.
                    </p>
                    <p>
                        Currently working on cryo-em imaging and unified PLMs. Also exploring neuroevolutionary networks and NNPs.
                    </p>

                    {/* Emphasized Line (Optional, mimicking the reference) */}
                    {/* <p className="text-red-500 font-bold uppercase text-sm tracking-wide">
                        Open for collaborations!
                    </p> */}

                    <p>
                        I write about my learnings and random thoughts (<Link href="/writings" className="text-emerald-600 hover:underline">blog</Link>),
                        and I'm also active on <a href="https://github.com" className="text-emerald-600 hover:underline">GitHub</a>.
                    </p>
                </div>

                {/* Social Links */}
                <div className="mt-8 flex flex-wrap gap-x-4 gap-y-2 text-emerald-600 dark:text-emerald-400 text-sm font-medium">
                    <a href="https://github.com" className="hover:underline">github</a>
                    <span className="text-gray-300">/</span>
                    <a href="https://linkedin.com" className="hover:underline">linkedin</a>
                    <span className="text-gray-300">/</span>
                    <a href="mailto:email@example.com" className="hover:underline">email</a>
                    <span className="text-gray-300">/</span>
                    <a href="#" className="hover:underline">cv</a>
                </div>
            </header>

            {/* Publications */}
            <section className="mb-16">
                <h2 className="font-serif text-2xl font-bold mb-6 text-black dark:text-white">
                    Publications
                </h2>
                <div className="space-y-8">
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
            <section className="mb-16">
                <h2 className="font-serif text-2xl font-bold mb-6 text-black dark:text-white">
                    Recent Writing
                </h2>
                <ul className="space-y-4">
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
                <div className="mt-6">
                    <Link href="/writings" className="text-sm text-emerald-600 hover:underline">
                        View all posts &rarr;
                    </Link>
                </div>
            </section>

            {/* Cool Stuff / Extras */}
            <section>
                <h2 className="font-serif text-2xl font-bold mb-6 text-black dark:text-white">
                    Stuff I find cool
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    Symmetry-aware methods, biomolecule design, protein/molecular dynamics,
                    mechanistic interpretability of LLMs.
                </p>
            </section>
        </div>
    );
}
