import { NextResponse } from "next/server";
import { getLeetCodeStats, getCodeforcesStats } from "@/lib/coding-platforms";
import { getGitHubContributions } from "@/lib/github";

export async function POST(req: Request) {
    try {
        const { leetcodeUsername, codeforcesUsername, githubUsername } = await req.json();

        // Fetch all stats in parallel
        const [leetCodeStats, codeforcesStats, githubContributions] = await Promise.all([
            leetcodeUsername ? getLeetCodeStats(leetcodeUsername) : null,
            codeforcesUsername ? getCodeforcesStats(codeforcesUsername) : null,
            githubUsername ? getGitHubContributions(githubUsername) : null,
        ]);

        return NextResponse.json({
            leetCodeStats,
            codeforcesStats,
            githubContributions,
        });

    } catch (error: any) {
        console.error("Error fetching stats:", error);
        return NextResponse.json({ error: error.message || "Failed to fetch stats" }, { status: 500 });
    }
}
