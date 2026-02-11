import { Moon, Sun, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { UserButton, useUser } from '@clerk/nextjs';
import GooeyNav from './GooeyNav';
import Link from 'next/link';
import NextImage from 'next/image';

export function Navigation({ forceDark = false }: { forceDark?: boolean }) {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const { isSignedIn, user } = useUser();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    const navItems = [
        { label: "Home", href: "/" },
        { label: "Portfolio", href: isSignedIn ? "/generate" : "/sign-in?redirect_url=/generate" },
        { label: "ATS Scanner", href: isSignedIn ? "/ats-check" : "/sign-in?redirect_url=/ats-check" },
        ...(isSignedIn
            ? [{ label: "Dashboard", href: "/dashboard" }]
            : [{ label: "Login", href: "/sign-in" }]
        ),
    ];

    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="fixed top-0 left-0 right-0 z-50 px-6 py-6 backdrop-blur-md bg-white/70 dark:bg-black/50 border-b border-gray-200 dark:border-white/10 transition-all duration-300"
            >
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                        >
                            <NextImage
                                src="/logo.png"
                                alt="GitHired"
                                width={120}
                                height={40}
                                className="h-10 w-auto object-contain scale-[2.2] origin-left dark:invert"
                                priority
                            />
                        </motion.div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-6">
                        <GooeyNav items={navItems} forceDark={forceDark} />

                        {isSignedIn && <UserButton afterSignOutUrl="/" />}

                        {mounted && (
                            <motion.button
                                onClick={toggleTheme}
                                whileHover={{ scale: 1.15, rotate: 180 }}
                                whileTap={{ scale: 0.9 }}
                                transition={{ duration: 0.3 }}
                                className={`p-2 rounded-full transition-colors ${forceDark
                                    ? 'text-gray-200 hover:bg-white/10'
                                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                                    }`}
                            >
                                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                            </motion.button>
                        )}
                    </div>

                    {/* Mobile Navigation Toggle */}
                    <div className="flex items-center gap-4 md:hidden">
                        {isSignedIn && <UserButton afterSignOutUrl="/" />}
                        {mounted && (
                            <motion.button
                                onClick={toggleTheme}
                                className={`p-2 rounded-full transition-colors ${forceDark
                                    ? 'text-gray-200 hover:bg-white/10'
                                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                                    }`}
                            >
                                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                            </motion.button>
                        )}
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="p-2 text-gray-600 dark:text-gray-300"
                        >
                            <Menu size={24} />
                        </button>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="fixed inset-0 z-[60] bg-white/95 dark:bg-black/95 backdrop-blur-xl flex flex-col justify-center items-center md:hidden"
                    >
                        <button
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="absolute top-6 right-6 p-2 text-gray-600 dark:text-gray-300"
                        >
                            <X size={32} />
                        </button>

                        <div className="flex flex-col gap-8 text-center">
                            {navItems.map((item, index) => (
                                <motion.div
                                    key={item.label}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Link
                                        href={item.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="text-2xl font-bold text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                    >
                                        {item.label}
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
