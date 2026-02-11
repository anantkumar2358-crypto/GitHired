import { getGitHubProfile, getGitHubRepos, getGitHubContributions } from "@/lib/github";
import { getLeetCodeStats, getCodeforcesStats } from "@/lib/coding-platforms";
import { generateProfessionalSummary } from "@/lib/gemini";
import { extractInterestsWithAI, enhanceBio } from "@/lib/groq";
import { getPortfolioData } from "@/lib/db-queries";
import fs from "fs/promises";
import path from "path";
import ReactLenis from "lenis/react";

// New Portfolio Components
import Header from "@/components/portfolio-layout/ui/Header";
import { HeroSection } from "@/components/portfolio-layout/ui/HeroSection";
import StripedBackground from "@/components/portfolio-layout/ui/lightswind/StripedBackground";
import { AboutSection } from "@/components/portfolio-layout/ui/AboutSection";
import { EducationSection } from "@/components/portfolio-layout/ui/EducationSection";
import SkillsSection from "@/components/portfolio-layout/ui/SkillCategory";
import { CareerTimeline } from "@/components/portfolio-layout/ui/CareerTimeline";
// import Dock from "@/components/portfolio-layout/ui/lightswind/dock"; // REPLACED
import { PortfolioDock } from "@/components/portfolio-layout/ui/PortfolioDock";
import { FeaturedWork } from "@/components/portfolio-layout/FeaturedWork";
import { ShareButton } from "@/components/portfolio-layout/ShareButton";
import { ContributionActivity } from "@/components/portfolio-layout/ContributionActivity";
import { CodingStats } from "@/components/portfolio-layout/CodingStats";


// Helper to get resume data
async function getResumeData(username: string) {
    try {
        console.log(`[Portfolio] Fetching data for ${username} from database...`);
        const dbData = await getPortfolioData(username);

        if (dbData && dbData.resumeData) {
            console.log(`[Portfolio] ✅ Found data in database for ${username}`);
            return {
                username: dbData.user.username,
                leetCodeUser: dbData.codingStats?.leetcodeUsername || null,
                codeforcesUser: dbData.codingStats?.codeforcesUsername || null,
                resumeText: dbData.resumeData.resumeText || "",
                structuredData: {
                    professionalSummary: dbData.resumeData.professionalSummary || "",
                    skills: dbData.resumeData.skills || [],
                    experience: dbData.resumeData.experience || [],
                    education: dbData.resumeData.education || [],
                    certifications: dbData.resumeData.certifications || [],
                },
                aboutMe: dbData.resumeData.aboutMe || "",
                personalInfo: {
                    name: dbData.resumeData.contactInfo?.split("|")[0]?.trim() || dbData.user.username, // Fallback name extraction
                    role: "Full Stack Developer", // Default or extract if possible
                    headline: dbData.resumeData.professionalSummary?.slice(0, 100) + "...",
                    summary: dbData.resumeData.professionalSummary,
                    contact: dbData.resumeData.contactInfo || "",
                    aboutMe: dbData.resumeData.aboutMe || "",
                },
                skills: dbData.resumeData.skills || {}
            };
        }
        console.log(`[Portfolio] ⚠️  No data in database for ${username}, trying JSON fallback...`);
    } catch (error) {
        console.error(`[Portfolio] ❌ Database error for ${username}:`, error);
    }

    try {
        const dataDir = path.join(process.cwd(), "data");
        const filePath = path.join(dataDir, `${username}.json`);
        const fileContent = await fs.readFile(filePath, "utf-8");
        console.log(`[Portfolio] ✅ Found data in JSON file for ${username}`);
        return JSON.parse(fileContent);
    } catch (error) {
        console.error(`[Portfolio] ❌ JSON file not found for ${username}`);
        return null;
    }
}

