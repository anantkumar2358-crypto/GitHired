-- Add name column to resume_data table
ALTER TABLE "resume_data" ADD COLUMN IF NOT EXISTS "name" varchar(255);
