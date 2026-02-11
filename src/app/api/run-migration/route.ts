import { NextResponse } from "next/server";
import { db } from "@/db";
import { sql } from "drizzle-orm";

export async function GET() {
    try {
        // Add name column to resume_data table
        await db.execute(sql`ALTER TABLE "resume_data" ADD COLUMN IF NOT EXISTS "name" varchar(255)`);

        return NextResponse.json({
            success: true,
            message: "Migration completed successfully. Added 'name' column to resume_data table."
        });
    } catch (error: any) {
        console.error("Migration error:", error);
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}
