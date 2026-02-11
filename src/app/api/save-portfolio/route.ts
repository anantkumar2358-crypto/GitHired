
import { db } from "@/db";
import { users, resumeData, codingStats, projects } from "@/db/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const user = await currentUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { personalInfo, experience, education, skills, certifications, interests, aboutMe, githubUsername, leetcodeUsername, codeforcesUsername, portfolioName } = body;

        const email = user.emailAddresses[0]?.emailAddress;
        if (!email) {
            return NextResponse.json({ error: "No email found" }, { status: 400 });
        }

        // 1. Ensure User Exists
        let [dbUser] = await db.select().from(users).where(eq(users.email, email)).limit(1);

        if (!dbUser) {
            // Create user
            // We need a username. If body has githubUsername, use it. Else derive from email or Clerk.
            const username = githubUsername || user.username || email.split("@")[0] + "_" + Date.now();

            [dbUser] = await db.insert(users).values({
                username: username,
                email: email,
                avatarUrl: user.imageUrl,
                bio: aboutMe || personalInfo?.summary,
                location: personalInfo?.location,
                // Add github/leetcode usernames if we had columns in users table, 
                // but schema says `leetcodeStats` is in `codingStats`.
                // `users` has `githubUrl` but maybe we strictly use `projects` table for github?
                // Actually `users` has `githubUrl`.
                githubUrl: githubUsername ? `https://github.com/${githubUsername}` : undefined,
            }).returning();
        }

        // 2. Save Resume Data
        // Convert skills array of strings to string[]
        // ATS Checker returns structured resume.

        await db.insert(resumeData).values({
            userId: dbUser.id,
            name: portfolioName || `Portfolio - ${new Date().toLocaleDateString()}`,
            resumeText: JSON.stringify(body), // Store raw JSON if needed or mapped fields
            professionalSummary: personalInfo?.summary,
            skills: skills || [],
            experience: experience || [],
            education: education || [],
            certifications: certifications || [],
            aboutMe: aboutMe, // Custom about me or from resume
            interests: interests || [], // Assuming structured interests
            contactInfo: personalInfo?.contact,
        });

        // 3. Save Coding Stats (if provided)
        if (leetcodeUsername || codeforcesUsername) {
            // In a real app we might fetch stats here, but for now just saving usernames?
            // The schema `codingStats` has `leetcodeUsername`.
            // We should check if entry exists and update, or insert new.
            // But Wait, one user usually has one set of coding usernames.
            // So we should UPSERT based on userId.
            const [existingStats] = await db.select().from(codingStats).where(eq(codingStats.userId, dbUser.id)).limit(1);

            if (existingStats) {
                await db.update(codingStats).set({
                    leetcodeUsername: leetcodeUsername || existingStats.leetcodeUsername,
                    codeforcesUsername: codeforcesUsername || existingStats.codeforcesUsername,
                }).where(eq(codingStats.id, existingStats.id));
            } else {
                await db.insert(codingStats).values({
                    userId: dbUser.id,
                    leetcodeUsername: leetcodeUsername,
                    codeforcesUsername: codeforcesUsername,
                });
            }
        }

        return NextResponse.json({ success: true, message: "Portfolio saved successfully" });

    } catch (error: any) {
        console.error("Error saving portfolio:", error);
        return NextResponse.json({ error: error.message || "Failed to save portfolio" }, { status: 500 });
    }
}
