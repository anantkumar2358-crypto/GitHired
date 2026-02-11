"use client";

import React from "react";
import Dock from "@/components/portfolio-layout/ui/lightswind/dock";
import { Home, User, GraduationCap, Briefcase, Code, Mail } from "lucide-react";

interface PortfolioDockProps {
    email?: string;
    sections?: {
        about?: boolean;
        education?: boolean;
        career?: boolean;
        projects?: boolean;
    };
}

export const PortfolioDock = ({ email, sections = { about: true, education: true, career: true, projects: true } }: PortfolioDockProps) => {
    const handleScrollTo = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    const allDockItems = [
        { icon: <Home className="w-6 h-6" />, label: "Home", onClick: () => handleScrollTo("hero"), show: true },
        { icon: <User className="w-6 h-6" />, label: "About", onClick: () => handleScrollTo("about"), show: sections.about },
        { icon: <GraduationCap className="w-6 h-6" />, label: "Education", onClick: () => handleScrollTo("education"), show: sections.education },
        { icon: <Briefcase className="w-6 h-6" />, label: "Career", onClick: () => handleScrollTo("career"), show: sections.career },
        { icon: <Code className="w-6 h-6" />, label: "Projects", onClick: () => handleScrollTo("work"), show: sections.projects },
        { icon: <Mail className="w-6 h-6" />, label: "Contact", onClick: () => window.location.href = `mailto:${email || ""}`, show: true },
    ];

    const dockItems = allDockItems.filter(item => item.show !== false);

    return <Dock items={dockItems} />;
};
