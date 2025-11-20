/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export', // Enables static HTML generation
    images: {
        unoptimized: true, // Required for GitHub Pages
    },
};

export default nextConfig;