'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
    const pathname = usePathname();

    const navItems = [
        { name: 'Home', path: '/' },
        { name: 'Writing', path: '/blog' },
        { name: 'Extras', path: '/extras' },
    ];

    return (
        <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
            <div className="flex items-center gap-2 p-1.5 rounded-full border shadow-lg backdrop-blur-md bg-white/80 dark:bg-neutral-900/80 border-slate-200 dark:border-neutral-800">
                {navItems.map((item) => {
                    const isActive = pathname === item.path || (item.path !== '/' && pathname.startsWith(item.path));

                    return (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${isActive
                                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-neutral-800'
                                }`}
                        >
                            {item.name}
                        </Link>
                    );
                })}

                <div className="w-px h-6 bg-slate-200 dark:bg-neutral-800 mx-1"></div>

                <ThemeToggle />
            </div>
        </nav>
    );
}
