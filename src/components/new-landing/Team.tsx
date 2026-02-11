import React from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import ChromaGrid from "./ChromaGrid";

const team = [
    {
        image: "/team/nilargha.jpg",
        title: "Nilargha Jana",
        subtitle: "Backend Developer",
        handle: "@nilargha",
        borderColor: "#10B981",
        gradient: "linear-gradient(180deg, #10B981, #000)",
        url: "https://www.linkedin.com/in/nilargha-jana-853a80397/",
        github: "https://github.com/njana-sudo"
    },
    {
        image: "/team/anant.jpg",
        title: "Anant Kumar",
        subtitle: "Full Stack Developer",
        handle: "@anant",
        borderColor: "#3B82F6",
        gradient: "linear-gradient(145deg, #3B82F6, #000)",
        url: "https://www.linkedin.com/in/anant-kumar-0315bb381/",
        github: "https://github.com/anantkumar2358-crypto"
    },
    {
        image: "/team/om.jpg",
        title: "OM L. S.",
        subtitle: "UI/UX Designer",
        handle: "@omls",
        borderColor: "#8B5CF6",
        gradient: "linear-gradient(145deg, #8B5CF6, #000)",
        url: "https://www.linkedin.com/in/om-l-s-71790a201/",
        github: "https://github.com/OM-092"
    }
];

export function Team() {
    return (
        <section id="team" className="py-24 bg-transparent relative z-10 overflow-hidden">
            <div className="container px-4 mx-auto">
                <div className="text-center max-w-2xl mx-auto mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                    >
                        <Badge variant="outline" className="text-blue-600 dark:text-blue-400 font-black uppercase tracking-[0.2em] text-[10px] mb-4 border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-900/20 px-4 py-1.5">
                            Our Team
                        </Badge>
                        <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tight leading-none text-gray-900 dark:text-white">
                            The minds behind <span className="text-blue-600 dark:text-blue-400">the magic.</span>
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 text-sm italic leading-relaxed">
                            A team of aspiring engineers and designers working together to help the community.
                        </p>
                    </motion.div>
                </div>

                <div className="relative h-[600px] w-full">
                    <ChromaGrid
                        items={team}
                        radius={250}
                        damping={0.45}
                        fadeOut={0.6}
                        ease="power3.out"
                    />
                </div>
            </div>
        </section>
    );
}
