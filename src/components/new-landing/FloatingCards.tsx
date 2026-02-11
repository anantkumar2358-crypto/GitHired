"use client";

import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { CheckCircle, Users, Award } from 'lucide-react';

const cards = [
    {
        icon: CheckCircle,
        title: 'Editor\'s Choice',
        description: 'Recognized by industry experts for exceptional design and functionality.',
        color: 'from-blue-600 to-indigo-600',
    },
    {
        icon: Users,
        title: 'Top Rated',
        description: 'Loved by thousands of creatives and professionals worldwide.',
        color: 'from-slate-600 to-blue-600',
    },
    {
        icon: Award,
        title: 'Premium Quality',
        description: 'Built with cutting-edge technology and best practices for excellence.',
        color: 'from-emerald-600 to-teal-600',
    },
];

export function FloatingCards() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section ref={ref} className="relative py-20 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="grid md:grid-cols-3 gap-6">
                    {cards.map((card, index) => {
                        const Icon = card.icon;
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 50, rotateX: 45 }}
                                animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
                                transition={{
                                    duration: 0.8,
                                    delay: index * 0.2,
                                    type: "spring",
                                    stiffness: 100
                                }}
                                whileHover={{
                                    y: -15,
                                    rotateY: 5,
                                    transition: { duration: 0.3 }
                                }}
                                className="group"
                            >
                                <div className="relative h-full p-8 rounded-3xl bg-white/70 dark:bg-gray-900/70 backdrop-blur-2xl border border-purple-600/20 shadow-xl overflow-hidden">
                                    {/* Animated gradient background */}
                                    <motion.div
                                        className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-10`}
                                        animate={{
                                            scale: [1, 1.2, 1],
                                        }}
                                        transition={{
                                            duration: 3,
                                            repeat: Infinity,
                                            ease: "easeInOut"
                                        }}
                                    />

                                    <motion.div
                                        whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.2 }}
                                        transition={{ duration: 0.5 }}
                                        className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-6 shadow-lg`}
                                    >
                                        <Icon className="w-8 h-8 text-white" />
                                    </motion.div>

                                    <h3 className="relative text-2xl font-bold mb-3 text-gray-900 dark:text-white">{card.title}</h3>
                                    <p className="relative text-gray-600 dark:text-gray-400">
                                        {card.description}
                                    </p>

                                    {/* Glowing effect */}
                                    <motion.div
                                        className={`absolute -bottom-20 -right-20 w-40 h-40 bg-gradient-to-br ${card.color} rounded-full blur-3xl opacity-0 group-hover:opacity-20`}
                                        animate={{
                                            scale: [1, 1.3, 1],
                                        }}
                                        transition={{
                                            duration: 4,
                                            repeat: Infinity,
                                            ease: "easeInOut"
                                        }}
                                    />
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
