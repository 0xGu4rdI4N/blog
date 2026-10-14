import { GDOC_EMBEDS } from '../../../lib/data';
import GDocEmbed from '../../../components/GDocEmbed';
import Link from 'next/link';
import { ChevronLeft, FileText } from 'lucide-react';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
    // Must return at least one entry for `output: export` to work.
    // If no docs are configured yet, register a placeholder that will render notFound().
    if (GDOC_EMBEDS.length === 0) return [{ slug: '_placeholder' }];
    return GDOC_EMBEDS.map((doc) => ({ slug: doc.slug }));
}

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const doc = GDOC_EMBEDS.find((d) => d.slug === slug);
    if (!doc) return {};
    return {
        title: `${doc.title} – Raunak Kumar`,
        description: doc.description || '',
    };
}

export const dynamicParams = false;

export default async function NotePage({ params }) {
    const { slug } = await params;
    const doc = GDOC_EMBEDS.find((d) => d.slug === slug);

    if (!doc) notFound();

    return (
        <div className="max-w-5xl mx-auto px-6 pt-20 pb-24">
            <Link
                href="/notes"
                className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-emerald-500 mb-8 transition-colors"
            >
                <ChevronLeft size={16} /> Back to Notes
            </Link>

            <header className="mb-8">
                <h1 className="font-serif text-3xl font-bold text-black dark:text-white mb-2">
                    {doc.title}
                </h1>
                {doc.description && (
                    <p className="text-stone-500 dark:text-stone-400 text-[15px] leading-relaxed max-w-2xl">
                        {doc.description}
                    </p>
                )}
            </header>

            <GDocEmbed title={doc.title} description={doc.description} docUrl={doc.docUrl} />
        </div>
    );
}
