import { NextResponse } from "next/server";
import { db } from "@/db";
import { users, resumeData } from "@/db/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq, desc } from "drizzle-orm";

export async function GET() {
    try {
        const user = await currentUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const email = user.emailAddresses[0]?.emailAddress;
        if (!email) {
            return NextResponse.json({ error: "No email found" }, { status: 400 });
        }

        // Find user in DB
        const [dbUser] = await db
            .select()
            .from(users)
            .where(eq(users.email, email))
            .limit(1);

        if (!dbUser) {
            return NextResponse.json({ success: true, portfolios: [], username: null });
        }

        // Fetch all portfolios for this user
        const portfolios = await db
            .select()
            .from(resumeData)
            .where(eq(resumeData.userId, dbUser.id))
            .orderBy(desc(resumeData.createdAt));

        return NextResponse.json({
            success: true,
            portfolios,
            username: dbUser.username
        });
    } catch (error: any) {
        console.error("Error fetching portfolios:", error);
        return NextResponse.json({ error: error.message || "Failed to fetch portfolios" }, { status: 500 });
    }
}
