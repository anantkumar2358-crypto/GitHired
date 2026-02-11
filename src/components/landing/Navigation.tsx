"use client";

import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { ThemeToggle } from "../ThemeToggle";

export function Navigation() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
            <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="size-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                            <Sparkles className="size-5 text-white" />
                        </div>
                        <span className="font-semibold text-lg text-foreground">Portfolio Gen</span>
                    </Link>

                    <Button variant="ghost" className="text-muted-foreground hover:text-foreground">Features</Button>
                    <Button variant="ghost" className="text-muted-foreground hover:text-foreground">About</Button>

                    <div className="flex items-center gap-4">
                        <ThemeToggle />
                        <SignedOut>
                            <Link href="/sign-in">
                                <Button variant="outline" className="text-foreground border-border hover:bg-muted">Login</Button>
                            </Link>
                            <Link href="/sign-up">
                                <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0">
                                    Get Started
                                </Button>
                            </Link>
                        </SignedOut>

                        <SignedIn>
                            <Link href="/ats-check">
                                <Button variant="ghost" className="text-muted-foreground hover:text-foreground border border-purple-100 bg-purple-50 hover:bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:border-purple-800 dark:text-purple-300 dark:hover:bg-purple-900/40">
                                    <Sparkles className="size-4 mr-2" />
                                    ATS Scanner
                                </Button>
                            </Link>
                            <Link href="/dashboard">
                                <Button variant="ghost" className="text-muted-foreground hover:text-foreground">Dashboard</Button>
                            </Link>
                            <UserButton afterSignOutUrl="/" />
                        </SignedIn>
                    </div>
                </div>
            </div>
        </nav>
    );
}
