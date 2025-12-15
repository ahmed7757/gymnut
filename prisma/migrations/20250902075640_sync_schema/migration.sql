/*
  Warnings:

  - Added the required column `foodName` to the `MealLog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."MealLog" ADD COLUMN     "fiber" DOUBLE PRECISION,
ADD COLUMN     "foodBrand" TEXT,
ADD COLUMN     "foodImage" TEXT,
ADD COLUMN     "foodName" TEXT NOT NULL,
ADD COLUMN     "portion" TEXT,
ADD COLUMN     "sodium" DOUBLE PRECISION,
ADD COLUMN     "sugar" DOUBLE PRECISION,
ALTER COLUMN "quantity" DROP NOT NULL;
