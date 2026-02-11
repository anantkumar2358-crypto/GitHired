// @ts-nocheck
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Upload, FileText, CheckCircle, AlertCircle, Loader2, ArrowRight, Download, Sparkles, Copy, Check, FileJson, ZoomIn, ZoomOut } from "lucide-react";
import { motion } from "motion/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import dynamic from 'next/dynamic';
import { ResumePreview, ResumeData } from "./ResumePreview";

const PDFViewer = dynamic(() => import('./PDFViewer').then(mod => mod.PDFViewer), {
    ssr: false,
    loading: () => <div className="h-[600px] w-full flex items-center justify-center bg-gray-50 text-gray-400">Loading PDF Viewer...</div>
});

interface ATSResult {
    score: number;
    missingKeywords: string[];
    feedback: string[];
    summary: string;
    extractedText?: string;
}

export function ATSChecker() {
    const [file, setFile] = useState<File | null>(null);
    const [jobDescription, setJobDescription] = useState("");
    const [aboutMe, setAboutMe] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<ATSResult | null>(null);
    const [improving, setImproving] = useState(false);
    const [improvedResume, setImprovedResume] = useState<string | null>(null);
    const [improvedScore, setImprovedScore] = useState<number | null>(null);
    const [structuredResume, setStructuredResume] = useState<ResumeData | null>(null);
    const [resumeText, setResumeText] = useState<string>("");
    const [showPdf, setShowPdf] = useState(true);
    const [showVisualResume, setShowVisualResume] = useState(true);
    const [zoom, setZoom] = useState(0.8);
    const [copied, setCopied] = useState(false);

    const handleScan = async () => {
        if (!file) return;
        setLoading(true);
        setResult(null);

        const formData = new FormData();
        formData.append("resume", file);
        formData.append("jobDescription", jobDescription);

        try {
            const res = await fetch("/api/ats", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) {
                const errData = await res.json();
                // Show detailed error message
                const errorMessage = errData.message
                    ? `${errData.error}: ${errData.message}`
                    : errData.error || "Scan failed";
                throw new Error(errorMessage);
            }

            const data = await res.json();
            setResult(data);
            if (data.extractedText) {
                setResumeText(data.extractedText);
            }
        } catch (error: any) {
            console.error(error);
            // Display error as alert with full details
            alert(error.message || "Failed to scan resume. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleImprove = async () => {
        if (!result || !file) return;
        setImproving(true);

        try {
            const res = await fetch("/api/improve-resume", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    resumeText, // Use extracted text from state
                    feedback: result.feedback,
                    missingKeywords: result.missingKeywords,
                    jobDescription
                }),
            });

            if (!res.ok) {
                throw new Error("Failed to improve resume");
            }

            const data = await res.json();
            setImprovedResume(data.improvedResume);
            setStructuredResume(data.structuredResume);
            setImprovedScore(data.improvedScore);
        } catch (error: any) {
            console.error(error);
            alert(error.message || "Failed to improve resume. Please try again.");
        } finally {
            setImproving(false);
        }
    };

    const handleCopy = async () => {
        if (!improvedResume) return;
        await navigator.clipboard.writeText(improvedResume);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownloadJSON = () => {
        if (!structuredResume) return;
        const blob = new Blob([JSON.stringify(structuredResume, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "resume-data.json";
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleDownloadPDF = async () => {
        if (!structuredResume && !improvedResume) return;

        try {
            // If we have structured resume, use LaTeX generation
            if (structuredResume) {
                const response = await fetch('/api/generate-latex-pdf', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(structuredResume),
                });

                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.details || 'Failed to generate PDF');
                }

                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'improved-resume.pdf';
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
                return;
            }

            // Fallback for plain text resume
            if (improvedResume) {
            } else {
                // Fallback to text-based PDF
                const { jsPDF } = await import('jspdf');
                const doc = new jsPDF();
                const margin = 20;
                const pageWidth = doc.internal.pageSize.getWidth();
                const pageHeight = doc.internal.pageSize.getHeight();
                let y = margin;

                const checkPageBreak = (requiredSpace: number) => {
                    if (y + requiredSpace > pageHeight - margin) {
                        doc.addPage();
                        y = margin;
                        return true;
                    }
                    return false;
                };

                if (structuredResume) {
                    doc.setFontSize(24);
                    doc.setFont('helvetica', 'bold');
                    // @ts-ignore
                    doc.text(structuredResume.personalInfo.name, margin, y);
                    y += 12;

                    doc.setFontSize(10);
                    doc.setFont('helvetica', 'normal');
                    const contactLines = doc.splitTextToSize(structuredResume.personalInfo.contact, pageWidth - 2 * margin);
                    contactLines.forEach((line: string) => {
                        doc.text(line, margin, y);
                        y += 5;
                    });
                    y += 5;

                    if (structuredResume.personalInfo.summary) {
                        checkPageBreak(20);
                        doc.setFontSize(11);
                        doc.setFont('helvetica', 'italic');
                        const summaryLines = doc.splitTextToSize(structuredResume.personalInfo.summary, pageWidth - 2 * margin);
                        summaryLines.forEach((line: string) => {
                            doc.text(line, margin, y);
                            y += 6;
                        });
                        y += 8;
                    }

                    if (structuredResume.experience && structuredResume.experience.length > 0) {
                        checkPageBreak(15);
                        doc.setFontSize(14);
                        doc.setFont('helvetica', 'bold');
                        doc.text('EXPERIENCE', margin, y);
                        y += 8;
                        structuredResume.experience.forEach((exp) => {
                            checkPageBreak(30);
                            doc.setFontSize(12);
                            doc.setFont('helvetica', 'bold');
                            doc.text(exp.role, margin, y);
                            y += 6;
                            doc.setFontSize(10);
                            doc.setFont('helvetica', 'normal');
                            doc.text(`${exp.company} | ${exp.date}`, margin, y);
                            y += 6;
                            exp.description.forEach((bullet) => {
                                checkPageBreak(10);
                                const bulletLines = doc.splitTextToSize(`â€¢ ${bullet}`, pageWidth - 2 * margin - 5);
                                bulletLines.forEach((line: string, idx: number) => {
                                    doc.text(line, margin + (idx > 0 ? 5 : 0), y);
                                    y += 5;
                                });
                            });
                            y += 5;
                        });
                    }

                    if (structuredResume.education && structuredResume.education.length > 0) {
                        checkPageBreak(15);
                        doc.setFontSize(14);
                        doc.setFont('helvetica', 'bold');
                        doc.text('EDUCATION', margin, y);
                        y += 8;
                        structuredResume.education.forEach((edu) => {
                            checkPageBreak(20);
                            doc.setFontSize(11);
                            doc.setFont('helvetica', 'bold');
                            doc.text(edu.degree, margin, y);
                            y += 6;
                            doc.setFontSize(10);
                            doc.setFont('helvetica', 'normal');
                            doc.text(`${edu.school} | ${edu.date}`, margin, y);
                            y += 6;
                            if (edu.description) {
                                const descLines = doc.splitTextToSize(edu.description, pageWidth - 2 * margin);
                                descLines.forEach((line: string) => {
                                    doc.text(line, margin, y);
                                    y += 5;
                                });
                            }
                            y += 3;
                        });
                    }

                    if (structuredResume.skills && structuredResume.skills.length > 0) {
                        checkPageBreak(15);
                        doc.setFontSize(14);
                        doc.setFont('helvetica', 'bold');
                        doc.text('SKILLS', margin, y);
                        y += 8;
                        doc.setFontSize(10);
                        doc.setFont('helvetica', 'normal');
                        const skillsText = structuredResume.skills.join(' â€¢ ');
                        const skillLines = doc.splitTextToSize(skillsText, pageWidth - 2 * margin);
                        skillLines.forEach((line: string) => {
                            checkPageBreak(6);
                            doc.text(line, margin, y);
                            y += 5;
                        });
                    }
                } else if (improvedResume) {
                    doc.setFontSize(11);
                    const lines = doc.splitTextToSize(improvedResume, pageWidth - 2 * margin);
                    lines.forEach((line: string) => {
                        checkPageBreak(7);
                        doc.text(line, margin, y);
                        y += 7;
                    });
                }

                doc.save('improved-resume.pdf');
            }
        } catch (error: any) {
            console.error("PDF generation error:", error);
            if (error.message && error.message.includes('html2canvas')) {
                alert('Please install html2canvas first. Run: npm install html2canvas');
            } else {
                alert("Failed to generate PDF. Please try again.");
            }
        }
    };

    const handleGeneratePortfolio = async () => {
        if (!structuredResume) return;

        // Store in localStorage and redirect to preview
        localStorage.setItem("portfolioPreviewData", JSON.stringify(structuredResume));
        window.location.href = "/portfolio/preview";
    };

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
                    ATS Resume Scanner
                </h1>
                <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                    Check if your resume passes the Applicant Tracking Systems used by top companies.
                    Get a score, missing keywords, and actionable feedback.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Input Section */}
                <Card className="bg-white/80 dark:bg-white/10 backdrop-blur-md border-gray-200 dark:border-white/10 text-gray-900 dark:text-white shadow-xl">
                    <CardHeader>
                        <CardTitle>Upload Resume & Job Description</CardTitle>
                        <CardDescription className="text-gray-500 dark:text-gray-400">
                            See how well your resume matches the job you want.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label className="text-gray-700 dark:text-white">Resume (PDF)</Label>
                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 dark:border-white/20 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 hover:border-blue-500 transition-all bg-white dark:bg-white/5 group">
                                <input
                                    type="file"
                                    accept=".pdf"
                                    className="hidden"
                                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                                />
                                {file ? (
                                    <div className="flex flex-col items-center text-blue-600 dark:text-blue-400">
                                        <FileText className="size-8 mb-2" />
                                        <span className="text-sm font-medium">{file.name}</span>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center text-gray-500 dark:text-gray-400">
                                        <Upload className="size-8 mb-2" />
                                        <span className="text-sm">Click to upload PDF</span>
                                    </div>
                                )}
                            </label>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-gray-700 dark:text-white">Job Description (Optional)</Label>
                            <Textarea
                                placeholder="Paste the job description here..."
                                className="h-32 resize-none bg-white dark:bg-white/5 border-gray-300 dark:border-white/10 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-500 focus:border-blue-500"
                                value={jobDescription}
                                onChange={(e) => setJobDescription(e.target.value)}
                            />
                        </div>





                        <Button
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20"
                            size="lg"
                            onClick={handleScan}
                            disabled={!file || loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Scanning...
                                </>
                            ) : (
                                "Scan Resume"
                            )}
                        </Button>
                    </CardContent>
                </Card>

                {/* Results Section */}
                <div className="space-y-6">
                    {result ? (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-6"
                        >
                            <Card className="bg-white/80 dark:bg-white/10 backdrop-blur-md border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white shadow-xl overflow-hidden">
                                <div className={`h-2 w-full ${getScoreColor(result.score)}`} />
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle>ATS Score</CardTitle>
                                        <span className={`text-4xl font-bold ${getScoreTextColor(result.score)}`}>
                                            {result.score}/100
                                        </span>
                                    </div>
                                    <Progress value={result.score} className="h-2 bg-gray-100 dark:bg-white/10" />
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600 dark:text-gray-300">{result.summary}</p>
                                </CardContent>
                            </Card>

                            <Card className="bg-white/80 dark:bg-white/10 backdrop-blur-md border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white">
                                <CardHeader>
                                    <CardTitle className="text-base flex items-center gap-2">
                                        <AlertCircle className="size-4 text-orange-500" />
                                        Missing Keywords
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-2">
                                        {result.missingKeywords.length > 0 ? (
                                            result.missingKeywords.map((keyword, i) => (
                                                <span key={i} className="px-2 py-1 bg-red-500/10 text-red-600 dark:text-red-300 text-xs rounded-full border border-red-500/20 font-medium">
                                                    {keyword}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-gray-600 dark:text-gray-400 text-sm">No critical keywords missing!</span>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border border-gray-200 dark:border-white/10 bg-white/80 dark:bg-white/5">
                                <CardHeader>
                                    <CardTitle className="text-base flex items-center gap-2 text-gray-900 dark:text-white">
                                        <CheckCircle className="size-4 text-green-500" />
                                        Improvements
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-3">
                                        {result.feedback.map((tip, i) => (
                                            <li key={i} className="text-sm text-gray-600 dark:text-gray-300 flex gap-2 items-start">
                                                <ArrowRight className="size-4 text-blue-500 dark:text-blue-400 shrink-0 mt-0.5" />
                                                {tip}
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>

                            {/* Resume Improvement Actions */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                                <Button
                                    onClick={handleImprove}
                                    disabled={improving || !file}
                                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700 shadow-lg shadow-blue-500/20"
                                    size="lg"
                                >
                                    {improving ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Improving Resume...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="mr-2 h-4 w-4" />
                                            Auto-Improve Resume
                                        </>
                                    )}
                                </Button>

                                <Button
                                    onClick={handleDownloadPDF}
                                    disabled={!improvedResume}
                                    variant="outline"
                                    className="w-full border-2 border-gray-300 dark:border-white/10 bg-transparent text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-white/5 hover:text-blue-500"
                                    size="lg"
                                >
                                    <Download className="mr-2 h-4 w-4" />
                                    Download Improved PDF
                                </Button>
                            </div>

                            <div className="pt-2">
                                <Button
                                    onClick={handleGeneratePortfolio}
                                    disabled={!structuredResume}
                                    className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white hover:from-blue-600 hover:to-blue-800 shadow-lg shadow-blue-500/20 h-12 text-lg"
                                    size="lg"
                                >
                                    <Sparkles className="mr-2 h-5 w-5" />
                                    ðŸ‘ï¸ Preview Portfolio
                                </Button>
                            </div>

                            {improvedResume && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-4 bg-green-50 border border-green-200 dark:bg-green-500/10 dark:border-green-500/20 rounded-lg space-y-3"
                                >
                                    <div className="flex items-center gap-3 text-green-700 dark:text-green-400">
                                        <CheckCircle className="h-5 w-5 shrink-0" />
                                        <div>
                                            <p className="font-medium">Resume Improved Successfully!</p>
                                            <p className="text-sm opacity-80">Your resume has been optimized for ATS systems.</p>
                                        </div>
                                    </div>

                                    {improvedScore && (
                                        <div className="flex items-center gap-4 pl-8">
                                            <div className="bg-white dark:bg-white/10 px-3 py-1 rounded-full border border-green-200 dark:border-green-500/20 text-sm font-semibold text-green-700 dark:text-green-400 shadow-sm">
                                                New Score: <span className="text-lg">{improvedScore}/100</span>
                                            </div>
                                            {result && improvedScore > result.score && (
                                                <span className="text-xs font-medium text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-500/10 px-2 py-0.5 rounded-full">
                                                    +{improvedScore - result.score} points
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </motion.div>
                    ) : (
                        <div className="h-full flex items-center justify-center p-8 border-2 border-dashed border-gray-300 dark:border-white/20 rounded-xl bg-white/50 dark:bg-white/5">
                            <div className="text-center text-gray-600 dark:text-gray-400">
                                <FileText className="size-16 mx-auto mb-4 opacity-50" />
                                <h3 className="text-lg font-medium mb-1 text-gray-900 dark:text-white">Ready to Scan</h3>
                                <p className="text-sm">Upload your resume to see your ATS score</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Resume Preview Section */}
            {
                (resumeText || improvedResume) && (
                    <div className="grid md:grid-cols-2 gap-8 py-8 border-t border-gray-200 dark:border-white/10">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-900 dark:text-white">
                                    <FileText className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                                    Original Resume
                                </h3>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-xs h-8 px-2 text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10"
                                    onClick={() => setShowPdf(!showPdf)}
                                >
                                    {showPdf ? "View Extracted Text" : "View PDF"}
                                </Button>
                            </div>
                            <div className="h-[600px] w-full bg-white dark:bg-white/5 rounded-lg border border-gray-200 dark:border-white/10 overflow-hidden shadow-inner relative">
                                {!file ? (
                                    <div className="h-full flex items-center justify-center text-gray-500">
                                        No resume uploaded
                                    </div>
                                ) : showPdf && file ? (
                                    <PDFViewer file={file} />
                                ) : (
                                    <div className="h-full w-full p-4 overflow-y-auto font-mono text-sm whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                                        {resumeText || "No text extracted yet..."}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold flex items-center gap-2 text-green-600 dark:text-green-400">
                                    <Sparkles className="h-5 w-5 text-green-600 dark:text-green-400" />
                                    Improved Version
                                </h3>
                                <div className="flex items-center gap-1">
                                    {structuredResume && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-xs h-8 px-2 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 hover:bg-green-100 dark:hover:bg-green-500/10"
                                            onClick={() => setShowVisualResume(!showVisualResume)}
                                        >
                                            {showVisualResume ? "View Plain Text" : "View Visual Resume"}
                                        </Button>
                                    )}
                                    {structuredResume && showVisualResume && (
                                        <div className="flex items-center gap-1 bg-gray-100 dark:bg-white/5 rounded-lg p-0.5 mr-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-500/10"
                                                onClick={() => setZoom(z => Math.max(0.2, z - 0.1))}
                                                title="Zoom Out"
                                            >
                                                <ZoomOut className="h-4 w-4" />
                                            </Button>
                                            <span className="text-xs font-mono w-10 text-center text-gray-500 dark:text-gray-400 font-medium">{Math.round(zoom * 100)}%</span>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-500/10"
                                                onClick={() => setZoom(z => Math.min(2.0, z + 0.1))}
                                                title="Zoom In"
                                            >
                                                <ZoomIn className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    )}
                                    {improvedResume && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-500/10"
                                            onClick={handleCopy}
                                            title="Copy to Clipboard"
                                        >
                                            {copied ? <Check className="h-4 w-4 text-green-600 dark:text-green-400" /> : <Copy className="h-4 w-4" />}
                                        </Button>
                                    )}
                                    {structuredResume && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-500/10"
                                            onClick={handleDownloadJSON}
                                            title="Download JSON Data"
                                        >
                                            <FileJson className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                            <div className="h-[600px] w-full bg-white rounded-lg border-2 border-green-200 dark:border-green-500/20 overflow-y-auto shadow-inner relative">
                                {improvedResume ? (
                                    showVisualResume && structuredResume ? (
                                        <div className="absolute inset-0 z-10 w-full h-full overflow-auto bg-gray-100 p-8 flex justify-center items-start">
                                            <div
                                                id="visual-resume-preview"
                                                className="bg-white shadow-2xl origin-top shrink-0 mx-auto"
                                                style={{
                                                    width: '210mm',
                                                    minHeight: '297mm',
                                                    transform: `scale(${zoom})`,
                                                    transformOrigin: 'top center'
                                                }}
                                            >
                                                <ResumePreview data={structuredResume} />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="p-4 font-mono text-sm whitespace-pre-wrap text-gray-800">
                                            {improvedResume}
                                        </div>
                                    )
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4 bg-gray-50">
                                        <Sparkles className="h-8 w-8 opacity-20" />
                                        <p className="text-center">
                                            Click "Auto-Improve Resume" above<br />
                                            to generate the optimized version.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
}

function getScoreColor(score: number) {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-red-500";
}

function getScoreTextColor(score: number) {
    if (score >= 80) return "text-green-600 dark:text-green-400";
    if (score >= 60) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
}

