-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "location" TEXT NOT NULL DEFAULT 'Egypt';

-- AlterTable
ALTER TABLE "public"."Workout" ADD COLUMN     "method" TEXT;
