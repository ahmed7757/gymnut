import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const { plan, dietType, mealDays } = await req.json();

        if (!plan || !Array.isArray(plan.mealPlan)) {
            return NextResponse.json({ message: "Valid meal plan is required" }, { status: 400 });
        }

        const mealPlan = await prisma.mealPlan.create({
            data: {
                userId: session.user.id as string,
                plan: {
                    ...plan,
                    metadata: {
                        dietType: dietType || "balanced",
                        mealDays: mealDays || plan.mealPlan.length,
                        generatedAt: new Date().toISOString()
                    }
                }
            },
        });

        return NextResponse.json({ 
            message: "Meal plan saved successfully",
            plan: mealPlan 
        }, { status: 201 });
    } catch (error) {
        console.error("Save meal plan error:", error);
        return NextResponse.json({ message: "Failed to save meal plan" }, { status: 500 });
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
            const plan = await prisma.mealPlan.findFirst({
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
                return NextResponse.json({ message: "No meal plans found" }, { status: 404 });
            }
            
            return NextResponse.json(plan, { status: 200 });
        }

        const plans = await prisma.mealPlan.findMany({
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
        console.error("Fetch saved meal plans error:", error);
        return NextResponse.json({ message: "Failed to fetch meal plans" }, { status: 500 });
    }
}