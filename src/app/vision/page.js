import GDocEmbed from '../../components/GDocEmbed';

export const metadata = {
    title: 'Vision – Raunak Kumar',
    description: 'My research vision: on longevity, dynamics, and the role of computation in understanding life.',
};

export default function VisionPage() {
    const docUrl = 'https://docs.google.com/document/d/1q-27wyrcnrKmVfCMuNiwF4KutRq4HQQqR0g8buxUoOo/edit?usp=sharing';

    return (
        <div className="max-w-5xl mx-auto px-6 pt-20 pb-24">
            <header className="mb-8">
                <h1 className="font-serif text-3xl font-bold text-black dark:text-white mb-2">Vision</h1>
                <p className="text-stone-500 dark:text-stone-400 text-[15px] leading-relaxed max-w-2xl">
                    On longevity, dynamics, and the role of computation in understanding life
                </p>
            </header>

            <GDocEmbed
                title="Vision"
                description="On longevity, dynamics, and the role of computation in understanding life"
                docUrl={docUrl}
            />
        </div>
    );
}
