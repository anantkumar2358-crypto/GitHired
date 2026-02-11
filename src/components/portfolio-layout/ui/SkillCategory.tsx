"use client";

import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/components/portfolio-layout/ui/lightswind/card";
import { Badge } from "@/components/portfolio-layout/ui/lightswind/badge";
import { Progress } from "@/components/portfolio-layout/ui/lightswind/progress";
import { motion, AnimatePresence } from "framer-motion";
import { CountUp } from "@/components/portfolio-layout/ui/lightswind/count-up";

interface ProfessionalProfileProps {
    userData: any;
}

export default function ProfessionalProfile({ userData }: ProfessionalProfileProps) {
    // Helper to normalize skills data
    // Helper to normalize skills data
    const rawTechnical = userData?.skills?.technical;
    const technicalSkills = (Array.isArray(rawTechnical) && rawTechnical.length > 0)
        ? rawTechnical.map((skill: any) => ({
            name: typeof skill === 'string' ? skill : skill.name,
            level: typeof skill === 'string' ? 85 : (skill.level || 85) // Default to 85 if no level
        }))
        : [
            { name: "React.js / Next.js", level: 95 },
            { name: "Node.js / Express", level: 90 },
            { name: "TypeScript & JavaScript", level: 92 },
            { name: "Database (MongoDB / PostgreSQL)", level: 88 },
            { name: "Cloud (AWS / Azure)", level: 85 },
        ];

    const rawSoft = userData?.skills?.soft;
    const softSkills = (Array.isArray(rawSoft) && rawSoft.length > 0)
        ? rawSoft.map((skill: any) =>
            typeof skill === 'string' ? skill : skill.name
        )
        : [
            "Leadership",
            "Problem Solving",
            "Agile Methodologies",
            "Mentorship",
            "Strategic Thinking",
            "Cross-Team Collaboration",
        ];

    return (
        <motion.section
            id="skills"
            className="space-y-12"
            initial={{ opacity: 0 }}
            whileInView={{
                opacity: 1,
                transition: {
                    staggerChildren: 0.2,
                    delayChildren: 0.3,
                },
            }}
            viewport={{ once: true, amount: 0.2 }}
        >
            {/* Skills Section */}
            <motion.div
                initial={{ opacity: 0, y: 30, filter: "blur(4px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                viewport={{ once: true }}
                className=""
            >
                {" "}
                <h3 className="text-3xl font-bold mb-6">Core Skills</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Technical Skills</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {technicalSkills.map((skill: any, i: number) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1, duration: 0.5 }}
                                    viewport={{ once: true, amount: 0.8 }}
                                >
                                    <div
                                        className="flex items-center justify-between text-sm 
                  font-medium mb-1"
                                    >
                                        <span>{skill.name}</span>
                                    </div>
                                    <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-500 rounded-full" style={{ width: '100%' }} />
                                    </div>
                                </motion.div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Soft Skills</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-wrap gap-2">
                            <AnimatePresence>
                                {softSkills.map((skill: string, i: number) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        transition={{ type: "spring", stiffness: 200, damping: 10 }}
                                        viewport={{ once: true }}
                                    >
                                        <Badge className="bg-pink-500 hover:bg-pink-600 transition-colors cursor-default text-base px-4 py-1.5">{skill}</Badge>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </CardContent>
                    </Card>
                </div>
            </motion.div>
        </motion.section>
    );
}
