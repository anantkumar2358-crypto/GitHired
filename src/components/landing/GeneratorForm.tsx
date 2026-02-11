"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, Github, ArrowRight, Code } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function GeneratorForm() {
    const [username, setUsername] = useState("");
    const [leetCodeUser, setLeetCodeUser] = useState("");
    const [codeforcesUser, setCodeforcesUser] = useState("");
    const [aboutMe, setAboutMe] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!username) return;

        // Check file size (Vercel limit is 4.5MB)
        if (file && file.size > 4 * 1024 * 1024) {
            alert("File is too large! Please upload a PDF smaller than 4MB.");
            return;
        }

        setLoading(true);

        try {
            const formData = new FormData();
            formData.append("username", username);
            formData.append("leetCodeUser", leetCodeUser);
            formData.append("codeforcesUser", codeforcesUser);
            formData.append("aboutMe", aboutMe);
            if (file) formData.append("resume", file);

            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const errorText = await response.text();
                try {
                    const errorData = JSON.parse(errorText);
                    alert(`Upload failed: ${errorData.error || response.statusText}\nDetails: ${errorData.details || "No details provided"}`);
                } catch (e) {
                    alert(`Server Error (${response.status}): Check console for details.`);
                }
                setLoading(false);
                return;
            }

            router.push(`/portfolio/${username}`);
        } catch (error) {
            console.error("Upload network error", error);
            alert("Network error during upload. Check console.");
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/80 backdrop-blur-xl p-6 md:p-8 rounded-2xl border border-white/20 shadow-2xl relative overflow-hidden max-w-lg mx-auto w-full text-left dark:bg-neutral-900/80 dark:border-white/10"
        >
            <form onSubmit={handleSubmit} className="flex flex-col gap-5 relative z-10">
                <div className="space-y-2">
                    <Label className="text-muted-foreground font-semibold flex items-center gap-2">
                        <Github size={16} /> GitHub Profile <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                        <Input
                            type="text"
                            placeholder="your-username"
                            className="pl-4 pr-10 bg-background border-input focus:border-purple-500 focus:ring-purple-200 dark:bg-neutral-800 dark:border-neutral-700"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label className="text-muted-foreground font-semibold text-xs uppercase tracking-wide">LeetCode</Label>
                        <Input
                            type="text"
                            placeholder="Optional"
                            className="bg-background border-input focus:border-yellow-500 focus:ring-yellow-200 text-sm dark:bg-neutral-800 dark:border-neutral-700"
                            value={leetCodeUser}
                            onChange={(e) => setLeetCodeUser(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-muted-foreground font-semibold text-xs uppercase tracking-wide">Codeforces</Label>
                        <Input
                            type="text"
                            placeholder="Optional"
                            className="bg-background border-input focus:border-red-500 focus:ring-red-200 text-sm dark:bg-neutral-800 dark:border-neutral-700"
                            value={codeforcesUser}
                            onChange={(e) => setCodeforcesUser(e.target.value)}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label className="text-muted-foreground font-semibold text-xs uppercase tracking-wide">About Me (Optional)</Label>
                    <textarea
                        placeholder="Write a short bio about yourself..."
                        className="w-full min-h-[100px] p-3 rounded-lg bg-background border border-input focus:border-purple-500 focus:ring-purple-200 text-sm resize-none dark:bg-neutral-800 dark:border-neutral-700"
                        value={aboutMe}
                        onChange={(e) => setAboutMe(e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <Label className="text-muted-foreground font-semibold flex items-center gap-2">
                        <Upload size={16} /> Resume Upload (PDF)
                    </Label>
                    <label className="flex items-center justify-center w-full h-20 border-2 border-dashed border-input rounded-xl cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition-all group relative overflow-hidden bg-muted/50 dark:hover:bg-purple-900/20">
                        <input
                            type="file"
                            accept=".pdf"
                            className="hidden"
                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                        />
                        <div className="flex flex-col items-center gap-1 text-slate-500 group-hover:text-purple-600 transition-colors z-10">
                            {file ? (
                                <>
                                    <div className="p-1.5 rounded-full bg-purple-100 text-purple-600">
                                        <Code size={18} />
                                    </div>
                                    <span className="text-sm font-medium truncate max-w-[200px]">{file.name}</span>
                                </>
                            ) : (
                                <>
                                    <Upload size={20} />
                                    <span className="text-xs font-medium">Click to upload</span>
                                </>
                            )}
                        </div>
                    </label>
                </div>

                <Button
                    type="submit"
                    disabled={loading}
                    size="lg"
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-6 rounded-xl transition-all shadow-lg hover:shadow-purple-500/25 mt-2"
                >
                    {loading ? (
                        <span className="flex items-center gap-2">
                            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Building Magic...
                        </span>
                    ) : (
                        <>
                            <span>Generate Portfolio</span>
                            <ArrowRight size={20} className="ml-2" />
                        </>
                    )}
                </Button>
            </form>
        </motion.div>
    );
}
