import { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import {
    Code,
    BookOpen,
    Sparkles,
    Layout,
    TrendingUp,
    Target
} from 'lucide-react';
import FeatureBounceCards from './FeatureBounceCards';

const features = [
    {
        icon: Sparkles,
        title: 'Resume-to-Website',
        description: 'Transform your PDF resume into a stunning portfolio instantly.',
        gradient: 'from-purple-600 to-pink-600',
    },
    {
        icon: Layout,
        title: 'Recruiter-Optimized',
        description: 'Layouts crafted to highlight exactly what recruiters look for.',
        gradient: 'from-slate-600 to-slate-800',
    },
    {
        icon: Code,
        title: 'Code Quality Summary',
        description: 'AI-driven analysis of your code structure and best practices.',
        gradient: 'from-emerald-600 to-teal-600',
    },
    {
        icon: BookOpen,
        title: 'Auto Documentation',
        description: 'Automatically generate professional documentation for your projects.',
        gradient: 'from-blue-600 to-indigo-600',
    },
    {
        icon: TrendingUp,
        title: 'Portfolio Coaching',
        description: 'Get AI feedback and actionable tips to improve your content.',
        gradient: 'from-rose-600 to-red-600',
    },
    {
        icon: Target,
        title: 'ATS Scoring',
        description: 'Check your resume against job descriptions to maximize matches.',
        gradient: 'from-cyan-600 to-blue-600',
    },
];

export function Features() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section id="features" ref={ref} className="relative py-32 px-6 overflow-hidden">
            <div className="max-w-7xl mx-auto flex flex-col items-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <motion.h2
                        className="text-4xl md:text-6xl font-bold mb-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.1 }}
                    >
                        Powerful{' '}
                        <span className="bg-gradient-to-r from-blue-600 to-slate-700 bg-clip-text text-transparent">
                            Features
                        </span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
                    >
                        Everything you need to create a stunning portfolio that showcases your work
                        and attracts opportunities.
                    </motion.p>
                </motion.div>

                <div className="w-full flex justify-center h-[600px]">
                    <FeatureBounceCards
                        features={features}
                        containerWidth={1000}
                        containerHeight={600}
                        animationDelay={0.5}
                        animationStagger={0.08}
                    />
                </div>
            </div>
        </section>
    );
}
