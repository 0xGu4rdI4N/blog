import fs from 'fs';
import path from 'path';

export function getResearchGraphData() {
    const dataPath = path.join(process.cwd(), 'content/research/graph.json');
    if (!fs.existsSync(dataPath)) return { nodes: [], links: [] };
    
    const fileContents = fs.readFileSync(dataPath, 'utf8');
    try {
        return JSON.parse(fileContents);
    } catch (e) {
        console.error("Failed to parse research graph json", e);
        return { nodes: [], links: [] };
    }
}
