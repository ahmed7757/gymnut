import prisma from "@/lib/prisma";
import { auth } from "@/auth"; // corrected import
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
const MODEL = "gemini-2.5-flash";

export async function POST(req: NextRequest) {
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

        const { fitnessGoal = "LOSE", dietType = "balanced", mealDays = 7 } = await req.json();
        // Build the AI prompt
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
}`;

        // Call Gemini with structured output
        const response = await ai.models.generateContent({
            model: MODEL,
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
                                                type: { type: Type.STRING },       // Breakfast, Lunch, Snack, etc.
                                                name: { type: Type.STRING },       // Meal name
                                                calories: { type: Type.NUMBER },   // approx calories
                                                protein: { type: Type.NUMBER },    // grams
                                                carbs: { type: Type.NUMBER },      // grams
                                                fat: { type: Type.NUMBER },        // grams
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
        });

        // Prefer parsed; fallback to text
        const parsed = (response as any).parsed;
        const text = response.text || "";
        const workoutPlan = parsed ?? (text ? JSON.parse(text) : null);

        if (!workoutPlan || !Array.isArray(workoutPlan.plan) || workoutPlan.plan.length === 0) {
            return NextResponse.json(
                { message: "AI returned empty/invalid plan", raw: text },
                { status: 500 }
            );
        }

        return NextResponse.json(workoutPlan, { status: 200 });
    } catch (error) {
        console.error("AI meal Plan error:", error);
        return NextResponse.json(
            { message: "Failed to generate meal plan" },
            { status: 500 }
        );
    }
}