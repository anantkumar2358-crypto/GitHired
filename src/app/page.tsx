"use client";

import { Navigation } from "@/components/new-landing/Navigation";
import { Hero } from "@/components/new-landing/Hero";
import { Features } from "@/components/new-landing/Features";
import { Team } from "@/components/new-landing/Team";
import { TechStack } from "@/components/new-landing/TechStack";
import { AnimatedBackground } from "@/components/new-landing/AnimatedBackground";
import { LandingFooter } from "@/components/new-landing/LandingFooter";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-gray-900 dark:text-white transition-colors duration-500 overflow-hidden">
      <AnimatedBackground />
      <div className="relative z-10">
        <Navigation />
        <Hero />
        <Features />
        <Team />
        <TechStack />
        <LandingFooter />
      </div>
    </div>
  );
}
