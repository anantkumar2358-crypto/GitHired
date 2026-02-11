"use client";

import { useState } from 'react';
import { Share2, Linkedin, Twitter, Mail, Link2, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ShareButtonProps {
    portfolioUrl: string;
    userName: string;
    title?: string;
}

export function ShareButton({ portfolioUrl, userName, title = "Check out my portfolio!" }: ShareButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    const shareOptions = [
        {
            name: 'LinkedIn',
            icon: Linkedin,
            color: 'hover:bg-[#0077B5] hover:text-white',
            action: () => {
                const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(portfolioUrl)}`;
                window.open(linkedinUrl, '_blank', 'width=600,height=400');
            }
        },
        {
            name: 'Twitter',
            icon: Twitter,
            color: 'hover:bg-[#1DA1F2] hover:text-white',
            action: () => {
                const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(portfolioUrl)}&text=${encodeURIComponent(title)}&hashtags=portfolio,webdev`;
                window.open(twitterUrl, '_blank', 'width=600,height=400');
            }
        },
        {
            name: 'Email',
            icon: Mail,
            color: 'hover:bg-gray-600 hover:text-white',
            action: () => {
                const subject = encodeURIComponent(`${userName}'s Portfolio`);
                const body = encodeURIComponent(`${title}\n\n${portfolioUrl}`);
                window.location.href = `mailto:?subject=${subject}&body=${body}`;
            }
        },
        {
            name: copied ? 'Copied!' : 'Copy Link',
            icon: copied ? Check : Link2,
            color: copied ? 'bg-green-500 text-white' : 'hover:bg-purple-600 hover:text-white',
            action: async () => {
                try {
                    await navigator.clipboard.writeText(portfolioUrl);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                } catch (err) {
                    console.error('Failed to copy:', err);
                }
            }
        }
    ];

    return (
        <div className="relative">
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-3 md:px-4 h-9 bg-purple-600 hover:bg-purple-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
                <Share2 className="w-4 h-4" />
                <span className="font-medium hidden sm:inline">Share</span>
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 z-40"
                        />

                        {/* Share menu */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.8, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-full mt-2 right-0 bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-neutral-700 p-2 min-w-[200px] z-50"
                        >
                            {shareOptions.map((option, index) => {
                                const Icon = option.icon;
                                return (
                                    <motion.button
                                        key={option.name}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        onClick={() => {
                                            option.action();
                                            if (option.name !== 'Copy Link' && !copied) {
                                                setIsOpen(false);
                                            }
                                        }}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-gray-700 dark:text-gray-300 ${option.color}`}
                                    >
                                        <Icon className="w-5 h-5" />
                                        <span className="font-medium">{option.name}</span>
                                    </motion.button>
                                );
                            })}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
