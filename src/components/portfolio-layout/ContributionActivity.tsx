"use client";
import { motion } from 'motion/react';
import { useState, useMemo } from 'react';

// Types from lib/github.ts
interface ContributionDay {
    date: string;
    count: number;
    level: number;
}

interface ContributionWeek {
    days: ContributionDay[];
}

interface ContributionActivityProps {
    weeks?: ContributionWeek[];
}

const getIntensity = (level: number) => {
    switch (level) {
        case 0: return 'bg-neutral-100 dark:bg-neutral-800/60 dark:border-neutral-700/60';
        case 1: return 'bg-green-200 dark:bg-green-900 dark:text-green-100 dark:border-green-800'; // Increased visibility
        case 2: return 'bg-green-400 dark:bg-green-700 dark:border-green-600';
        case 3: return 'bg-green-600 dark:bg-green-600 dark:border-green-500';
        case 4: return 'bg-green-800 dark:bg-green-500 dark:border-green-400';
        default: return 'bg-neutral-100 dark:bg-neutral-800/60';
    }
};

export function ContributionActivity({ weeks }: ContributionActivityProps) {
    const [hoveredCell, setHoveredCell] = useState<{ date: string; count: number } | null>(null);

    const { totalContributions, contributionDays, maxStreak, currentStreak } = useMemo(() => {
        if (!weeks) return { totalContributions: 0, contributionDays: [], maxStreak: 0, currentStreak: 0 };

        let total = 0;
        const days: ContributionDay[] = [];

        weeks.forEach(week => {
            week.days.forEach(day => {
                if (day) {
                    total += day.count;
                    days.push(day);
                }
            });
        });

        // Calculate streaks
        let current = 0;
        let max = 0;
        // reversed days for current streak
        const reversedDays = [...days].reverse();
        let streakActive = true;
        let tempCurrent = 0;

        for (const day of reversedDays) {
            if (day.count > 0) {
                tempCurrent++;
            } else {
                // If today is 0, check if it's the very last day (today). If so, streak might still be active from yesterday.
                // But for simplicity, if count is 0, streak breaks.
                // Assuming last day in array is "today" or "yesterday".
                if (streakActive) {
                    // Allow one day gap if it's today and no commits yet?
                    // Simple logic: break on 0.
                    streakActive = false;
                }
            }
        }
        current = tempCurrent;

        // Max streak
        let tempMax = 0;
        for (const day of days) {
            if (day.count > 0) {
                tempMax++;
            } else {
                if (tempMax > max) max = tempMax;
                tempMax = 0;
            }
        }
        if (tempMax > max) max = tempMax;

        return { totalContributions: total, contributionDays: days, maxStreak: max, currentStreak: current };
    }, [weeks]);


    if (!weeks || weeks.length === 0) return null;

    return (
        <section className="relative px-6 py-24 bg-white dark:bg-neutral-950">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-5xl mb-4 text-neutral-900 font-bold dark:text-white">
                        Contribution Activity
                    </h2>
                    <p className="text-neutral-600 text-lg mb-2 dark:text-neutral-400">
                        {totalContributions} contributions in the last year
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="bg-white border border-neutral-200 rounded-2xl p-8 overflow-x-auto shadow-sm dark:bg-neutral-900 dark:border-neutral-800"
                >
                    <div className="min-w-max">
                        {/* Day labels */}
                        {/* Day labels (Month names) */}
                        <div className="flex mb-2">
                            <div className="w-8" />
                            <div className="flex gap-1 text-xs text-neutral-500 dark:text-neutral-400">
                                {weeks.map((week, i) => {
                                    const firstDay = week.days.find(d => d && d.date);
                                    if (!firstDay) return <div key={i} className="w-3" />;

                                    const currentDate = new Date(firstDay.date);
                                    const currentMonth = currentDate.toLocaleString('default', { month: 'short' });

                                    let showLabel = false;
                                    if (i === 0) {
                                        showLabel = true;
                                    } else {
                                        const prevWeek = weeks[i - 1];
                                        const prevDay = prevWeek.days.find(d => d && d.date);
                                        if (prevDay) {
                                            const prevDate = new Date(prevDay.date);
                                            const prevMonth = prevDate.toLocaleString('default', { month: 'short' });
                                            if (currentMonth !== prevMonth) {
                                                showLabel = true;
                                            }
                                        }
                                    }

                                    return (
                                        <div key={i} className="w-3 relative h-4">
                                            {showLabel && (
                                                <span className="absolute left-0 bottom-0 whitespace-nowrap font-medium">
                                                    {currentMonth}
                                                </span>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Contribution grid */}
                        <div className="flex gap-1">
                            {/* Day of week labels */}
                            <div className="flex flex-col gap-1 w-8 text-xs text-neutral-500 pt-0 dark:text-neutral-400">
                                <div className="h-3">Mon</div>
                                <div className="h-3">Tue</div>
                                <div className="h-3">Wed</div>
                                <div className="h-3">Thu</div>
                                <div className="h-3">Fri</div>
                                <div className="h-3">Sat</div>
                                <div className="h-3">Sun</div>
                            </div>

                            {/* Grid */}
                            <div className="flex gap-1">
                                {weeks.map((week, weekIndex) => (
                                    <div key={weekIndex} className="flex flex-col gap-1">
                                        {week.days.map((day, dayIndex) => {
                                            return (
                                                <motion.div
                                                    key={`${weekIndex}-${dayIndex}`}
                                                    initial={{ opacity: 0, scale: 0 }}
                                                    whileInView={{ opacity: 1, scale: 1 }}
                                                    viewport={{ once: true }}
                                                    transition={{ duration: 0.3, delay: (weekIndex + dayIndex) * 0.002 }}
                                                    whileHover={{ scale: 1.5 }}
                                                    className={`w-3 h-3 rounded-sm ${getIntensity(day.level)} border border-neutral-200 cursor-pointer transition-all duration-200 dark:border-neutral-700`}
                                                    onMouseEnter={() => setHoveredCell(day)}
                                                    onMouseLeave={() => setHoveredCell(null)}
                                                />
                                            );
                                        })}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Legend */}
                        <div className="flex items-center justify-end gap-2 mt-6 text-xs text-neutral-500 dark:text-neutral-400">
                            <span>Less</span>
                            <div className="flex gap-1">
                                {[0, 1, 2, 3, 4].map((level) => (
                                    <div
                                        key={level}
                                        className={`w-3 h-3 rounded-sm ${getIntensity(level)} border border-neutral-200 dark:border-neutral-700`}
                                    />
                                ))}
                            </div>
                            <span>More</span>
                        </div>

                        {/* Tooltip */}
                        {hoveredCell && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-4 inline-block px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-sm text-white dark:bg-neutral-800 dark:border-neutral-600"
                            >
                                <div className="">{hoveredCell.count} contributions</div>
                                <div className="text-neutral-400 text-xs dark:text-neutral-500">{hoveredCell.date}</div>
                            </motion.div>
                        )}
                    </div>
                </motion.div>

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8"
                >
                    {[
                        { label: 'Current Streak', value: `${currentStreak} days` },
                        { label: 'Longest Streak', value: `${maxStreak} days` },
                        { label: 'Total Commits', value: totalContributions.toLocaleString() },
                    ].map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                            className="bg-white border border-neutral-200 rounded-xl p-6 text-center shadow-sm dark:bg-neutral-900 dark:border-neutral-800"
                        >
                            <div className="text-3xl text-neutral-900 mb-2 font-bold dark:text-white">
                                {stat.value}
                            </div>
                            <div className="text-neutral-600 font-medium dark:text-neutral-400">{stat.label}</div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
