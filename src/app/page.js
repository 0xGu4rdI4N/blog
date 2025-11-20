import Link from 'next/link';
import { getSortedPostsData } from '../lib/posts';
import { PUBLICATIONS, TIMELINE_ITEMS } from '../lib/data';
import BioNetworkCanvas from '../components/BioNetworkCanvas';
import { Github, Linkedin, Mail, User, Target, History, Database, Network, Briefcase, FileText, Code } from 'lucide-react';

export default function Home() {
    const recentPosts = getSortedPostsData().slice(0, 3);

    return (
        <>
            <BioNetworkCanvas />

            {/* Hero Section */}
            <section className="relative z-10 pt-32 pb-20 px-6 max-w-5xl mx-auto">
                <div className="flex flex-col md:flex-row gap-16 items-start">
                    {/* Profile Photo */}
                    <div className="w-full md:w-1/3 flex flex-col gap-6">
                        <div className="aspect-square w-full rounded-2xl overflow-hidden border-2 shadow-2xl bg-neutral-900 border-neutral-800">
                            <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-neutral-700">
                                <User size={64} strokeWidth={1} />
                                <span className="text-sm font-medium uppercase tracking-widest opacity-50">Photo</span>
                            </div>
                        </div>
                        <div className="flex justify-center gap-4">
                            {[{ Icon: Github }, { Icon: Linkedin }, { Icon: Mail }].map(({ Icon }, i) => (
                                <a key={i} href="#" className="p-3 rounded-full border bg-neutral-900 text-slate-400 border-neutral-800 hover:bg-emerald-500/20 hover:text-emerald-400 transition-all">
                                    <Icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Hero Content */}
                    <div className="w-full md:w-2/3 pt-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-medium mb-6 backdrop-blur-sm bg-neutral-900/50 border-neutral-800 text-emerald-400">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            Online & Researching
                        </div>

                        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-slate-100">
                            Hi, I'm Raunak. <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-violet-600">
                                Bio-Computational Researcher.
                            </span>
                        </h1>

                        <p className="text-lg leading-relaxed mb-12 text-slate-400">
                            I sit at the intersection of biology and artificial intelligence, interpreting biological signals as high-dimensional data structures.
                        </p>

                        {/* What I'm Building */}
                        <div className="space-y-12">
                            <div className="p-6 rounded-xl border bg-neutral-900/30 border-neutral-800 relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-1 h-full bg-violet-500"></div>
                                <h4 className="text-xl font-bold mb-3 flex items-center gap-2 text-violet-400">
                                    <Target size={22} /> What I'm Building Next
                                </h4>
                                <p className="leading-relaxed text-slate-300">
                                    My primary focus is developing <strong>foundational models for cell biology</strong>.
                                    I aim to apply geometric deep learning to accelerate drug discovery.
                                </p>
                            </div>

                            {/* Timeline */}
                            <div>
                                <h4 className="font-bold mb-6 flex items-center gap-2 text-slate-200">
                                    <History size={20} /> Journey So Far
                                </h4>
                                <div className="relative border-l-2 ml-3 space-y-8 border-neutral-800">
                                    {TIMELINE_ITEMS.map((item, index) => (
                                        <div key={index} className="relative pl-8">
                                            <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-2 bg-neutral-950 border-emerald-500"></div>
                                            <span className="text-xs font-mono mb-1 block text-emerald-500">{item.year}</span>
                                            <h5 className="font-semibold text-lg text-slate-200">{item.title}</h5>
                                            <p className="text-sm text-slate-500">{item.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Publications and Recent Writing */}
            <section className="relative z-10 max-w-5xl mx-auto px-6 pb-24">
                <div className="grid md:grid-cols-2 gap-12">
                    {/* Publications */}
                    <div>
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                                <Database size={20} />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-200">Research & Projects</h2>
                        </div>
                        <div className="flex flex-col gap-6">
                            {PUBLICATIONS.map((paper, i) => (
                                <div key={i} className="group relative p-6 rounded-2xl border transition-all duration-300 backdrop-blur-sm bg-neutral-900/40 border-neutral-800 hover:bg-neutral-900/80">
                                    <h3 className="text-xl font-semibold mb-2 group-hover:text-emerald-500 transition-colors text-slate-200">{paper.title}</h3>
                                    <p className="text-sm mb-3 font-medium text-violet-400">{paper.venue}</p>
                                    <p className="text-sm text-slate-400">{paper.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Writing */}
                    <div>
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-2 rounded-lg bg-violet-500/10 text-violet-400">
                                <Network size={20} />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-200">Recent Writing</h2>
                        </div>
                        <div className="border rounded-2xl p-6 backdrop-blur-sm bg-neutral-900/20 border-neutral-800">
                            <div className="grid gap-4">
                                {recentPosts.map(post => (
                                    <Link key={post.id} href={`/blog/${post.id}`} className="cursor-pointer hover:opacity-70">
                                        <h3 className="text-lg font-semibold text-slate-200">{post.title}</h3>
                                        <span className="text-xs font-mono text-slate-500">{post.date}</span>
                                    </Link>
                                ))}
                            </div>
                            <Link href="/blog" className="w-full mt-6 py-3 text-sm rounded-lg transition-colors border border-dashed text-slate-400 hover:bg-neutral-800 border-neutral-700 block text-center">
                                View Archive
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
