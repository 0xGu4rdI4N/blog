

import Link from 'next/link';
import { getSortedPostsData } from '../lib/posts';
import { PUBLICATIONS } from '../lib/data';
import { User, Target, Briefcase, GraduationCap, Calendar, Award, BookOpen, ChevronRight, Globe } from 'lucide-react';

export default function Home() {
    const recentPosts = getSortedPostsData().slice(0, 3);

    return (
        <div className="max-w-6xl mx-auto px-6 pt-6 pb-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* Left Sidebar: Present Commitments */}
                <aside className="lg:col-span-3 space-y-4 order-1">
                    <div className="bg-stone-50 dark:bg-neutral-900/50 border border-stone-200 dark:border-neutral-800 rounded-2xl p-5 shadow-sm">
                        <div className="flex flex-col items-center text-center mb-4">
                            <div className="w-28 h-28 bg-stone-200 dark:bg-neutral-800 rounded-xl mb-3 flex items-center justify-center overflow-hidden border border-stone-300 dark:border-neutral-700 shadow-inner">
                                <img src="/blog/images/profile.jpg" alt="Raunak" className="w-full h-full object-cover" />
                            </div>
                            <h2 className="text-[10px] font-bold tracking-widest uppercase text-stone-400 mb-1">Present Commitments</h2>
                        </div>

                        <div className="space-y-3">
                            <div className="flex gap-3">
                                <Target size={16} className="text-rose-500 mt-1 shrink-0" />
                                <div className="text-sm">
                                    <p className="font-bold text-stone-500 dark:text-stone-400 uppercase text-[10px] tracking-wider mb-1">Current Focus</p>
                                    <ul className="space-y-3 text-stone-700 dark:text-stone-300 leading-snug">
                                        <li>
                                            <span className="font-semibold text-black dark:text-white">Subtomogram Alignment:</span> New mathematical formulation for template free alignment
                                        </li>
                                        <li>
                                            <span className="font-semibold text-black dark:text-white">AMP Design:</span> Identifications and Generative designing of Antimicrobial Peptides
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-2 border-t border-stone-200 dark:border-neutral-800">
                                <GraduationCap size={16} className="text-blue-500 mt-1 shrink-0" />
                                <div className="text-sm">
                                    <p className="font-bold text-stone-500 dark:text-stone-400 uppercase text-[10px] tracking-wider mb-1">Education</p>
                                    <p className="text-stone-700 dark:text-stone-300">Undergraduate Student @ <span className="font-semibold">IITR</span></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="lg:col-span-6 order-2">
                    <header className="mb-6">
                        <h1 className="font-serif text-4xl font-bold mb-2 text-black dark:text-white">
                            Raunak
                        </h1>
                        <p className="text-base italic text-gray-600 dark:text-gray-400 mb-4">
                            Undergraduate @IITR, exploring AI & Biology
                        </p>

                        <div className="space-y-2 text-gray-800 dark:text-gray-300 text-[15px] leading-relaxed">
                            <p>
                                I'm interested in <strong>AI4Science</strong>, trying to find the magna carta moment of biology and AI. Biological systems should be the next frontier to uncover the fundamental theories of physics and chemistry.
                            </p>
                            <p>
                                I believe the next gen models should be blended with core scientific theories and be physics-informed by inducing inductive biases from heuristics learnt over millions of years.
                            </p>
                            <p>
                                I write about my learnings and random thoughts (<Link href="/writings" className="text-emerald-600 hover:underline">blog</Link>).
                            </p>
                        </div>

                        {/* Social Links */}
                        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-emerald-600 dark:text-emerald-400 text-sm font-medium">
                            <a href="https://x.com/Gu4rd_I4N" className="hover:underline flex items-center gap-1">x (twitter)</a>
                            <span className="text-gray-300">/</span>
                            <a href="mailto:raunak0831@gmail.com" className="hover:underline flex items-center gap-1">email</a>
                            <span className="text-gray-300">/</span>
                            <a href="/blog/cv.pdf" className="hover:underline flex items-center gap-1">cv</a>
                            <span className="text-gray-300">/</span>
                            <a href="https://github.com/0xGu4rdI4N" className="hover:underline flex items-center gap-1">github</a>
                        </div>
                    </header>

                    {/* Publications */}
                    <section className="mb-6">
                        <h2 className="font-serif text-xl font-bold mb-3 text-black dark:text-white border-b border-stone-200 dark:border-neutral-800 pb-1">
                            Publications
                        </h2>
                        <div className="space-y-4">
                            {PUBLICATIONS.length > 0 ? (
                                PUBLICATIONS.map((paper, i) => (
                                    <div key={i} className="group">
                                        <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 group-hover:text-emerald-600 transition-colors">
                                            {paper.title}
                                        </h3>
                                        <p className="text-sm text-stone-500 mb-2 italic">{paper.venue}</p>
                                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
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
                    <section className="mb-6">
                        <h2 className="font-serif text-xl font-bold mb-3 text-black dark:text-white border-b border-stone-200 dark:border-neutral-800 pb-1">
                            Recent Writing
                        </h2>
                        <ul className="space-y-2">
                            {recentPosts.map((post) => (
                                <li key={post.id} className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 group text-[15px]">
                                    <Link href={`/writings/${post.id}`} className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-emerald-600 transition-colors">
                                        {post.title}
                                    </Link>
                                    <span className="text-sm text-gray-400 font-mono shrink-0">
                                        {post.date}
                                    </span>
                                </li>
                            ))}
                        </ul>
                        <div className="mt-3">
                            <Link href="/writings" className="inline-flex items-center text-sm font-bold text-emerald-600 hover:gap-2 transition-all">
                                View all posts <ChevronRight size={14} />
                            </Link>
                        </div>
                    </section>

                    {/* Things I find cool */}
                    <section>
                        <h2 className="font-serif text-xl font-bold mb-3 text-black dark:text-white border-b border-stone-200 dark:border-neutral-800 pb-1">
                            Things I find cool
                        </h2>
                        <div className="flex flex-wrap gap-1.5">
                            {["Drug Discovery", "Interpretability", "Protein Design", "Geometric Deep Learning", "Physics induced Models"].map(tag => (
                                <span key={tag} className="px-3 py-1 bg-stone-100 dark:bg-neutral-900 text-stone-600 dark:text-neutral-400 rounded-full text-sm border border-stone-200 dark:border-neutral-800">
                                    {tag}
                                </span>
                            ))}
                            <span className="px-3 py-1 bg-stone-100 dark:bg-neutral-900 rounded-full text-sm border border-stone-200 dark:border-neutral-800 font-bold">
                                <span className="text-rose-500">C</span><span className="text-orange-500">o</span><span className="text-amber-500">l</span><span className="text-green-500">o</span><span className="text-blue-500">r</span><span className="text-indigo-500">s</span>
                            </span>
                        </div>
                    </section>
                </main>

                {/* Right Sidebar: Past Commitments */}
                <aside className="lg:col-span-3 space-y-4 order-3">
                    <div className="bg-stone-50 dark:bg-neutral-900/50 border border-stone-200 dark:border-neutral-800 rounded-2xl p-5 shadow-sm">
                        <div className="mb-4">
                            <h2 className="text-[10px] font-bold tracking-widest uppercase text-stone-400 text-center">Past Commitments</h2>
                        </div>

                        <div className="space-y-4">
                            <div className="flex gap-3">
                                <Calendar size={16} className="text-stone-400 mt-1 shrink-0" />
                                <div className="text-sm">
                                    <p className="font-bold text-stone-500 dark:text-stone-400 uppercase text-[10px] tracking-wider mb-1">Past Project</p>
                                    <p className="text-stone-800 dark:text-stone-200 leading-snug">
                                        Cognitive workload classification using topological data analysis
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <Briefcase size={16} className="text-stone-400 mt-1 shrink-0" />
                                <div className="text-sm">
                                    <p className="font-bold text-stone-500 dark:text-stone-400 uppercase text-[10px] tracking-wider mb-1">Past Role</p>
                                    <p className="text-stone-800 dark:text-stone-200 leading-snug">
                                        Research Intern @ <span className="font-semibold"><a href="https://mandrakebio.com">MandrakeBio</a></span>
                                    </p>
                                    <p className="text-[10px] text-stone-400 mt-0.5">Winter 2025</p>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <Award size={16} className="text-amber-500 mt-1 shrink-0" />
                                <div className="text-sm">
                                    <p className="font-bold text-stone-500 dark:text-stone-400 uppercase text-[10px] tracking-wider mb-1">Milestone</p>
                                    <p className="text-stone-800 dark:text-stone-200 leading-snug">
                                        Amgen Scholar
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
