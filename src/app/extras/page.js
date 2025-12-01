import { getSortedExtrasData } from '../../lib/extras';
import ExtrasList from '../../components/ExtrasList';

export default function ExtrasPage() {
    const extras = getSortedExtrasData();

    return (
        <div className="pt-32 px-6 pb-20 max-w-6xl mx-auto relative z-10">
            <div className="mb-16 text-center max-w-2xl mx-auto">
                <h1 className="text-4xl font-bold mb-4 text-slate-900 dark:text-slate-200">Digital Garden</h1>
                <p className="text-slate-600 dark:text-slate-400">
                    A collection of micro-thoughts, tools, and readings that don't fit into a full blog post.
                    Consider this my public notebook.
                </p>
            </div>

            <ExtrasList items={extras} />
        </div>
    );
}
