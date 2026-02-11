import { NextResponse } from "next/server";
import { db } from "@/db";
import { resumeData } from "@/db/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

export async function PATCH(req: Request) {
    try {
        const user = await currentUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { portfolioId, newName } = await req.json();

        if (!portfolioId || !newName?.trim()) {
            return NextResponse.json({ error: "Portfolio ID and new name are required" }, { status: 400 });
        }

        // Update the portfolio name
        await db
            .update(resumeData)
            .set({
                name: newName.trim(),
                updatedAt: new Date()
            })
            .where(eq(resumeData.id, portfolioId));

        return NextResponse.json({ success: true, message: "Portfolio renamed successfully" });
    } catch (error: any) {
        console.error("Error renaming portfolio:", error);
        return NextResponse.json({ error: error.message || "Failed to rename portfolio" }, { status: 500 });
    }
}
