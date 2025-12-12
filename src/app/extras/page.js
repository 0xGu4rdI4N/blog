import { getSortedExtrasData } from '../../lib/extras';
import ExtrasList from '../../components/ExtrasList';

export default function ExtrasPage() {
    const extras = getSortedExtrasData();

    return (
        <div className="max-w-2xl mx-auto px-6 pt-20 pb-32">
            <div className="mb-12">
                <h1 className="font-serif text-4xl font-bold mb-4 text-black dark:text-white">Extras</h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                    A collection of articles, blogs, videos and books which I found a lot exciting.
                </p>
            </div>

            <ExtrasList items={extras} />
        </div>
    );
}
