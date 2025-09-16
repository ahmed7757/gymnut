import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { MealService } from "@/lib/database";
import prisma from "@/lib/prisma";
import { GoogleGenAI, Type } from "@google/genai";
import { withRateLimit, rateLimiters } from "@/lib/rateLimiter";
import { withCache, caches, cacheKeys, invalidateUserCache } from "@/lib/cache";
import { sanitizeRequest, sanitizationSchemas } from "@/lib/sanitization";

export async function logMeal(req: NextRequest) {
    return withRateLimit(req, rateLimiters.general, async () => {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        try {
            // Sanitize input data
            const data = await sanitizeRequest(req, sanitizationSchemas.mealLog);

            // Explicitly type 'data' to fix 'unknown' type error
            const {
                foodName,
                foodImage,
                category,
                quantity,
                portion,
                calories,
                protein,
                carbs,
                fat,
                fiber,
                sugar,
                sodium,
                foodData,
                foodBrand,
            } = data as {
                foodName: string;
                foodImage?: string;
                category?: string;
                quantity: number;
                portion: string;
                calories: number;
                protein: number;
                carbs: number;
                fat: number;
                fiber: number;
                sugar: number;
                sodium: number;
                foodData: Record<string, any>;
                foodBrand: string;
            };

            const meal = await MealService.create(session.user.id as string, {
                foodName,
                foodImage,
                category: category ?? "LUNCH",
                quantity,
                portion,
                calories,
                protein,
                carbs,
                fat,
                fiber,
                sugar,
                sodium,
                foodData: foodData ?? {},
                foodBrand: foodBrand ?? "",
            });

            // Invalidate user cache
            invalidateUserCache(session.user.id as string);

            return NextResponse.json(meal, { status: 201 });
        } catch (error) {
            console.error("Meal log error:", error);
            if (error instanceof Error && error.message.includes('Invalid input')) {
                return NextResponse.json({ message: error.message }, { status: 400 });
            }
            return NextResponse.json({ message: "Failed to log meal" }, { status: 500 });
        }
    });
}

export async function getMeals(req: NextRequest) {
    return withRateLimit(req, rateLimiters.general, async () => {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        try {
            const { searchParams } = new URL(req.url);
            const dateFilter = searchParams.get("date");

            // Create cache key
            const cacheKey = cacheKeys.userMeals(session.user.id as string, dateFilter || undefined);

            // Try to get from cache first
            const meals = await withCache(
                caches.user,
                cacheKey,
                () => MealService.findByUser(session?.user?.id as string, {
                    date: dateFilter ?? undefined,
                    limit: 20,
                }),
                5 * 60 * 1000 // 5 minutes cache
            );

            return NextResponse.json(meals, { status: 200 });
        } catch (error) {
            console.error("Fetch meals error:", error);
            return NextResponse.json({ message: "Failed to fetch meals" }, { status: 500 });
        }
    });
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
    return withRateLimit(req, rateLimiters.ai, async () => {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        try {
            // Sanitize input
            const body = await sanitizeRequest(req, {
                dietType: { type: 'string', options: { maxLength: 50, allowSpecialChars: false } },
                mealDays: { type: 'number', options: { min: 1, max: 30, allowFloat: false } }
            }) as { dietType?: string; mealDays?: number };

            const dietType = body.dietType || "balanced";
            const mealDays = body.mealDays || 7;

            // Create cache key
            const cacheKey = cacheKeys.mealPlan(session.user.id as string, dietType, mealDays);

            // Try to get from cache first
            const mealPlan = await withCache(
                caches.ai,
                cacheKey,
                async () => {
                    const user = await prisma.user.findUnique({
                        where: { id: session?.user?.id as string },
                    });

                    if (!user) {
                        throw new Error("User not found");
                    }

                    const prompt = `
You are an expert AI nutritionist. Your task is to create a detailed, personalized meal plan for a user.

### Instructions & Persona
1.  **Act as a Certified Nutritionist:** Provide advice that is science-backed and safe. Your recommendations should be based on established guidelines from authoritative sources like the WHO, USDA, and Mayo Clinic, tailored for the user's profile.
2.  **Prioritize Cultural and Regional Relevance:** Generate a plan that uses ingredients and dishes common to the user's location. For an Egyptian user, use ingredients like ful medames, koshari, or molokhia. For other locations, select common local foods.
3.  **Tailor the Plan:**
    * **Goal:** Adjust calories and macronutrient ratios (protein, carbs, fat) based on the user's goal (e.g., calorie deficit for weight loss, surplus for muscle gain).
    * **Health:** Strictly adhere to dietary restrictions related to the user's stated diseases/conditions.
4.  **Structure the Day:** Each day must include three main meals (breakfast, lunch, dinner) and two snacks.
5.  **Output Structure:** The entire response must be a single, valid JSON object. Do not include any commentary or extra text outside the JSON.

### User Profile
- Age: ${user.age ?? "unknown"}
- Gender: ${user.gender ?? "unknown"}
- Height: ${user.height ?? "unknown"} cm
- Weight: ${user.weight ?? "unknown"} kg
- Goal: ${user.goal}
- Diseases/Conditions: ${user.diseases.length > 0 ? user.diseases.join(", ") : "none"}
- Preferred Diet Type: ${dietType}
- **Location/Culture:** ${user.location ?? "global"}

### Output Schema
${JSON.stringify({
                        mealPlan: [
                            {
                                day: "Sunday",
                                meals: [
                                    {
                                        type: "Breakfast",
                                        name: "Example Egyptian Breakfast: Ful Medames",
                                        description: "A classic Egyptian dish of slow-cooked fava beans with olive oil, lemon, and spices. Served with whole-wheat bread.",
                                        calories: 450,
                                        protein: 20,
                                        carbs: 60,
                                        fat: 15
                                    },
                                    {
                                        type: "Snack 1",
                                        name: "Greek Yogurt with Dates",
                                        description: "High-protein yogurt with natural sweetness and fiber from dates.",
                                        calories: 180,
                                        protein: 15,
                                        carbs: 25,
                                        fat: 3
                                    },
                                    {
                                        type: "Lunch",
                                        name: "Grilled Chicken Salad",
                                        description: "Grilled chicken breast on a bed of mixed greens with tomatoes, cucumber, and a light vinaigrette.",
                                        calories: 500,
                                        protein: 40,
                                        carbs: 20,
                                        fat: 25
                                    },
                                    {
                                        type: "Snack 2",
                                        name: "Apple Slices with Peanut Butter",
                                        description: "A quick and balanced snack of fruit and healthy fats.",
                                        calories: 220,
                                        protein: 8,
                                        carbs: 20,
                                        fat: 12
                                    },
                                    {
                                        type: "Dinner",
                                        name: "Salmon with Roasted Vegetables",
                                        description: "Baked salmon filet served with roasted broccoli and sweet potato.",
                                        calories: 600,
                                        protein: 35,
                                        carbs: 45,
                                        fat: 30
                                    }
                                ]
                            }
                        ]
                    }, null, 2)}
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

                    return mealPlan;
                },
                60 * 60 * 1000 // 1 hour cache
            );

            return NextResponse.json(mealPlan, { status: 200 });
        } catch (error) {
            console.error("AI meal Plan error:", error);
            if (error instanceof Error && error.message.includes('Invalid input')) {
                return NextResponse.json({ message: error.message }, { status: 400 });
            }
            return NextResponse.json(
                { message: "Failed to generate meal plan" },
                { status: 500 }
            );
        }
    });
}


