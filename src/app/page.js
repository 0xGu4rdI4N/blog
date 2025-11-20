import Link from 'next/link';
import BioNetworkCanvas from '../components/BioNetworkCanvas';

export default function Home() {
    return (
        <>
            <BioNetworkCanvas />
            <div className="relative min-h-screen flex items-center justify-center px-6">
                <main className="max-w-4xl mx-auto text-center space-y-8">
                    <h1 className="text-6xl md:text-7xl font-extrabold">
                        <span className="bg-gradient-to-r from-emerald-400 to-violet-500 bg-clip-text text-transparent">
                            Raunak
                        </span>
                    </h1>
                    <p className="text-xl md:text-2xl text-slate-300 font-serif">
                        Bio-Computational Researcher
                    </p>
                    <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                        Exploring the intersection of Biology and Machine Learning
                    </p>
                    <div className="flex gap-4 justify-center pt-8">
                        <Link
                            href="/blog"
                            className="px-8 py-3 rounded-full bg-gradient-to-r from-emerald-500 to-violet-600 text-white font-semibold hover:scale-105 transition-transform shadow-lg hover:shadow-emerald-500/50"
                        >
                            Read the Blog
                        </Link>
                    </div>
                </main>
            </div>
        </>
    );
}
