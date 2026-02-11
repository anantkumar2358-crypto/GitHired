"use client";
import { motion } from 'motion/react';
import { Code2, Github, Linkedin, Mail } from 'lucide-react';
import Link from 'next/link';

interface HeroProps {
    name: string;
    headline: string;
    summary: string;
    socialLinks: {
        github?: string;
        linkedin?: string;
        email?: string;
    };
}

export function Hero({ name, headline, summary, socialLinks }: HeroProps) {
    // Parse headline to highlight parts if possible, or just display it.
    // For now, we'll try to highlight the last few words or providing a specific structure.
    // Let's assume the headline is passed as a simple string for now.

    return (
        <section className="relative min-h-screen flex items-center justify-center px-6 py-20 bg-gradient-to-b from-neutral-50 to-white dark:from-neutral-950 dark:to-neutral-900">
            <div className="max-w-5xl mx-auto text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="mb-6"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-neutral-200 shadow-sm mb-8 dark:bg-neutral-900 dark:border-neutral-800">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-sm text-neutral-600 dark:text-neutral-400">Available for opportunities</span>
                    </div>
                </motion.div>

                <motion.h1
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-6xl md:text-8xl mb-6 text-neutral-900 font-bold tracking-tight dark:text-white"
                >
                    {/* Attempting to style the name or headline dynamically. */}
                    Hello, I'm <span className="text-blue-600">{name}</span>
                </motion.h1>
                <motion.h2
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="text-3xl md:text-5xl mb-6 text-neutral-700 font-medium dark:text-neutral-200"
                >
                    {headline}
                </motion.h2>

                <motion.p
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-xl text-neutral-600 max-w-2xl mx-auto mb-12 leading-relaxed dark:text-neutral-400"
                >
                    {summary}
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="flex items-center justify-center gap-4 mb-16"
                >
                    <a
                        href="#contact"
                        onClick={(e) => {
                            e.preventDefault();
                            document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl hover:scale-105 cursor-pointer"
                    >
                        Get in touch
                    </a>
                    <a
                        href="#work"
                        onClick={(e) => {
                            e.preventDefault();
                            document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="px-8 py-4 bg-white text-neutral-900 rounded-lg border border-neutral-200 hover:border-neutral-300 hover:shadow-sm transition-all duration-300 font-medium dark:bg-neutral-800 dark:text-white dark:border-neutral-700 dark:hover:bg-neutral-700 hover:scale-105 cursor-pointer"
                    >
                        View my work
                    </a>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    className="flex items-center justify-center gap-6"
                >
                    {socialLinks.github && (
                        <a
                            href={socialLinks.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-12 h-12 flex items-center justify-center bg-white rounded-full border border-neutral-200 text-neutral-600 hover:text-blue-600 hover:border-blue-600 hover:shadow-sm transition-all duration-300 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 dark:hover:text-blue-400 dark:hover:border-blue-400"
                            aria-label="GitHub"
                        >
                            <Github className="w-5 h-5" />
                        </a>
                    )}
                    {socialLinks.linkedin && (
                        <a
                            href={socialLinks.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-12 h-12 flex items-center justify-center bg-white rounded-full border border-neutral-200 text-neutral-600 hover:text-blue-600 hover:border-blue-600 hover:shadow-sm transition-all duration-300 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 dark:hover:text-blue-400 dark:hover:border-blue-400"
                            aria-label="LinkedIn"
                        >
                            <Linkedin className="w-5 h-5" />
                        </a>
                    )}
                    {socialLinks.email && (
                        <a
                            href={`mailto:${socialLinks.email}`}
                            className="w-12 h-12 flex items-center justify-center bg-white rounded-full border border-neutral-200 text-neutral-600 hover:text-blue-600 hover:border-blue-600 hover:shadow-sm transition-all duration-300 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 dark:hover:text-blue-400 dark:hover:border-blue-400"
                            aria-label="Email"
                        >
                            <Mail className="w-5 h-5" />
                        </a>
                    )}
                    <Link
                        href="#portfolio"
                        className="w-12 h-12 flex items-center justify-center bg-white rounded-full border border-neutral-200 text-neutral-600 hover:text-blue-600 hover:border-blue-600 hover:shadow-sm transition-all duration-300 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 dark:hover:text-blue-400 dark:hover:border-blue-400"
                        aria-label="Portfolio"
                    >
                        <Code2 className="w-5 h-5" />
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
