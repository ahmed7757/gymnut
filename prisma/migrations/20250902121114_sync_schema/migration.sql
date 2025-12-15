/*
  Warnings:

  - You are about to drop the column `duration` on the `Workout` table. All the data in the column will be lost.
  - You are about to drop the column `exercises` on the `Workout` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Workout` table. All the data in the column will be lost.
  - Added the required column `plan` to the `Workout` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Workout" DROP COLUMN "duration",
DROP COLUMN "exercises",
DROP COLUMN "type",
ADD COLUMN     "plan" JSONB NOT NULL;
