import { getUniversities } from '../../lib/labs';
import LabsAtlas from '../../components/LabsAtlas';

export const metadata = {
    title: 'AI4Science Atlas — Raunak',
    description:
        'Searchable directory of labs across doctoral programs with a genuine AI/ML component applied to a science domain.',
};

export default function LabsPage() {
    const universities = getUniversities();
    return <LabsAtlas universities={universities} />;
}
