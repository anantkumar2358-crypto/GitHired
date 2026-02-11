"use client";
import { motion } from 'motion/react';
import { SiLeetcode, SiCodeforces } from "react-icons/si";

interface LeetCodeStats {
    totalSolved: number;
    ranking: number;
    easySolved: number;
    mediumSolved: number;
    hardSolved: number;
    contestRating?: number;
    contestGlobalRanking?: number;
    totalContest?: number;
}

interface CodeforcesStats {
    rating: number;
    rank: string;
    maxRating: number;
    maxRank: string;
}

interface CodingStatsProps {
    leetCode: LeetCodeStats | null;
    codeforces: CodeforcesStats | null;
}

export function CodingStats({ leetCode, codeforces }: CodingStatsProps) {
    if (!leetCode && !codeforces) return null;

    return (
        <section className="relative px-6 py-24 bg-neutral-50 dark:bg-neutral-900/50">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-5xl mb-4 text-neutral-900 font-bold dark:text-white">
                        Competitive Programming
                    </h2>
                    <p className="text-neutral-600 text-lg mb-2 dark:text-neutral-400">
                        Problem solving across different platforms
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* LeetCode Card */}
                    {leetCode && (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-8 shadow-sm flex flex-col h-full"
                        >
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 bg-yellow-500/10 rounded-xl">
                                    <SiLeetcode className="w-8 h-8 text-[#FFA116]" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold dark:text-white">LeetCode</h3>
                                    <p className="text-neutral-500 dark:text-neutral-400">@{leetCode.ranking.toLocaleString()} ranking</p>
                                </div>
                            </div>

                            <div className="flex-1 flex flex-col justify-center">
                                <div className="flex justify-between items-end mb-2">
                                    <span className="text-4xl font-bold dark:text-white">{leetCode.totalSolved}</span>
                                    <span className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">Total Solved</span>
                                </div>

                                <div className="w-full bg-neutral-100 dark:bg-neutral-800 rounded-full h-2 mb-6">
                                    <div
                                        className="bg-[#FFA116] h-2 rounded-full"
                                        style={{ width: '100%' }} // Simplified for visual, ideally calculated against total questions
                                    />
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <div className="text-center p-3 rounded-xl bg-teal-500/5 border border-teal-500/10">
                                        <div className="text-sm text-teal-600 dark:text-teal-400 font-medium mb-1">Easy</div>
                                        <div className="text-xl font-bold dark:text-white">{leetCode.easySolved}</div>
                                    </div>
                                    <div className="text-center p-3 rounded-xl bg-yellow-500/5 border border-yellow-500/10">
                                        <div className="text-sm text-yellow-600 dark:text-yellow-400 font-medium mb-1">Medium</div>
                                        <div className="text-xl font-bold dark:text-white">{leetCode.mediumSolved}</div>
                                    </div>
                                    <div className="text-center p-3 rounded-xl bg-red-500/5 border border-red-500/10">
                                        <div className="text-sm text-red-600 dark:text-red-400 font-medium mb-1">Hard</div>
                                        <div className="text-xl font-bold dark:text-white">{leetCode.hardSolved}</div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* CodeForces Card */}
                    {codeforces && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-8 shadow-sm flex flex-col h-full"
                        >
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 bg-blue-500/10 rounded-xl">
                                    <SiCodeforces className="w-8 h-8 text-[#1F8ACB]" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold dark:text-white">CodeForces</h3>
                                    <p className="text-neutral-500 dark:text-neutral-400">{codeforces.rank}</p>
                                </div>
                            </div>

                            <div className="flex-1 flex flex-col justify-center">
                                <div className="flex justify-between items-end mb-2">
                                    <span className="text-4xl font-bold dark:text-white">{codeforces.rating}</span>
                                    <span className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">Current Rating</span>
                                </div>

                                <div className="w-full bg-neutral-100 dark:bg-neutral-800 rounded-full h-2 mb-6">
                                    <div
                                        className="bg-[#1F8ACB] h-2 rounded-full"
                                        style={{ width: `${Math.min((codeforces.rating / 3000) * 100, 100)}%` }}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800">
                                        <div className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">Max Rating</div>
                                        <div className="text-xl font-bold text-[#1F8ACB]">{codeforces.maxRating}</div>
                                    </div>
                                    <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800">
                                        <div className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">Max Rank</div>
                                        <div className="text-xl font-bold capitalize dark:text-white">{codeforces.maxRank}</div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </section>
    );
}
