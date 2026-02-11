"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/portfolio-layout/ui/lightswind/card";
// import ProfessionalProfile from "./SkillCategory"; // Removed to decouple
import { motion } from "framer-motion";

interface EducationSectionProps {
    userData: any;
}

export const EducationSection = ({ userData }: EducationSectionProps) => {
    const education = userData?.education;

    if (!education || education.length === 0) {
        return null;
    }

    return (
        <motion.section
            id="education"
            className="space-y-10 py-10 px-6"
            initial={{ opacity: 0, y: 50, filter: "blur(5px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.2 }}
        >
            {/* Education */}
            <div>
                <motion.h3
                    className="text-3xl font-bold mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    viewport={{ once: true }}
                >
                    Education
                </motion.h3>

                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 gap-8"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    viewport={{ once: true }}
                >
                    {education.map((edu: any, index: number) => (
                        <Card key={index} className="h-full">
                            <CardHeader>
                                <CardTitle>{edu.degree}</CardTitle>
                                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                    {edu.school} — {edu.year}
                                </p>
                            </CardHeader>
                            <CardContent className="text-sm text-neutral-600 dark:text-neutral-300 space-y-2">
                                <p>
                                    {edu.description || (
                                        <>
                                            Specialized in <strong>Software Engineering</strong> and <strong>Computer Science</strong> fundamentals.
                                        </>
                                    )}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </motion.div>
            </div>

            {/* <ProfessionalProfile userData={userData} /> */}
        </motion.section>
    );
};
