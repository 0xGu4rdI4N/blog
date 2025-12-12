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

import remarkDirective from 'remark-directive';

// Custom plugin to handle remark directives (:::cent, :::pink)
function remarkCustomDirectives() {
  return (tree) => {
    visit(tree, (node) => {
      if (
        node.type === 'containerDirective' ||
        node.type === 'leafDirective' ||
        node.type === 'textDirective'
      ) {
        const data = node.data || (node.data = {});
        const attributes = node.attributes || {};

        if (node.name === 'cent') {
          data.hName = 'div';
          data.hProperties = {
            style: 'text-align: center;',
            ...attributes,
          };
        }

        if (node.name === 'pink') {
          data.hName = 'div';
          data.hProperties = {
            className: ['border-l-4', 'border-pink-500', 'bg-pink-50', 'dark:bg-pink-900/20', 'rounded-lg', 'p-4', 'my-4'],
            ...attributes,
          };
        }
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
    .use(remarkDirective) // Handle ::: syntax
    .use(remarkCustomDirectives) // Process our custom directives
    .use(remarkRehype, { allowDangerousHtml: true })
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