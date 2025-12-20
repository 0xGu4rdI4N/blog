/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export', // Enables static HTML generation
    basePath: '/blog', // basePath for project deployment
    images: {
        unoptimized: true, // Required for GitHub Pages
    },
};

export default nextConfig;