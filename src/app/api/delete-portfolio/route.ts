import { NextResponse } from "next/server";
import { db } from "@/db";
import { resumeData } from "@/db/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

export async function DELETE(req: Request) {
    try {
        const user = await currentUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { portfolioId } = await req.json();

        if (!portfolioId) {
            return NextResponse.json({ error: "Portfolio ID is required" }, { status: 400 });
        }

        // Delete the portfolio
        await db
            .delete(resumeData)
            .where(eq(resumeData.id, portfolioId));

        return NextResponse.json({ success: true, message: "Portfolio deleted successfully" });
    } catch (error: any) {
        console.error("Error deleting portfolio:", error);
        return NextResponse.json({ error: error.message || "Failed to delete portfolio" }, { status: 500 });
    }
}
