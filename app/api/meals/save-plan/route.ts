import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const { plan } = await req.json();

        if (!plan) {
            return NextResponse.json({ message: "Plan is required" }, { status: 400 });
        }

        const workoutPlan = await prisma.workout.create({
            data: {
                userId: session.user.id as string,
                plan: plan
            },
        });

        return NextResponse.json(workoutPlan, { status: 201 });
    } catch (error) {
        console.error("Save plan error:", error);
        return NextResponse.json({ message: "Failed to save plan" }, { status: 500 });
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
            });
            return NextResponse.json(plan, { status: 200 })
        }

        const plans = await prisma.workout.findMany({
            where: { userId: session.user.id },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(plans, { status: 200 });
    } catch (error) {
        console.error("Fetch saved plans error:", error);
        return NextResponse.json({ message: "Failed to fetch plans" }, { status: 500 });
    }
}