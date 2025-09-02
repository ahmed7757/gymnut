import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
export async function POST(req: NextRequest) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const data = await req.json();

        const meal = await prisma.mealLog.create({
            data: {
                userId: session.user.id as string,
                foodName: String(data.foodName),
                foodImage: data.image ? String(data.image) : undefined,
                category: data.category ?? "LUNCH", // requires enum in schema
                quantity: data.quantity !== undefined ? Number(data.quantity) : null,
                portion: data.portion ? String(data.portion) : undefined,

                calories: Number(data.calories),
                protein: Number(data.protein),
                carbs: Number(data.carbs),
                fat: Number(data.fat),
                fiber: data.fiber !== undefined ? Number(data.fiber) : null,
                sugar: data.sugar !== undefined ? Number(data.sugar) : null,
                sodium: data.sodium !== undefined ? Number(data.sodium) : null,

                foodData: data.foodData ?? {}, // raw API snapshot
            },
        });

        return NextResponse.json(meal, { status: 201 });
    } catch (error) {
        console.error("Meal log error:", error);
        return NextResponse.json({ message: "Failed to log meal" }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        // Optional: add date filter (?date=YYYY-MM-DD)
        const { searchParams } = new URL(req.url);
        const dateFilter = searchParams.get("date"); // e.g. "2024-06-01"

        let meals;

        if (dateFilter) {
            const start = new Date(dateFilter);
            const end = new Date(dateFilter);
            end.setHours(23, 59, 59, 999);

            meals = await prisma.mealLog.findMany({
                where: {
                    userId: session.user.id,
                    loggedAt: {
                        gte: start,
                        lte: end,
                    },
                },
                orderBy: { loggedAt: "desc" },
            });
        } else {
            // return last 20 meals by default
            meals = await prisma.mealLog.findMany({
                where: { userId: session.user.id },
                orderBy: { loggedAt: "desc" },
                take: 20,
            });
        }

        return NextResponse.json(meals, { status: 200 });
    } catch (error) {
        console.error("Fetch meals error:", error);
        return NextResponse.json({ message: "Failed to fetch meals" }, { status: 500 });
    }
}