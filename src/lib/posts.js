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

// Custom plugin to handle remark directives (:::cent, :::pink, :::references, :cite)
function remarkCustomDirectives() {
  return (tree) => {
    // First pass: collect all citation keys in order of appearance
    const citationOrder = [];
    const citationMap = new Map(); // key -> number

    visit(tree, 'textDirective', (node) => {
      if (node.name === 'cite') {
        const key = node.children?.[0]?.value || '';
        if (key && !citationMap.has(key)) {
          citationOrder.push(key);
          citationMap.set(key, citationOrder.length);
        }
      }
    });

    // Second pass: transform all directives
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

        if (node.name === 'note') {
          data.hName = 'div';
          data.hProperties = {
            className: ['border-l-4', 'border-emerald-500', 'bg-emerald-50', 'dark:bg-emerald-900/20', 'rounded-lg', 'p-4', 'my-4', 'text-sm'],
            ...attributes,
          };
        }

        if (node.name === 'footer') {
          data.hName = 'footer';
          data.hProperties = {
            className: ['mt-12', 'pt-6', 'border-t', 'border-slate-200', 'dark:border-neutral-800', 'text-sm', 'text-slate-500', 'dark:text-slate-400', 'italic'],
            ...attributes,
          };
        }

        // Handle :::dropdown[Title], :::details[Title], :::collapse[Title]
        if (
          (node.name === 'dropdown' || node.name === 'details' || node.name === 'collapse') &&
          node.type === 'containerDirective'
        ) {
          data.hName = 'details';
          data.hProperties = {
            className: ['my-4', 'p-4', 'border', 'border-slate-200', 'dark:border-neutral-800', 'rounded-xl', 'bg-slate-50/50', 'dark:bg-neutral-900/30'],
            ...attributes,
          };

          if (node.children?.[0]?.data?.directiveLabel) {
            const summaryNode = node.children[0];
            const sumData = summaryNode.data || (summaryNode.data = {});
            sumData.hName = 'summary';
            sumData.hProperties = {
              className: ['cursor-pointer', 'font-semibold', 'text-slate-800', 'dark:text-slate-200', 'hover:text-emerald-500', 'transition-colors'],
            };
          }
        }

        // Handle :cite[key] text directive
        if (node.name === 'cite' && node.type === 'textDirective') {
          const key = node.children?.[0]?.value || '';
          const num = citationMap.get(key) || '?';
          data.hName = 'a';
          data.hProperties = {
            href: `#ref-${key}`,
            id: `cite-${key}`,
            className: ['citation-link'],
            title: `Citation: ${key}`,
            ...attributes,
          };
          // Replace children with the citation number
          node.children = [{ type: 'text', value: `[${num}]` }];
        }

        // Handle :::references container directive
        if (node.name === 'references' && node.type === 'containerDirective') {
          data.hName = 'section';
          data.hProperties = {
            id: 'references',
            className: ['references-section'],
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

  // Normalize directive syntax e.g. :::{note} -> :::note
  const normalizedContent = matterResult.content.replace(/^:::\{([a-zA-Z0-9_-]+)\}/gm, ':::$1');

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
    .process(normalizedContent);

  const contentHtml = processedContent.toString();

  return {
    id,
    contentHtml,
    ...matterResult.data,
  };
}