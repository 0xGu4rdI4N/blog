import WatchBoard from '../../components/WatchBoard';

export const metadata = {
    title: 'Startup Watch — Raunak',
    description: 'Daily-checked open roles at startups I follow.',
    robots: { index: false, follow: false },
};

export default function WatchPage() {
    return <WatchBoard />;
}
