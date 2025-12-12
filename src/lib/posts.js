import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypePrism from 'rehype-prism-plus';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';

const postsDirectory = path.join(process.cwd(), 'content/posts');

export function getSortedPostsData() {
  // Get file names under /posts
  if (!fs.existsSync(postsDirectory)) return [];

  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.filter(fileName => fileName.endsWith('.md')).map((fileName) => {
    const id = fileName.replace(/\.md$/, '');
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const matterResult = matter(fileContents);

    return {
      id,
      ...matterResult.data,
    };
  });

  // Sort posts by date
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export function getAllPostIds() {
  if (!fs.existsSync(postsDirectory)) return [];

  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames.map((fileName) => {
    return {
      params: {
        slug: fileName.replace(/\.md$/, ''),
      },
    };
  });
}

import { visit } from 'unist-util-visit';

// ... imports ...

// Custom plugin to transform custom tags
function rehypeCustomTags() {
  return (tree) => {
    visit(tree, 'element', (node) => {
      if (node.tagName === 'cent') {
        node.tagName = 'div';
        node.properties = node.properties || {};
        node.properties.style = 'text-align: center;';
      }
      if (node.tagName === 'pink') {
        node.tagName = 'div';
        node.properties = node.properties || {};
        node.properties.style = 'border-left: 4px solid #ec4899; background-color: #fdf2f8; padding: 1rem; border-radius: 8px; margin: 1rem 0;';
        // Add dark mode styles if possible, but inline styles are tricky for dark mode. 
        // Alternatively, we can assign a class and rely on Tailwind/Global CSS. 
        // Let's try assigning a class instead for better dark mode support.
        node.properties.className = ['pink-callout'];
        // We will remove the inline style for background/border color and move it to global css?
        // User asked for "pink left border", let's stick to inline for simplicity or use Tailwind classes if rehype allows classNames that Tailwind picks up (it might not if not safelisted).
        // Since we are using Tailwind, let's try using Tailwind classes directly.
        // "border-l-4 border-pink-500 bg-pink-50 dark:bg-pink-950/30 rounded-lg p-4 my-4"
        node.properties.className = ['border-l-4', 'border-pink-500', 'bg-pink-50', 'dark:bg-pink-900/20', 'rounded-lg', 'p-4', 'my-4'];
      }
    });
  };
}

export async function getPostData(id) {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const matterResult = matter(fileContents);

  // Use Unified/Remark/Rehype to process Markdown -> HTML
  // This pipeline supports Math ($$ x $$) and Code Highlighting
  const processedContent = await unified()
    .use(remarkParse)
    .use(remarkMath)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeCustomTags) // Custom plugin
    .use(rehypeKatex) // Render Math
    .use(rehypePrism, { showLineNumbers: true }) // Render Code
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(matterResult.content);

  const contentHtml = processedContent.toString();

  return {
    id,
    contentHtml,
    ...matterResult.data,
  };
}