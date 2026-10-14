import { VISION } from '../../lib/data';

export const metadata = {
    title: 'Vision – Raunak Kumar',
    description: 'My research vision: on longevity, dynamics, and the role of computation in understanding life.',
};

export default function VisionPage() {
    return (
        <div className="max-w-2xl mx-auto px-6 pt-20 pb-32">

            {/* Header */}
            <div className="mb-12">
                <h1 className="font-serif text-4xl font-bold mb-4 text-black dark:text-white">Vision</h1>
                <p className="text-sm text-stone-400 uppercase tracking-widest font-medium">
                    On longevity, dynamics, and the role of computation in understanding life
                </p>
            </div>

            {/* Essay Body */}
            <article className="space-y-6 text-[16px] leading-[1.85] text-gray-800 dark:text-gray-300">
                {/* First paragraph — the library scene — pull quote treatment */}
                <p className="font-serif text-[18px] leading-[1.8] text-gray-900 dark:text-gray-200 border-l-2 border-stone-300 dark:border-neutral-700 pl-5 italic">
                    {VISION.paragraphs[0]}
                </p>

                {/* Rest of the essay paragraphs */}
                {VISION.paragraphs.slice(1, 4).map((para, i) => (
                    <p key={i}>{para}</p>
                ))}

                {/* Divider before the science section */}
                <div className="flex items-center gap-4 py-4">
                    <div className="h-px flex-1 bg-stone-200 dark:bg-neutral-800" />
                    <span className="text-stone-400 text-xs uppercase tracking-widest font-medium">The Science</span>
                    <div className="h-px flex-1 bg-stone-200 dark:bg-neutral-800" />
                </div>

                {VISION.paragraphs.slice(4).map((para, i) => (
                    <p key={i}>{para}</p>
                ))}
            </article>

            {/* Keywords */}
            <div className="mt-16 pt-8 border-t border-stone-200 dark:border-neutral-800">
                <p className="text-[10px] font-bold tracking-widest uppercase text-stone-400 mb-4">Keywords</p>
                <div className="flex flex-wrap gap-2">
                    {VISION.keywords.map((kw) => (
                        <span
                            key={kw}
                            className="px-3 py-1 bg-stone-100 dark:bg-neutral-900 text-stone-600 dark:text-neutral-400 rounded-full text-sm border border-stone-200 dark:border-neutral-800"
                        >
                            {kw}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}
