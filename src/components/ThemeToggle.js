'use client';

import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';

export default function ThemeToggle() {
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        // Check local storage, default to light
        const isDark = localStorage.getItem('theme') === 'dark';

        setDarkMode(isDark);
        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, []);

    const toggleTheme = () => {
        const newMode = !darkMode;
        setDarkMode(newMode);

        if (newMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    };

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-full transition-colors hover:bg-slate-100 dark:hover:bg-neutral-800 text-slate-600 dark:text-slate-400"
            aria-label="Toggle theme"
        >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
    );
}
