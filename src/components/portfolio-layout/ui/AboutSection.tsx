"use client";

import { Separator } from "@/components/portfolio-layout/ui/lightswind/separator";
import { motion } from "framer-motion";

interface AboutSectionProps {
    userData: any;
}

export const AboutSection = ({ userData }: AboutSectionProps) => {
    const aboutMe = userData?.personalInfo?.aboutMe;

    // Don't show About section if there's no distinct content
    if (!aboutMe) {
        return null;
    }

    // Common typo corrections
    const autoCorrect = (text: string): string => {
        const corrections: Record<string, string> = {
            'coofie': 'coffee',
            'coffe': 'coffee',
            'cofee': 'coffee',
            'anme': 'anime',
            'animie': 'anime',
            'musci': 'music',
            'musik': 'music',
        };

        let corrected = text.toLowerCase();
        Object.entries(corrections).forEach(([wrong, right]) => {
            corrected = corrected.replace(new RegExp(wrong, 'gi'), right);
        });

        return corrected;
    };

    // Capitalize first letter of each word
    const capitalize = (text: string): string => {
        return text.split(' ').map(word =>
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ).join(' ');
    };

    // Parse interests/hobbies if it's a simple comma-separated list
    const isSimpleList = aboutMe && aboutMe.length < 100 && aboutMe.includes(',');
    const interests = isSimpleList
        ? aboutMe.split(',')
            .map((item: string) => capitalize(autoCorrect(item.trim())))
            .filter(Boolean)
        : null;

    return (
        <motion.div
            id="about"
            className="text-foreground max-w-7xl mx-auto w-full px-6 py-12 space-y-4"
            initial={{ opacity: 0, y: 50, filter: "blur(5px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.8, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.2 }}
        >
            <h2 className="text-3xl font-bold">About Me</h2>

            {interests ? (
                <div className="space-y-3">
                    <p className="text-muted-foreground text-base font-medium">Interests & Hobbies</p>
                    <div className="flex flex-wrap gap-3">
                        {interests.map((interest: string, index: number) => (
                            <span
                                key={index}
                                className="px-4 py-2 bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/20 rounded-full text-sm font-medium capitalize"
                            >
                                {interest}
                            </span>
                        ))}
                    </div>
                </div>
            ) : (
                <p className="text-muted-foreground text-base max-w-3xl leading-relaxed">
                    {aboutMe}
                </p>
            )}

            <Separator />
        </motion.div>
    );
};
