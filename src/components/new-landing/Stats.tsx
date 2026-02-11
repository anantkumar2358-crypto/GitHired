"use client";

import { motion, useInView } from 'motion/react';
import { useRef, useEffect, useState } from 'react';

interface StatProps {
    end: number;
    label: string;
    suffix?: string;
    delay?: number;
}

function AnimatedStat({ end, label, suffix = '', delay = 0 }: StatProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (isInView) {
            let start = 0;
            const duration = 2000;
            const increment = end / (duration / 16);

            const timer = setInterval(() => {
                start += increment;
                if (start >= end) {
                    setCount(end);
                    clearInterval(timer);
                } else {
                    setCount(Math.floor(start));
                }
            }, 16);

            return () => clearInterval(timer);
        }
    }, [isInView, end]);

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay }}
            className="text-center"
        >
            <motion.div
                className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-slate-700 bg-clip-text text-transparent mb-2"
                whileHover={{ scale: 1.1 }}
            >
                {count}{suffix}
            </motion.div>
            <div className="text-gray-600 dark:text-gray-400 font-medium">{label}</div>
        </motion.div>
    );
}

export function Stats() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section ref={ref} className="relative py-20 px-6">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 p-12 rounded-3xl bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl border border-blue-600/20 shadow-2xl"
                >
                    <AnimatedStat end={10000} label="Users" suffix="+" delay={0.1} />
                    <AnimatedStat end={50} label="Templates" suffix="+" delay={0.2} />
                    <AnimatedStat end={98} label="Satisfaction" suffix="%" delay={0.3} />
                    <AnimatedStat end={24} label="Support" suffix="/7" delay={0.4} />
                </motion.div>
            </div>
        </section>
    );
}
