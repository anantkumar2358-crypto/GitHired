"use client";

import { Linkedin } from "lucide-react";
import Link from "next/link";

export function LandingFooter() {
    return (
        <footer className="relative z-10 backdrop-blur-sm bg-white/50 dark:bg-black/30 border-t border-gray-200 dark:border-white/10 py-16 px-6 mt-20">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-12">
                    {/* Left Section - Logo and Mission */}
                    <div className="space-y-6 max-w-md">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">GitHired</h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                            Our mission is to democratize portfolio creation tools and empower developers and
                            job seekers worldwide.
                        </p>

                        {/* Social Media */}
                        <div className="flex space-x-3">
                            <a
                                href="https://linkedin.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full border-2 border-gray-300 dark:border-white/30 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-gray-700 dark:text-white"
                            >
                                <Linkedin className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Right Section - Navigation Links (Vertical) */}
                    <nav className="flex flex-col gap-4 md:items-end">
                        <Link
                            href="/"
                            className="text-base text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                            Home
                        </Link>
                        <Link
                            href="/generate"
                            className="text-base text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                            Portfolio
                        </Link>
                        <Link
                            href="/ats-check"
                            className="text-base text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                            ATS Scanner
                        </Link>
                        <Link
                            href="/dashboard"
                            className="text-base text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                            Dashboard
                        </Link>
                    </nav>
                </div>

                {/* Bottom Section - Copyright and Legal */}
                <div className="border-t border-gray-200 dark:border-white/20 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Copyright 2025© GitHired. All Rights Reserved
                    </p>
                    <div className="flex space-x-6 text-sm">
                        <Link href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors underline">
                            Privacy Policy
                        </Link>
                        <Link href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors underline">
                            Terms & Conditions
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
