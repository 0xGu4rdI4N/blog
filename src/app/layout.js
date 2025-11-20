import { Inter, Merriweather, JetBrains_Mono } from "next/font/google";
import "./globals.css";
// Import CSS for Math and Code Highlighting
import "katex/dist/katex.min.css"; 
// You can download a prism theme css and import it, or use a CDN link in head
// For production, it's best to import a CSS file.

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const merriweather = Merriweather({ 
  weight: ['300', '400', '700', '900'],
  subsets: ["latin"], 
  variable: "--font-serif" 
});
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata = {
  title: "Raunak | Bio-Computational Researcher",
  description: "Exploring the intersection of Biology and ML.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${merriweather.variable} ${jetbrains.variable}`}>
      <head>
        {/* One Dark theme for Prism Code Blocks */}
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css" />
      </head>
      <body className="bg-white dark:bg-neutral-950 text-slate-900 dark:text-slate-300 transition-colors duration-300">
        {children}
      </body>
    </html>
  );
}