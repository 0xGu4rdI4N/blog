'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
    const pathname = usePathname();

    const navItems = [
        { name: 'Home', path: '/' },
        { name: 'Writing', path: '/writings' },
        { name: 'Extras', path: '/extras' },
    ];

    return (
        <nav className="fixed top-0 left-0 z-50 w-full bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md border-b border-slate-200 dark:border-neutral-800">
            <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
                <div className="flex items-center gap-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.path || (item.path !== '/' && pathname.startsWith(item.path));

                        return (
                            <Link
                                key={item.path}
                                href={item.path}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${isActive
                                    ? 'bg-slate-100 dark:bg-neutral-800 text-slate-900 dark:text-slate-100'
                                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-neutral-900'
                                    }`}
                            >
                                {item.name}
                            </Link>
                        );
                    })}
                </div>

                <ThemeToggle />
            </div>
        </nav>
    );
}
