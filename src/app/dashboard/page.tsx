"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AnimatedBackground } from "@/components/new-landing/AnimatedBackground";
import { FileText, Plus, Eye, Edit2, Trash2 } from "lucide-react";
import { Navigation } from "@/components/new-landing/Navigation";

interface Resume {
    id: string;
    name: string | null;
    professionalSummary: string | null;
    skills: string[];
    createdAt: Date;
}

export default function DashboardPage() {
    const { user, isLoaded } = useUser();
    const router = useRouter();
    const [savedResumes, setSavedResumes] = useState<Resume[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editName, setEditName] = useState("");
    const [dbUsername, setDbUsername] = useState<string | null>(null);

    useEffect(() => {
        if (!isLoaded) return;

        if (!user) {
            router.push("/sign-in");
            return;
        }

        fetchPortfolios();
    }, [user, isLoaded, router]);

    const fetchPortfolios = async () => {
        try {
            const res = await fetch("/api/get-portfolios");
            const data = await res.json();

            if (data.success) {
                setSavedResumes(data.portfolios || []);
                setDbUsername(data.username);
            }
        } catch (error) {
            console.error("Error fetching portfolios:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleRename = async (portfolioId: string) => {
        if (!editName.trim()) {
            alert("Please enter a valid name");
            return;
        }

        try {
            const res = await fetch("/api/rename-portfolio", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ portfolioId, newName: editName }),
            });

            if (res.ok) {
                setSavedResumes(prev =>
                    prev.map(r => r.id === portfolioId ? { ...r, name: editName } : r)
                );
                setEditingId(null);
                setEditName("");
            } else {
                const data = await res.json();
                alert(data.error || "Failed to rename portfolio");
            }
        } catch (error) {
            console.error("Error renaming:", error);
            alert("An error occurred while renaming");
        }
    };

    const handleDelete = async (portfolioId: string, portfolioName: string) => {
        if (!confirm(`Are you sure you want to delete "${portfolioName}"? This action cannot be undone.`)) {
            return;
        }

        try {
            const res = await fetch("/api/delete-portfolio", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ portfolioId }),
            });

            if (res.ok) {
                setSavedResumes(prev => prev.filter(r => r.id !== portfolioId));
            } else {
                const data = await res.json();
                alert(data.error || "Failed to delete portfolio");
            }
        } catch (error) {
            console.error("Error deleting:", error);
            alert("An error occurred while deleting");
        }
    };

    if (!isLoaded || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
                <p className="text-gray-600 dark:text-gray-300">Loading...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen relative pt-32 px-8 pb-8 bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-gray-900 dark:text-white transition-colors duration-500">
            <Navigation />
            <AnimatedBackground />

            <div className="relative z-10 max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-slate-700 bg-clip-text text-transparent mb-2">
                        Welcome back, {user?.firstName || "User"}!
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300">
                        Manage your saved portfolios
                    </p>
                </div>

                {/* Portfolios Grid */}
                {savedResumes.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {savedResumes.map((resume) => (
                            <div
                                key={resume.id}
                                className="bg-white/80 dark:bg-neutral-800/80 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-white/20 dark:border-white/10 hover:shadow-xl transition-all"
                            >
                                <div className="flex items-start gap-4 mb-4">
                                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center shrink-0">
                                        <FileText className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        {editingId === resume.id ? (
                                            <input
                                                type="text"
                                                value={editName}
                                                onChange={(e) => setEditName(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") handleRename(resume.id);
                                                    if (e.key === "Escape") {
                                                        setEditingId(null);
                                                        setEditName("");
                                                    }
                                                }}
                                                className="w-full px-2 py-1 text-lg font-semibold bg-white dark:bg-neutral-700 border border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                autoFocus
                                            />
                                        ) : (
                                            <h3 className="font-semibold text-lg truncate">
                                                {resume.name || resume.professionalSummary?.slice(0, 50) || "Untitled Portfolio"}
                                            </h3>
                                        )}
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                            {new Date(resume.createdAt).toLocaleDateString("en-US", {
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric",
                                            })}
                                        </p>
                                    </div>
                                </div>

                                {/* Skills Preview */}
                                {resume.skills && resume.skills.length > 0 && (
                                    <div className="mb-4">
                                        <div className="flex flex-wrap gap-2">
                                            {resume.skills.slice(0, 3).map((skill, idx) => (
                                                <span
                                                    key={idx}
                                                    className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full"
                                                >
                                                    {skill}
                                                </span>
                                            ))}
                                            {resume.skills.length > 3 && (
                                                <span className="px-2 py-1 text-gray-500 dark:text-gray-400 text-xs">
                                                    +{resume.skills.length - 3} more
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="flex gap-2">
                                    {editingId === resume.id ? (
                                        <>
                                            <button
                                                onClick={() => handleRename(resume.id)}
                                                className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-all"
                                            >
                                                Save
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setEditingId(null);
                                                    setEditName("");
                                                }}
                                                className="flex-1 px-3 py-2 bg-gray-500 hover:bg-gray-600 text-white text-sm font-medium rounded-lg transition-all"
                                            >
                                                Cancel
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <Link href={`/portfolio/${dbUsername}`} className="flex-1">
                                                <button className="w-full px-3 py-2 bg-gradient-to-r from-blue-600 to-slate-700 hover:from-blue-700 hover:to-slate-800 text-white text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2">
                                                    <Eye className="w-4 h-4" />
                                                    View
                                                </button>
                                            </Link>
                                            <button
                                                onClick={() => {
                                                    setEditingId(resume.id);
                                                    setEditName(resume.name || "");
                                                }}
                                                className="px-3 py-2 border-2 border-white/10 bg-transparent text-gray-700 dark:text-gray-300 hover:bg-white/5 rounded-lg transition-all"
                                                title="Rename"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(resume.id, resume.name || "this portfolio")}
                                                className="px-3 py-2 border-2 border-red-500/20 bg-transparent text-red-600 dark:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}

                        {/* Add New Card */}
                        <Link href="/ats-check">
                            <div className="bg-white/40 dark:bg-neutral-800/40 backdrop-blur-xl p-6 rounded-2xl border-2 border-dashed border-blue-300 dark:border-blue-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all hover:scale-[1.02] cursor-pointer flex flex-col items-center justify-center min-h-[200px] group">
                                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <Plus className="w-8 h-8" />
                                </div>
                                <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                                    Create New Portfolio
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center">
                                    Upload a resume to get started
                                </p>
                            </div>
                        </Link>
                    </div>
                ) : (
                    // Empty State
                    <div className="bg-white/80 dark:bg-neutral-800/80 backdrop-blur-xl p-12 rounded-3xl shadow-2xl border border-white/20 dark:border-white/10 text-center max-w-md mx-auto">
                        <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FileText className="w-10 h-10" />
                        </div>
                        <h2 className="text-2xl font-bold mb-3">No Portfolios Yet</h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-6">
                            Create your first portfolio by uploading your resume
                        </p>
                        <Link href="/ats-check">
                            <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-slate-700 hover:from-blue-700 hover:to-slate-800 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]">
                                Get Started
                            </button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
