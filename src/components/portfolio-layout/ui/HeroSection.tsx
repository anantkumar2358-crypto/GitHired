"use client";

import { Badge } from "@/components/portfolio-layout/ui/lightswind/badge";
import { motion } from "framer-motion";

interface HeroSectionProps {
    userData: any;
}

export const HeroSection = ({ userData }: HeroSectionProps) => {
    return (
        <motion.div
            id="hero"
            className="text-foreground bg-transparent flex flex-col md:flex-row 
      items-center justify-center max-w-7xl mx-auto w-full py-20"
            initial={{ opacity: 0 }}
            animate={{
                opacity: 1,
                transition: {
                    delayChildren: 0.3,
                    staggerChildren: 0.2,
                },
            }}
        >
            <motion.div
                className="flex-1 space-y-4 p-6 text-left md:text-left"
                initial={false}
            >
                <motion.h1
                    className="text-4xl md:text-6xl font-bold"
                    initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
                    animate={{
                        opacity: 1,
                        y: 0,
                        filter: "blur(0px)",
                        transition: { duration: 0.8, ease: "easeOut" },
                    }}
                >
                    {userData?.personalInfo?.name || "Scarlett Rose"}
                    <motion.span
                        className="text-xl text-pink-500 font-semibold block mt-2"
                        initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
                        animate={{
                            opacity: 1,
                            y: 0,
                            filter: "blur(0px)",
                            transition: { duration: 0.8, ease: "easeOut" },
                        }}
                    >
                        {userData?.personalInfo?.role || "Full-Stack Developer"}
                    </motion.span>
                </motion.h1>

                <motion.h2
                    className="text-xl text-muted-foreground mt-1"
                    initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
                    animate={{
                        opacity: 1,
                        y: 0,
                        filter: "blur(0px)",
                        transition: { duration: 0.8, ease: "easeOut" },
                    }}
                >
                    {userData?.personalInfo?.headline || "Experienced Designer & Full-Stack Developer"}
                </motion.h2>

                <motion.div
                    className="flex flex-wrap justify-start gap-2 pt-4"
                    initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
                    animate={{
                        opacity: 1,
                        y: 0,
                        filter: "blur(0px)",
                        transition: { duration: 0.8, ease: "easeOut" },
                    }}
                >
                    {userData?.skills?.soft?.slice(0, 3).map((skill: any, index: number) => (
                        <Badge key={index} className="text-base px-4 py-1.5 bg-pink-500 hover:bg-pink-600 transition-colors">
                            {typeof skill === 'string' ? skill : skill.name}
                        </Badge>
                    ))}
                    {!userData?.skills?.soft && (
                        <>
                            <Badge className="text-base px-4 py-1.5 bg-pink-500">Team Lead</Badge>
                            <Badge className="text-base px-4 py-1.5 bg-pink-500">Problem Solving</Badge>
                            <Badge className="text-base px-4 py-1.5 bg-pink-500">Decision Making</Badge>
                        </>
                    )}
                </motion.div>
            </motion.div>

            <motion.div
                className="flex-1 flex justify-center p-6"
                initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
                animate={{
                    opacity: 1,
                    scale: 1,
                    filter: "blur(0px)",
                }}
                transition={{ delay: 0.5, duration: 1.2, ease: "easeOut" }}
            >
                {userData?.personalInfo?.photoUrl ? (
                    <div
                        className="w-64 h-64 md:w-80 md:h-80 overflow-hidden shadow-2xl border-4 border-white/20 dark:border-white/10"
                        style={{ borderRadius: "30px" }}
                    >
                        <img
                            src={userData.personalInfo.photoUrl}
                            alt={userData?.personalInfo?.name || "Profile"}
                            className="w-full h-full object-cover"
                        />
                    </div>
                ) : (
                    <div
                        className="w-64 h-64 md:w-80 md:h-80 overflow-hidden shadow-2xl border-4 border-white/20 dark:border-white/10 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center"
                        style={{ borderRadius: "30px" }}
                    >
                        <span className="text-6xl font-bold text-gray-400">
                            {userData?.personalInfo?.name?.charAt(0) || "U"}
                        </span>
                    </div>
                )}
            </motion.div>
        </motion.div>
    );
};
