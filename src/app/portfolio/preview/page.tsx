"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ReactLenis from "lenis/react";

// New Portfolio Components
import Header from "@/components/portfolio-layout/ui/Header";
import { HeroSection } from "@/components/portfolio-layout/ui/HeroSection";
import StripedBackground from "@/components/portfolio-layout/ui/lightswind/StripedBackground";
import { AboutSection } from "@/components/portfolio-layout/ui/AboutSection";
import { EducationSection } from "@/components/portfolio-layout/ui/EducationSection";
import SkillsSection from "@/components/portfolio-layout/ui/SkillCategory";
import { CareerTimeline } from "@/components/portfolio-layout/ui/CareerTimeline";
import { PortfolioDock } from "@/components/portfolio-layout/ui/PortfolioDock";
import { FeaturedWork } from "@/components/portfolio-layout/FeaturedWork";
import { ShareButton } from "@/components/portfolio-layout/ShareButton";
import { CodingStats } from "@/components/portfolio-layout/CodingStats";
import { ContributionActivity } from "@/components/portfolio-layout/ContributionActivity";
import { ContactSection } from "@/components/portfolio-layout/ui/ContactSection";
import { Code } from "lucide-react";

export default function PortfolioPreviewPage() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [showSaveDialog, setShowSaveDialog] = useState(false);
    const [portfolioName, setPortfolioName] = useState("");
    const [saving, setSaving] = useState(false);

    // External Data State
    const [githubUsername, setGithubUsername] = useState<string | null>(null);
    const [githubAvatar, setGithubAvatar] = useState<string>("");
    const [githubData, setGithubData] = useState<any[]>([]);
    const [leetcodeUsername, setLeetcodeUsername] = useState("");
    const [codeforcesUsername, setCodeforcesUsername] = useState("");
    const [showConnectDialog, setShowConnectDialog] = useState(false);
    const [fetchedStats, setFetchedStats] = useState<any>(null);
    const [refreshingStats, setRefreshingStats] = useState(false);

    useEffect(() => {
        const storedData = localStorage.getItem("portfolioPreviewData");
        if (storedData) {
            try {
                const parsed = JSON.parse(storedData);
                setData(parsed);

                // Extract GitHub username
                if (parsed.externalData?.github) {
                    console.log("Found GitHub username in externalData:", parsed.externalData.github);
                    setGithubUsername(parsed.externalData.github);
                }

                if (parsed.externalData?.leetcode) {
                    setLeetcodeUsername(parsed.externalData.leetcode);
                }
                if (parsed.externalData?.codeforces) {
                    setCodeforcesUsername(parsed.externalData.codeforces);
                }
            } catch (e) {
                console.error("Failed to parse portfolio data", e);
            }
        }
        setLoading(false);
    }, []);

    // Auto-fetch stats when usernames are available
    useEffect(() => {
        if (!leetcodeUsername && !codeforcesUsername && !githubUsername) return;

        const loadStats = async () => {
            setRefreshingStats(true);
            try {
                const res = await fetch("/api/fetch-stats", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        leetcodeUsername,
                        codeforcesUsername,
                        githubUsername
                    })
                });
                const data = await res.json();
                setFetchedStats(data);
            } catch (e) {
                console.error("Failed to fetch stats", e);
            } finally {
                setRefreshingStats(false);
            }
        };

        loadStats();
    }, [leetcodeUsername, codeforcesUsername, githubUsername]);

    // Fetch GitHub Data (Profile & Repos)
    useEffect(() => {
        if (!githubUsername) return;

        // 1. Fetch Profile for Avatar
        fetch(`https://api.github.com/users/${githubUsername}`)
            .then(res => res.json())
            .then(profileData => {
                console.log("GitHub profile data received:", profileData);
                if (profileData && profileData.avatar_url) {
                    setGithubAvatar(profileData.avatar_url);
                }
            })
            .catch(err => console.error("GitHub profile fetch error:", err));

        // 2. Fetch Repos for Featured Work
        fetch(`https://api.github.com/users/${githubUsername}/repos?sort=stars&per_page=6`)
            .then(r => r.json())
            .then(repos => {
                if (Array.isArray(repos)) {
                    setGithubData(repos);
                }
            })
            .catch(e => console.error("Failed to fetch repos", e));
    }, [githubUsername]);



    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white"><Loader2 className="animate-spin mr-2" /> Loading portfolio...</div>;
    }

    if (!data) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center space-y-4 bg-slate-950 text-white">
                <p className="text-xl">No portfolio data found. Go back to ATS Scanner.</p>
                <Link href="/generate">
                    <Button variant="outline" className="text-black border-white/20 hover:bg-white/10 hover:text-white">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Generator
                    </Button>
                </Link>
            </div>
        );
    }

    // Map data to new component structure
    const topSkills = data.skills?.slice(0, 3).join(", ");

    const userData = {
        personalInfo: {
            name: data.personalInfo.name,
            role: "Software Engineer", // Default
            headline: topSkills ? `Specializing in ${topSkills}` : (data.personalInfo.summary?.slice(0, 100) + "..." || "Building the digital future."),
            summary: data.personalInfo.summary,
            aboutMe: data.personalInfo.customAboutMe || data.personalInfo.summary,
            photoUrl: localStorage.getItem("profilePhoto") || githubAvatar, // Custom photo > GitHub avatar
            location: "",
            email: data.personalInfo.contact?.split('|').find((s: string) => s.includes('@'))?.trim() || undefined,
        },
        skills: {
            technical: data.skills.map((skill: string) => ({ name: skill, level: 85 })),
            soft: ["Problem Solving", "Adaptability", "Collaboration"]
        },
        education: data.education,
        workExperience: data.experience,
        social: {
            github: githubUsername ? `https://github.com/${githubUsername}` : undefined,
            linkedin: data.personalInfo.contact?.split('|').find((s: string) => s.toLowerCase().includes('linkedin'))?.trim(),
            email: data.personalInfo.contact?.split('|').find((s: string) => s.includes('@'))?.trim()
        }
    };

    const projects = githubData.map((repo: any) => ({
        title: repo.name,
        description: repo.description || "No description available.",
        tags: [repo.language].filter(Boolean),
        links: {
            repo: repo.html_url,
            demo: repo.homepage || undefined
        },
        featured: repo.stargazers_count > 0
    }));

    return (
        <ReactLenis root>
            <div className="min-h-screen bg-background relative font-sans antialiased text-foreground overflow-x-hidden selection:bg-pink-500/30">
                <StripedBackground />

                {/* Save & Back Buttons */}
                <div className="fixed top-20 md:top-4 right-2 md:right-4 z-[60] flex gap-1 md:gap-2 items-center">
                    <Link href="/generate">
                        <Button variant="secondary" size="sm" className="h-9 rounded-lg shadow-lg backdrop-blur-md bg-white/10 hover:bg-white/20 border border-white/20 px-2 md:px-4">
                            <ArrowLeft className="h-4 w-4 md:mr-2" />
                            <span className="hidden md:inline">Edit Data</span>
                        </Button>
                    </Link>
                    <Button
                        size="sm"
                        onClick={() => setShowSaveDialog(true)}
                        className="h-9 rounded-lg shadow-lg bg-blue-600 hover:bg-blue-700 text-white border-0 px-2 md:px-4"
                    >
                        <Save className="h-4 w-4 md:mr-2" />
                        <span className="hidden sm:inline">Save Portfolio</span>
                    </Button>
                    <div className="h-9 flex items-center">
                        <ShareButton
                            portfolioUrl={`${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'}/portfolio/preview`}
                            userName={data?.personalInfo?.name || "User"}
                            title="Check out my portfolio preview!"
                        />
                    </div>
                </div>

                <Header />

                <main className="relative z-10 flex flex-col gap-20 pb-40">
                    <HeroSection userData={userData} />

                    {userData.personalInfo.aboutMe && <AboutSection userData={userData} />}

                    {userData.education.length > 0 && <EducationSection userData={userData} />}
                    <SkillsSection userData={userData} />

                    {userData.workExperience.length > 0 && <CareerTimeline userData={userData} />}

                    {projects.length > 0 && (
                        <FeaturedWork projects={projects} username={githubUsername || "user"} />
                    )}

                    {/* Stats Section - Conditioned on usernames being present */}
                    {(leetcodeUsername || codeforcesUsername || githubUsername) && fetchedStats && (
                        <div className="space-y-20">
                            {(leetcodeUsername || codeforcesUsername) && (
                                <CodingStats
                                    leetCode={leetcodeUsername ? fetchedStats.leetCodeStats : null}
                                    codeforces={codeforcesUsername ? fetchedStats.codeforcesStats : null}
                                />
                            )}
                            {githubUsername && fetchedStats.githubContributions && (
                                <ContributionActivity weeks={fetchedStats.githubContributions} />
                            )}
                        </div>
                    )}


                    {/* Replaced simple contact div with new ContactSection */}
                    <ContactSection userData={userData} />
                </main>

                <div className="fixed bottom-8 left-0 right-0 z-50 flex justify-center pointer-events-none">
                    <div className="pointer-events-auto">
                        <PortfolioDock
                            email={userData.personalInfo.email}
                            sections={{
                                about: !!userData.personalInfo.aboutMe,
                                education: userData.education.length > 0,
                                career: userData.workExperience.length > 0,
                                projects: projects.length > 0
                            }}
                        />
                    </div>
                </div>

                {/* Save Dialog */}
                {showSaveDialog && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                        <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Save Portfolio</h2>
                            <p className="text-gray-600 dark:text-gray-300">Give your portfolio a name to save it to your dashboard</p>



                            // ... existing useEffects ...

                            // ... render ...

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Portfolio Name</label>
                                <input
                                    type="text"
                                    value={portfolioName}
                                    onChange={(e) => setPortfolioName(e.target.value)}
                                    placeholder="e.g., Software Engineer Resume"
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-neutral-700 dark:text-white"
                                    autoFocus
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-200">LeetCode Username</label>
                                    <input
                                        type="text"
                                        value={leetcodeUsername}
                                        onChange={(e) => setLeetcodeUsername(e.target.value)}
                                        placeholder="Optional"
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-neutral-700 dark:text-white"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-200">CodeForces Username</label>
                                    <input
                                        type="text"
                                        value={codeforcesUsername}
                                        onChange={(e) => setCodeforcesUsername(e.target.value)}
                                        placeholder="Optional"
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-neutral-700 dark:text-white"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <Button
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => {
                                        setShowSaveDialog(false);
                                        setPortfolioName("");
                                    }}
                                    disabled={saving}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    className="flex-1 bg-gradient-to-r from-blue-600 to-slate-700 hover:from-blue-700 hover:to-slate-800 text-white"
                                    onClick={async () => {
                                        if (!data || !portfolioName.trim()) {
                                            alert("Please enter a portfolio name");
                                            return;
                                        }

                                        setSaving(true);
                                        try {
                                            const res = await fetch("/api/save-portfolio", {
                                                method: "POST",
                                                headers: { "Content-Type": "application/json" },
                                                body: JSON.stringify({
                                                    ...data,
                                                    portfolioName: portfolioName.trim(),
                                                    leetcodeUsername: leetcodeUsername.trim() || undefined,
                                                    codeforcesUsername: codeforcesUsername.trim() || undefined,
                                                }),
                                            });

                                            if (res.ok) {
                                                localStorage.removeItem("portfolioPreviewData");
                                                window.location.href = "/dashboard";
                                            } else {
                                                if (res.status === 401) {
                                                    alert("Please sign in to save your portfolio.");
                                                    window.location.href = "/sign-in?redirect_url=/portfolio/preview";
                                                } else {
                                                    const errorData = await res.json();
                                                    alert(errorData.error || "Failed to save portfolio");
                                                }
                                            }
                                        } catch (error) {
                                            console.error("Save error:", error);
                                            alert("An error occurred while saving");
                                        } finally {
                                            setSaving(false);
                                        }
                                    }}
                                    disabled={saving || !portfolioName.trim()}
                                >
                                    {saving ? "Saving..." : "Save"}
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </ReactLenis>
    );
}

