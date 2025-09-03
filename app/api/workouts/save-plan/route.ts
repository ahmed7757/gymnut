import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const { plan, fitnessLevel, workoutDays } = await req.json();

        if (!plan || !Array.isArray(plan.plan)) {
            return NextResponse.json({ message: "Valid workout plan is required" }, { status: 400 });
        }

        const workoutPlan = await prisma.workout.create({
            data: {
                userId: session.user.id as string,
                plan: {
                    ...plan,
                    metadata: {
                        fitnessLevel: fitnessLevel || "beginner",
                        workoutDays: workoutDays || plan.plan.length,
                        generatedAt: new Date().toISOString()
                    }
                }
            },
        });

        return NextResponse.json({
            message: "Workout plan saved successfully",
            plan: workoutPlan
        }, { status: 201 });
    } catch (error) {
        console.error("Save workout plan error:", error);
        return NextResponse.json({ message: "Failed to save workout plan" }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(req.url);
        const latest = searchParams.get("latest");

        if (latest) {
            const plan = await prisma.workout.findFirst({
                where: { userId: session.user.id },
                orderBy: { createdAt: "desc" },
                select: {
                    id: true,
                    plan: true,
                    createdAt: true,
                    updatedAt: true
                }
            });

            if (!plan) {
                return NextResponse.json({ message: "No workout plans found" }, { status: 404 });
            }

            return NextResponse.json(plan, { status: 200 });
        }

        const plans = await prisma.workout.findMany({
            where: { userId: session.user.id },
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                plan: true,
                createdAt: true,
                updatedAt: true
            }
        });

        return NextResponse.json(plans, { status: 200 });
    } catch (error) {
        console.error("Fetch saved workout plans error:", error);
        return NextResponse.json({ message: "Failed to fetch workout plans" }, { status: 500 });
    }
}