"use client";

import { useState } from "react";
import { Navigation } from "@/components/new-landing/Navigation";
import { AnimatedBackground } from "@/components/new-landing/AnimatedBackground";
import { LandingFooter } from "@/components/new-landing/LandingFooter";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Upload, FileText, Loader2, ArrowRight } from "lucide-react";

export default function GeneratePortfolioPage() {
    const [file, setFile] = useState<File | null>(null);
    const [githubUsername, setGithubUsername] = useState("");
    const [leetcodeUsername, setLeetcodeUsername] = useState("");
    const [codeforcesUsername, setCodeforcesUsername] = useState("");
    const [aboutMe, setAboutMe] = useState("");
    const [loading, setLoading] = useState(false);

    const handleGenerate = async () => {
        // Require either resume OR GitHub username
        if (!file && !githubUsername) {
            alert("Please upload a resume or enter your GitHub username.");
            return;
        }
        setLoading(true);

        try {
            let structuredResume: any = null;

            if (file) {
                const formData = new FormData();
                formData.append("resume", file);
                formData.append("jobDescription", "Generic Software Engineering Role");

                // 1. Parse Resume
                const res = await fetch("/api/ats", {
                    method: "POST",
                    body: formData,
                });

                if (!res.ok) {
                    const errData = await res.json();
                    throw new Error(errData.message || "Failed to scan resume");
                }

                const data = await res.json();
                const extractedText = data.extractedText;

                // 2. Improve/Structure Resume
                const improveRes = await fetch("/api/improve-resume", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        resumeText: extractedText,
                        feedback: [],
                        missingKeywords: [],
                        jobDescription: "Software Engineer with GitHub portfolio"
                    }),
                });

                if (!improveRes.ok) {
                    throw new Error("Failed to process resume data");
                }

                const improveData = await improveRes.json();
                structuredResume = improveData.structuredResume;
            } else if (githubUsername) {
                // No file uploaded, but GitHub username provided - create minimal structure
                structuredResume = {
                    personalInfo: {
                        name: githubUsername, // Default to username
                        contact: "",
                        summary: aboutMe || "Passionate about coding and building software.",
                    },
                    experience: [],
                    education: [],
                    skills: ["GitHub", "Software Engineering"], // Default skills
                };
            } else {
                throw new Error("Please provide either a resume or GitHub username.");
            }

            if (!structuredResume) {
                throw new Error("Could not structure resume data");
            }

            // 3. Merge User Inputs
            let contact = structuredResume.personalInfo.contact || "";
            if (githubUsername && !contact.toLowerCase().includes("github.com")) {
                contact += contact ? ` | github.com/${githubUsername}` : `github.com/${githubUsername}`;
            }
            if (leetcodeUsername && !contact.toLowerCase().includes("leetcode.com")) {
                contact += contact ? ` | leetcode.com/${leetcodeUsername}` : `leetcode.com/${leetcodeUsername}`;
            }
            if (codeforcesUsername && !contact.toLowerCase().includes("codeforces.com")) {
                contact += contact ? ` | codeforces.com/${codeforcesUsername}` : `codeforces.com/${codeforcesUsername}`;
            }

            const portfolioData = {
                ...structuredResume,
                personalInfo: {
                    ...structuredResume.personalInfo,
                    contact: contact,
                    customAboutMe: aboutMe || structuredResume.personalInfo.summary
                },
                externalData: {
                    github: githubUsername,
                    leetcode: leetcodeUsername,
                    codeforces: codeforcesUsername
                }
            };

            // 4. Save and Redirect
            localStorage.setItem("portfolioPreviewData", JSON.stringify(portfolioData));
            window.location.href = "/portfolio/preview";

        } catch (error: any) {
            console.error(error);
            alert(error.message || "Failed to generate portfolio. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen w-full bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 overflow-hidden text-gray-900 dark:text-white font-sans selection:bg-blue-500/30 transition-colors duration-500">

            {/* Background */}
            <div className="absolute inset-0 z-0">
                {/* Replaced LightRays with AnimatedBackground for consistency */}
                <AnimatedBackground />
            </div>

            <div className="relative z-10">
                <Navigation />

                <div className="min-h-screen flex items-center justify-center p-4 pt-24">
                    <div className="w-full max-w-2xl bg-white/80 dark:bg-white/10 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-3xl p-8 shadow-2xl">
                        <div className="text-center mb-8">
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-500 dark:from-blue-400 dark:via-cyan-400 dark:to-blue-500 bg-clip-text text-transparent mb-2">
                                Generate Your Portfolio
                            </h1>
                            <p className="text-gray-600 dark:text-gray-300">
                                Enter your details and upload your resume to create a stunning portfolio in seconds.
                            </p>
                        </div>

                        <div className="space-y-6">
                            {/* GitHub Profile */}
                            <div className="space-y-2">
                                <Label htmlFor="github" className="text-gray-700 dark:text-white flex items-center gap-1">
                                    GitHub Profile {!file && <span className="text-red-500 dark:text-red-400">*</span>}
                                </Label>
                                <Input
                                    id="github"
                                    placeholder="your-username"
                                    value={githubUsername}
                                    onChange={(e) => setGithubUsername(e.target.value)}
                                    className="bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/20"
                                />
                            </div>

                            {/* LeetCode & Codeforces */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="leetcode" className="text-gray-700 dark:text-white">LEETCODE</Label>
                                    <Input
                                        id="leetcode"
                                        placeholder="Optional"
                                        value={leetcodeUsername}
                                        onChange={(e) => setLeetcodeUsername(e.target.value)}
                                        className="bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/20"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="codeforces" className="text-gray-700 dark:text-white">CODEFORCES</Label>
                                    <Input
                                        id="codeforces"
                                        placeholder="Optional"
                                        value={codeforcesUsername}
                                        onChange={(e) => setCodeforcesUsername(e.target.value)}
                                        className="bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/20"
                                    />
                                </div>
                            </div>

                            {/* About Me */}
                            <div className="space-y-2">
                                <Label htmlFor="about" className="text-gray-700 dark:text-white">ABOUT ME (OPTIONAL)</Label>
                                <Textarea
                                    id="about"
                                    placeholder="Write a short bio about yourself..."
                                    value={aboutMe}
                                    onChange={(e) => setAboutMe(e.target.value)}
                                    className="bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/20 min-h-[100px] resize-none"
                                />
                            </div>

                            {/* Resume Upload */}
                            <div className="space-y-2">
                                <Label className="text-gray-700 dark:text-white flex items-center gap-2">
                                    <Upload className="w-4 h-4" />
                                    Resume Upload (PDF) {!githubUsername && <span className="text-red-500 dark:text-red-400">*</span>}
                                </Label>
                                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 dark:border-white/20 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 hover:border-blue-500 transition-all bg-white dark:bg-white/5 group">
                                    <input
                                        type="file"
                                        accept=".pdf"
                                        className="hidden"
                                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                                    />
                                    {file ? (
                                        <div className="flex flex-col items-center text-blue-600 dark:text-blue-400 group-hover:text-blue-500 dark:group-hover:text-blue-300">
                                            <FileText className="size-8 mb-2" />
                                            <span className="text-sm font-medium">{file.name}</span>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center text-gray-400 dark:text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300">
                                            <Upload className="size-8 mb-2" />
                                            <span className="text-sm">Click to upload</span>
                                        </div>
                                    )}
                                </label>
                            </div>

                            {/* Submit Button */}
                            <Button
                                className="w-full h-14 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all mt-4"
                                onClick={handleGenerate}
                                disabled={(!file && !githubUsername) || loading}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        Generate Portfolio
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </>
                                )}
                            </Button>

                        </div>
                    </div>
                </div>
                <LandingFooter />
            </div>
        </div>
    );
}
