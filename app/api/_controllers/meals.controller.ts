import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { MealService } from "@/lib/database";
import prisma from "@/lib/prisma";
import { GoogleGenAI, Type } from "@google/genai";

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


const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
const PRIMARY_MODEL = "gemini-2.5-flash";
const FALLBACK_MODEL = "gemini-2.5-flash-lite";

async function callWithRetry(fn: () => Promise<any>, retries = 3, baseDelayMs = 1000) {
    let lastErr: any;
    for (let i = 0; i < retries; i++) {
        try {
            return await fn();
        } catch (e: any) {
            lastErr = e;
            const status = e?.response?.status || e?.status;
            if (status !== 503 && status !== 429) break;
            const delay = baseDelayMs * Math.pow(2, i);
            await new Promise((r) => setTimeout(r, delay));
        }
    }
    throw lastErr;
}

export async function generateMealPlan(req: NextRequest) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: session.user.id as string },
        });

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        let dietType = "balanced";
        let mealDays = 7;
        try {
            const body = await req.json();
            if (body && typeof body === "object") {
                if (typeof body.dietType === "string") dietType = body.dietType;
                if (typeof body.mealDays === "number") mealDays = body.mealDays;
            }
        } catch { }

        const prompt = `
You are an AI nutritionist. Create a personalized ${mealDays}-day meal plan for the user.

User Profile:
- Age: ${user.age ?? "unknown"}
- Gender: ${user.gender ?? "unknown"}
- Height: ${user.height ?? "unknown"} cm
- Weight: ${user.weight ?? "unknown"} kg
- Goal: ${user.goal}
- Diseases/Conditions: ${user.diseases.length > 0 ? user.diseases.join(", ") : "none"}
- Preferred Diet Type: ${dietType}

Meal Plan Requirements:
- Suggest 3 meals + 2 snacks per day.
- Provide calories (approx) and macros (protein, carbs, fat) for each meal.
- If goal is weight loss → lower-calorie meals, increase lean protein.
- If goal is muscle gain → calorie surplus, more protein-rich meals.
- If user has conditions (e.g., diabetes), tailor advice safely.
- Include healthy, common ingredients.

Requirements:
- Output MUST be valid JSON only. No markdown fences or commentary.
- Follow this structure strictly.
`;

        async function generate(model: string) {
            return await callWithRetry(
                () =>
                    ai.models.generateContent({
                        model,
                        contents: [{ role: "user", parts: [{ text: prompt }] }],
                        config: {
                            responseMimeType: "application/json",
                            responseSchema: {
                                type: Type.OBJECT,
                                properties: {
                                    mealPlan: {
                                        type: Type.ARRAY,
                                        items: {
                                            type: Type.OBJECT,
                                            properties: {
                                                day: { type: Type.STRING },
                                                type: { type: Type.STRING },
                                                meals: {
                                                    type: Type.ARRAY,
                                                    items: {
                                                        type: Type.OBJECT,
                                                        properties: {
                                                            type: { type: Type.STRING },
                                                            name: { type: Type.STRING },
                                                            calories: { type: Type.NUMBER },
                                                            protein: { type: Type.NUMBER },
                                                            carbs: { type: Type.NUMBER },
                                                            fat: { type: Type.NUMBER },
                                                        },
                                                        required: ["type", "name", "calories", "protein", "carbs", "fat"],
                                                    },
                                                },
                                            },
                                            required: ["day", "meals"],
                                        },
                                    },
                                },
                                required: ["mealPlan"],
                            },
                        },
                    }),
                3,
                1000
            );
        }

        let response;
        try {
            response = await generate(PRIMARY_MODEL);
        } catch (e: any) {
            const status = e?.response?.status || e?.status;
            if (status === 503 || status === 429) {
                response = await generate(FALLBACK_MODEL);
            } else {
                throw e;
            }
        }

        const parsed = (response as any).parsed;
        const text = response.text || "";
        const mealPlan = parsed ?? (text ? JSON.parse(text) : null);

        if (!mealPlan || !Array.isArray(mealPlan.mealPlan) || mealPlan.mealPlan.length === 0) {
            return NextResponse.json(
                { message: "AI returned empty/invalid plan", raw: text },
                { status: 500 }
            );
        }

        return NextResponse.json(mealPlan, { status: 200 });
    } catch (error) {
        console.error("AI meal Plan error:", error);
        return NextResponse.json(
            { message: "Failed to generate meal plan" },
            { status: 500 }
        );
    }
}


