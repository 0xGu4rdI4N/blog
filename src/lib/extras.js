import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const extrasDirectory = path.join(process.cwd(), 'content/extras');

export function getSortedExtrasData() {
    // Get file names under /extras
    if (!fs.existsSync(extrasDirectory)) return [];

    const fileNames = fs.readdirSync(extrasDirectory);
    const allExtrasData = fileNames.map((fileName) => {
        // Remove ".md" from file name to get id
        const id = fileName.replace(/\.md$/, '');

        // Read markdown file as string
        const fullPath = path.join(extrasDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');

        // Use gray-matter to parse the post metadata section
        const matterResult = matter(fileContents);

        // Combine the data with the id
        return {
            id,
            ...matterResult.data,
            content: matterResult.content, // We might want the raw content for extras as they are short
        };
    });

    // Sort extras by date
    return allExtrasData.sort((a, b) => {
        if (a.date < b.date) {
            return 1;
        } else {
            return -1;
        }
    });
}
