'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
    const pathname = usePathname();

    const navItems = [
        { name: 'Home', path: '/' },
        { name: 'Research', path: '/research' },
        { name: 'Writings', path: '/writings' },
        { name: 'Extras', path: '/extras' },
    ];

    return (
        <nav className="w-full py-8 bg-transparent">
            <div className="max-w-2xl mx-auto px-6 flex items-center justify-center gap-8">
                {navItems.map((item) => {
                    const isActive = pathname === item.path || (item.path !== '/' && pathname.startsWith(item.path));

                    return (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={`text-sm font-medium transition-colors ${isActive
                                ? 'text-black dark:text-white font-bold'
                                : 'text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white'
                                }`}
                        >
                            {item.name}
                        </Link>
                    );
                })}
                <ThemeToggle />
            </div>
        </nav>
    );
}
