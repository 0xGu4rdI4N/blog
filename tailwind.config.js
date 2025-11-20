/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class', // We will control this manually or with system pref
    content: [
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['var(--font-inter)'],
                serif: ['var(--font-serif)'],
                mono: ['var(--font-mono)'],
            },
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
    ],
};