export default async function PortfolioPage({ params }: { params: Promise<{ username: string }> }) {
    const { username } = await params;

    const [profile, repos, resumeData] = await Promise.all([
        getGitHubProfile(username),
        getGitHubRepos(username),
        getResumeData(username)
    ]);

    // Determine usernames for stats (fallback to GitHub username if not in DB)
    const leetCodeUsername = resumeData?.leetCodeUser || username;
    const codeforcesUsername = resumeData?.codeforcesUser || username;

    console.log(`[Portfolio] Fetching stats for LeetCode: ${leetCodeUsername}, CodeForces: ${codeforcesUsername}`);

    const [leetCodeStats, codeforcesStats, githubContributions] = await Promise.all([
        getLeetCodeStats(leetCodeUsername),
        getCodeforcesStats(codeforcesUsername),
        getGitHubContributions(username)
    ]);

    if (!profile && !resumeData) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-900 text-white">
                <h1>User not found or API rate limited.</h1>
            </div>
        );
    }

    // Data Processing
    // Safe access to repos in case it's null/empty
    const safeRepos = repos || [];
    const topRepos = safeRepos.slice(0, 6);
    const githubLanguages = Array.from(new Set(safeRepos.map(r => r.language).filter(l => l !== "Unknown")));
    const resumeSkills = resumeData?.structuredData?.skills || {};

    // Normalize skills for the UI components if needed
    // The components expect `userData.skills` to be an object with `technical` (array) and `soft` (array/strings)

    const professionalSummary = resumeData?.structuredData?.professionalSummary
        ? resumeData.structuredData.professionalSummary
        : (profile?.bio ? await generateProfessionalSummary(profile.bio, githubLanguages) : "A passionate developer building amazing things.");


    // Construct userData object for new components
    const userData = {
        personalInfo: {
            name: profile?.name || resumeData?.personalInfo?.name || username,
            role: profile?.bio ? profile.bio.split(" | ")[0] : (resumeData?.personalInfo?.role || "Software Engineer"),
            headline: resumeData?.personalInfo?.headline || `Passionate ${profile?.bio ? profile.bio.split(" | ")[0] : (resumeData?.personalInfo?.role || "Software Engineer")}`,
            summary: professionalSummary,
            aboutMe: resumeData?.aboutMe || resumeData?.personalInfo?.customAboutMe || null, // Don't fallback to summary
            photoUrl: profile?.avatar_url || resumeData?.personalInfo?.photoUrl,
            location: profile?.location || resumeData?.personalInfo?.location,
            email: profile?.email || resumeData?.personalInfo?.email,
        },
        skills: {
            technical: resumeSkills.technical || githubLanguages.map(lang => ({ name: lang, level: 85 })),
            soft: resumeSkills.soft || ["Problem Solving", "Collaboration", "Communication"]
        },
        education: resumeData?.structuredData?.education || [],
        workExperience: resumeData?.structuredData?.experience || [],
        social: {
            github: profile?.html_url || `https://github.com/${username}`,
            linkedin: resumeData?.personalInfo?.contact?.split('|').find((s: string) => s.toLowerCase().includes('linkedin'))?.trim(),
            twitter: profile?.twitter_username ? `https://twitter.com/${profile.twitter_username}` : undefined,
            email: profile?.email || resumeData?.personalInfo?.email
        }
    };

    // Map Projects for FeatureWork
    const projects = topRepos.map(repo => ({
        title: repo.name,
        description: repo.description || "No description available.",
        tags: [repo.language, ...repo.topics].filter(Boolean),
        links: {
            repo: repo.html_url,
            demo: repo.homepage || undefined
        },
        featured: repo.stargazers_count > 5
    }));

    return (
        <ReactLenis root>
            <div className="min-h-screen bg-background relative font-sans antialiased text-foreground overflow-x-hidden selection:bg-pink-500/30">
                <StripedBackground />
                <Header />

                <main className="relative z-10 flex flex-col gap-20 pb-40">
                    <HeroSection userData={userData} />
                    <AboutSection userData={userData} />
                    <EducationSection userData={userData} />
                    <SkillsSection userData={userData} />
                    <CareerTimeline userData={userData} />

                    <CodingStats leetCode={leetCodeStats} codeforces={codeforcesStats} />
                    <ContributionActivity weeks={githubContributions || []} />

                    {projects.length > 0 && (
                        <FeaturedWork projects={projects} username={username} />
                    )}
                </main>

                {/* Share Button */}
                <div className="fixed top-4 right-4 z-50">
                    <ShareButton
                        portfolioUrl={`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/portfolio/${username}`}
                        userName={userData.personalInfo.name}
                        title={`Check out ${userData.personalInfo.name}'s portfolio!`}
                    />
                </div>

                <div className="fixed bottom-8 left-0 right-0 z-50 flex justify-center pointer-events-none">
                    <div className="pointer-events-auto">
                        <PortfolioDock email={userData.personalInfo.email} />
                    </div>
                </div>
            </div>
        </ReactLenis>
    );
}
