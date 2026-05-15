import { getResearchGraphData } from '../../lib/research';
import ResearchView from '../../components/ResearchView';

export default function ResearchPage() {
    const data = getResearchGraphData();
    return <ResearchView data={data} />;
}
