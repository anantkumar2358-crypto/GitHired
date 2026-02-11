"use client";

import { ScrollTimeline } from "@/components/portfolio-layout/ui/lightswind/scroll-timeline";
import { Briefcase, Award, Layers, Users, Globe } from "lucide-react";

interface CareerTimelineProps {
    userData: any;
}

export const CareerTimeline = ({ userData }: CareerTimelineProps) => {

    const workExperience = userData?.workExperience;

    if (!workExperience || workExperience.length === 0) {
        return null;
    }

    const careerEvents = workExperience.map((exp: any, index: number) => ({
        year: exp.period || "2024",
        title: exp.position,
        subtitle: exp.company,
        description: exp.description,
        icon: <Briefcase className="h-4 w-4 mr-2 text-primary" />,
    }));

    return (
        <div id="career">
            <ScrollTimeline
                events={careerEvents}
                title="Career Journey"
                subtitle="An evolving path of leadership, innovation, and impact"
                animationOrder="staggered"
                cardAlignment="alternating"
                cardVariant="elevated"
                parallaxIntensity={0.15}
                revealAnimation="fade"
                progressIndicator={true}
                lineColor="bg-primary/20"
                activeColor="bg-primary"
                progressLineWidth={3}
                progressLineCap="round"
            />
        </div>
    );
};
