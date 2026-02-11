"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Github, Linkedin, Sparkles as LucideSparkles } from "lucide-react";
import { GeneratorForm } from "./GeneratorForm";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";

export function HeroSection() {
    // IMAGE OPTIONS - You can switch these to see different vibes!
    const heroImages = {
        minimalist: "https://images.pexels.com/photos/4974914/pexels-photo-4974914.jpeg", // Clean workspace
        abstract: "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg",   // Modern 3D shape
        futuristic: "https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg"      // Tech/Code
    };

    const currentImage = heroImages.abstract; // <--- CHANGE THIS to .minimalist or .futuristic to switch!

    return (
        <section className="relative pt-32 pb-20 px-6 overflow-hidden bg-background">
            {/* Gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-blue-50 to-background -z-10 dark:from-purple-950/20 dark:via-blue-950/20 dark:to-background" />

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Left Column: Text Content */}
                <div className="text-left">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full mb-6 dark:bg-purple-900/30 dark:text-purple-300">
                        <Sparkles className="size-4" />
                        <span className="text-sm font-medium">AI-Powered Portfolio Generation</span>
                    </div>

                    <h1 className="text-5xl md:text-6xl mb-6 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-clip-text text-transparent font-bold pb-2 leading-tight">
                        Transform Your <br />
                        Resume Into a <br />
                        Stunning Portfolio
                    </h1>

                    <p className="text-xl text-muted-foreground mb-8 max-w-lg">
                        An AI agent that scans GitHub, LinkedIn, and projects to automatically generate
                        a polished portfolio website from your digital footprint.
                    </p>

                    <div className="flex flex-wrap gap-4 mb-12">
                        <SignedIn>
                            <Link href="/dashboard">
                                <Button
                                    size="lg"
                                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-lg px-8 text-white border-0 shadow-lg hover:shadow-xl transition-all"
                                >
                                    Go to Dashboard
                                    <ArrowRight className="ml-2 size-5" />
                                </Button>
                            </Link>
                        </SignedIn>
                        <SignedOut>
                            <Link href="/sign-up">
                                <Button
                                    size="lg"
                                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-lg px-8 text-white border-0 shadow-lg hover:shadow-xl transition-all"
                                >
                                    Get Started Free
                                    <ArrowRight className="ml-2 size-5" />
                                </Button>
                            </Link>
                            <Link href="/sign-in">
                                <Button size="lg" variant="outline" className="text-lg px-8 border-border text-foreground hover:bg-muted">
                                    Login
                                </Button>
                            </Link>
                        </SignedOut>
                    </div>

                    <div className="flex gap-6 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <Github className="size-5" />
                            <span>GitHub Sync</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Linkedin className="size-5" />
                            <span>LinkedIn Import</span>
                        </div>
                    </div>
                </div>

                {/* Right Column: Hero Image */}
                <div className="relative relative h-[500px] w-full rounded-2xl overflow-hidden shadow-2xl border border-white/20 group">
                    {/* Image */}
                    <img
                        src={currentImage}
                        alt="Hero Preview"
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />

                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />

                    {/* Floating UI Elements (Decorative) */}
                    <div className="absolute bottom-6 left-6 right-6 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                        <div className="flex items-center gap-3">
                            <div className="size-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold">
                                OM
                            </div>
                            <div>
                                <div className="h-2 w-24 bg-white/40 rounded-full mb-2" />
                                <div className="h-2 w-16 bg-white/20 rounded-full" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function Sparkles({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 3L13.5 7.5L18 9L13.5 10.5L12 15L10.5 10.5L6 9L10.5 7.5L12 3Z" fill="currentColor" />
            <path d="M19 3L19.5 5L21.5 5.5L19.5 6L19 8L18.5 6L16.5 5.5L18.5 5L19 3Z" fill="currentColor" />
            <path d="M19 16L19.5 18L21.5 18.5L19.5 19L19 21L18.5 19L16.5 18.5L18.5 18L19 16Z" fill="currentColor" />
        </svg>
    );
}
