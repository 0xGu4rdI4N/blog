/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export', // Enables static HTML generation
    // basePath removed for root deployment
    images: {
        unoptimized: true, // Required for GitHub Pages
    },
};

export default nextConfig;