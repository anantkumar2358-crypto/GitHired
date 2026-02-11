"use client";

import { useUser } from '@clerk/nextjs';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight } from 'lucide-react';
// import exampleImage from 'figma:asset/36799642584525f01dced4752e7ee5ccfca86cca.png'; // Removed unused import

export function Hero() {
    const { isSignedIn } = useUser();
    return (
        <section id="home" className="relative min-h-screen flex items-center justify-center px-6 pt-20">
            <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600/10 border border-blue-600/20 mb-6"
                        >
                            <Sparkles className="w-4 h-4 text-blue-600" />
                            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                                Transform Your Resume
                            </span>
                        </motion.div>

                        <h1 className="text-5xl md:text-7xl font-bold mb-6 text-gray-900 dark:text-white">
                            <motion.span
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                                className="block"
                            >
                                Create a
                            </motion.span>
                            <motion.span
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                                className="block bg-gradient-to-r from-blue-600 via-slate-700 to-blue-600 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient"
                            >
                                Stunning Portfolio
                            </motion.span>
                        </h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.5 }}
                            className="text-lg text-gray-600 dark:text-gray-400 mb-8"
                        >
                            Transform your resume into a stunning, interactive portfolio that stands out.
                            Showcase your work with beautiful animations and modern design.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                            className="flex flex-wrap gap-4"
                        >
                            {isSignedIn ? (
                                <motion.a
                                    href="/generate"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white transition-all bg-blue-600 rounded-full hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/30"
                                >
                                    Generate Portfolio
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </motion.a>
                            ) : (
                                <motion.a
                                    href="/sign-in"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white transition-all bg-blue-600 rounded-full hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/30"
                                >
                                    Login / Sign Up
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </motion.a>
                            )}
                            <motion.a
                                href="/ats-check"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-gray-900 transition-all bg-white border-2 border-gray-200 rounded-full hover:border-blue-600 hover:text-blue-600 dark:bg-gray-800 dark:text-white dark:border-gray-700 dark:hover:border-blue-400 dark:hover:text-blue-400"
                            >
                                Check ATS Score
                            </motion.a>
                        </motion.div>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.8, rotateY: 45 }}
                    animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                    transition={{ duration: 1, delay: 0.4 }}
                    className="relative"
                >
                    <motion.div
                        animate={{
                            y: [0, -20, 0],
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                        className="relative"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-slate-700 rounded-3xl blur-3xl opacity-30"></div>

                    </motion.div>

                    {/* Floating elements */}
                    <motion.div
                        animate={{
                            y: [0, -15, 0],
                            rotate: [0, 5, 0],
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                        className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-br from-blue-600 to-slate-700 rounded-2xl shadow-xl opacity-80"
                    />
                    <motion.div
                        animate={{
                            y: [0, 15, 0],
                            rotate: [0, -5, 0],
                        }}
                        transition={{
                            duration: 3.5,
                            repeat: Infinity,
                            ease: 'easeInOut',
                            delay: 0.5,
                        }}
                        className="absolute -bottom-10 -left-10 w-16 h-16 bg-gradient-to-br from-slate-700 to-blue-600 rounded-full shadow-xl opacity-80"
                    />
                </motion.div>
            </div>
        </section>
    );
}
