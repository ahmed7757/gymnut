-- CreateEnum
CREATE TYPE "public"."Goal" AS ENUM ('LOSE', 'MAINTAIN', 'GAIN');

-- CreateEnum
CREATE TYPE "public"."Disease" AS ENUM ('DIABETES', 'HYPERTENSION', 'HEART_DISEASE', 'ASTHMA', 'NONE');

-- CreateEnum
CREATE TYPE "public"."MealCategory" AS ENUM ('BREAKFAST', 'LUNCH', 'DINNER', 'SNACK');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "height" DOUBLE PRECISION,
    "weight" DOUBLE PRECISION,
    "goal" "public"."Goal" NOT NULL DEFAULT 'MAINTAIN',
    "diseases" "public"."Disease"[] DEFAULT ARRAY['NONE']::"public"."Disease"[],
    "age" INTEGER,
    "profilePicture" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MealLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "foodData" JSONB NOT NULL,
    "category" "public"."MealCategory" NOT NULL DEFAULT 'LUNCH',
    "quantity" DOUBLE PRECISION NOT NULL,
    "calories" DOUBLE PRECISION NOT NULL,
    "protein" DOUBLE PRECISION NOT NULL,
    "carbs" DOUBLE PRECISION NOT NULL,
    "fat" DOUBLE PRECISION NOT NULL,
    "loggedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "MealLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Workout" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "exercises" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Workout_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE INDEX "MealLog_userId_loggedAt_idx" ON "public"."MealLog"("userId", "loggedAt");

-- CreateIndex
CREATE INDEX "Workout_userId_createdAt_idx" ON "public"."Workout"("userId", "createdAt");

-- AddForeignKey
ALTER TABLE "public"."MealLog" ADD CONSTRAINT "MealLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Workout" ADD CONSTRAINT "Workout_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
