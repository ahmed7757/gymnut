import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { MealService } from "@/lib/database";

export async function logMeal(req: NextRequest) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    try {
        const data = await req.json();

        const meal = await MealService.create(session.user.id as string, {
            foodName: String(data.foodName),
            foodImage: data.image ? String(data.image) : undefined,
            category: data.category ?? "LUNCH",
            quantity: data.quantity !== undefined ? Number(data.quantity) : null,
            portion: data.portion ? String(data.portion) : undefined,
            calories: Number(data.calories),
            protein: Number(data.protein),
            carbs: Number(data.carbs),
            fat: Number(data.fat),
            fiber: data.fiber !== undefined ? Number(data.fiber) : null,
            sugar: data.sugar !== undefined ? Number(data.sugar) : null,
            sodium: data.sodium !== undefined ? Number(data.sodium) : null,
            foodData: data.foodData ?? {},
        });

        return NextResponse.json(meal, { status: 201 });
    } catch (error) {
        console.error("Meal log error:", error);
        return NextResponse.json({ message: "Failed to log meal" }, { status: 500 });
    }
}

export async function getMeals(req: NextRequest) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(req.url);
        const dateFilter = searchParams.get("date");

        const meals = await MealService.findByUser(session.user.id, {
            date: dateFilter ?? undefined,
            limit: 20,
        });

        return NextResponse.json(meals, { status: 200 });
    } catch (error) {
        console.error("Fetch meals error:", error);
        return NextResponse.json({ message: "Failed to fetch meals" }, { status: 500 });
    }
}


