import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const extrasDirectory = path.join(process.cwd(), 'content/extras');

export async function getSortedExtrasData() {
    // Get file names under /extras
    if (!fs.existsSync(extrasDirectory)) return [];

    const fileNames = fs.readdirSync(extrasDirectory);
    const mdFiles = fileNames.filter(fileName => fileName.endsWith('.md'));
    let allExtrasData = [];
    mdFiles.forEach((fileName) => {
        // Read markdown file as string
        const fullPath = path.join(extrasDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');

        // Split by the *** delimiter
        const chunks = fileContents.split(/\n\*\*\*\n/);
        
        chunks.forEach((chunk, index) => {
            const chunkTrimmed = chunk.trim();
            if (!chunkTrimmed) return;

            // Use gray-matter to parse the metadata section
            const matterResult = matter(chunkTrimmed);
            
            // Combine the data with a unique id
            const id = `${fileName.replace(/\.md$/, '')}-${index}`;
            allExtrasData.push({
                id,
                ...matterResult.data,
                content: matterResult.content,
            });
        });
    });

    const videosPath = path.join(extrasDirectory, 'videos.txt');
    if (fs.existsSync(videosPath)) {
        const videosContent = fs.readFileSync(videosPath, 'utf8');
        const urls = videosContent.split('\n').map(l => l.trim()).filter(l => l);
        
        const videoPromises = urls.map(async (url) => {
            try {
                const res = await fetch(`https://www.youtube.com/oembed?url=${url}&format=json`);
                if (!res.ok) return null;
                const data = await res.json();
                
                // Extract video ID for a unique key
                const urlObj = new URL(url);
                const videoId = urlObj.searchParams.get('v') || url;

                return {
                    id: videoId,
                    type: 'video',
                    title: data.title,
                    url: url,
                    image: data.thumbnail_url,
                    date: '2026-05-13',
                    author: data.author_name,
                    content: ''
                };
            } catch (err) {
                console.error("Failed to fetch video data for", url, err);
                return null;
            }
        });

        const videoItems = (await Promise.all(videoPromises)).filter(v => v !== null);
        allExtrasData = [...allExtrasData, ...videoItems];
    }

    // Sort extras by date
    return allExtrasData.sort((a, b) => {
        if (a.date < b.date) {
            return 1;
        } else {
            return -1;
        }
    });
}
