"use client";

import React from "react";
import { motion } from "motion/react";
import { Linkedin, Twitter, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

const team = [
    {
        name: "Anant Kumar",
        role: "Full Stack Developer",
        image: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg", // Placeholder
        socials: [Linkedin, Twitter]
    },
    {
        name: "Ayush",
        role: "Backend Engineer",
        image: "https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg", // Placeholder
        socials: [Linkedin, Mail]
    },
    {
        name: "Njana",
        role: "Frontend Engineer",
        image: "https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg", // Placeholder
        socials: [Twitter, Mail]
    }
];

export function Team() {
    return (
        <section className="py-24 bg-background w-full">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-20">
                    <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4 text-foreground">Meet the <span className="text-primary">Makers</span></h2>
                    <p className="text-muted-foreground max-w-xl mx-auto italic">
                        A diverse team of passionate creators building the future of digital experiences.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
                    {team.map((member, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className="group relative h-[400px] w-full max-w-sm rounded-3xl overflow-hidden cursor-pointer shadow-xl hover:shadow-2xl transition-all duration-500"
                        >
                            <img
                                src={member.image}
                                alt={member.name}
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                            />

                            {/* Gradient Overlay */}
                            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500" />

                            {/* Content */}
                            <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                <h3 className="text-white text-xl font-black tracking-tight mb-1">{member.name}</h3>
                                <p className="text-white/60 text-sm font-medium mb-6 uppercase tracking-wider">{member.role}</p>

                                <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                                    {member.socials.map((Icon, idx) => (
                                        <Button key={idx} variant="ghost" size="icon" className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-primary hover:text-white transition-colors p-0 border-0">
                                            <Icon className="w-4 h-4" />
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
