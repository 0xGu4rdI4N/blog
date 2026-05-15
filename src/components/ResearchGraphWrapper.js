import dynamic from 'next/dynamic';

// Dynamically import the graph component with SSR disabled
// This is critical because react-force-graph-2d uses Canvas/window which breaks Next.js server-side rendering
const ResearchGraph = dynamic(
    () => import('./ResearchGraph'),
    { ssr: false, loading: () => <div className="w-full h-[600px] flex items-center justify-center border border-stone-200 dark:border-neutral-800 rounded-2xl bg-stone-50/50 dark:bg-neutral-900/50 text-stone-500 animate-pulse">Loading Knowledge Graph...</div> }
);

export default ResearchGraph;
