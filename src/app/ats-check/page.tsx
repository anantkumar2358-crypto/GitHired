"use client";

import { Navigation } from "@/components/new-landing/Navigation";
import { ATSChecker } from "@/components/ats/ATSChecker";
import { AnimatedBackground } from "@/components/new-landing/AnimatedBackground";
import { LandingFooter } from "@/components/new-landing/LandingFooter";

export default function ATSCheckPage() {
    return (
        <div className="relative min-h-screen w-full bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 overflow-hidden text-gray-900 dark:text-white font-sans selection:bg-blue-200 dark:selection:bg-blue-500/30 transition-colors duration-500">
            {/* Background */}
            <div className="absolute inset-0 z-0">
                <AnimatedBackground />
            </div>

            <div className="relative z-10">
                <Navigation />
                <main className="pt-32 pb-20">
                    <ATSChecker />
                </main>
                <LandingFooter />
            </div>
        </div>
    );
}
