import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { GoogleGenAI, Type } from "@google/genai";

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

export async function generateWorkoutPlan(req: NextRequest) {
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

        let fitnessLevel = "beginner";
        let workoutDays = 5;
        let method = "Push/Pull/Legs (PPL) Split";
        try {
            const body = await req.json();
            if (body && typeof body === "object") {
                if (typeof body.fitnessLevel === "string") fitnessLevel = body.fitnessLevel;
                if (typeof body.workoutDays === "number") workoutDays = body.workoutDays;
                if (typeof body.method === "string") method = body.method;
            }
        } catch { }

        const prompt = `
You are an AI personal trainer and certified sports nutritionist. Your goal is to generate a comprehensive, personalized workout and nutritional plan.

### Instructions
1.  **Analyze the User Profile and Constraints:** Carefully review the user's details, including their age, gender, location, and specific goals. Note any health conditions or limitations.
2.  **Generate a Workout Plan:** Create a ${workoutDays}-day workout plan based on the user's fitness level, preferred method, and goals. Each day should include warm-ups, exercises with sets/reps/duration, and cool-downs.
3.  **Generate a Nutritional Guidance:** Provide a short nutritional guidance section (3-5 sentences) tailored to the user's goals and regional context (e.g., local food availability in Egypt). Do not provide a full meal plan; offer general advice on macronutrients, hydration, and common foods.
4.  **Prioritize Safety:** Ensure all recommendations are safe and appropriate for the user's stated diseases or conditions. If a plan is not feasible due to a condition, state this clearly.
5.  **Strict Output Format:** The entire response MUST be a single, valid JSON object. Do not include any text, markdown, or commentary outside of the JSON. The JSON structure is strictly defined by the provided schema.

### User Profile
- Age: ${user.age ?? "unknown"}
- Gender: ${user.gender ?? "unknown"}
- Height: ${user.height ?? "unknown"} cm
- Weight: ${user.weight ?? "unknown"} kg
- Goal: ${user.goal}
- Preferred method: ${method}
- Diseases/conditions: ${user.diseases.length > 0 ? user.diseases.join(", ") : "none"}
- Fitness Level: ${fitnessLevel}
- **Location/Culture:** ${user.location ?? "global"}

### Output Schema
${JSON.stringify({
            plan: [
                {
                    day: "Monday",
                    type: "Push",
                    duration: 60,
                    exercises: [
                        {
                            name: "Example Exercise",
                            sets: 3,
                            reps: 10,
                            duration: ""
                        }
                    ],
                    warmup: "Example warm-up routine.",
                    cooldown: "Example cool-down routine."
                }
            ],
            nutritionalGuidance: "Tailored nutritional advice."
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
                                    plan: {
                                        type: Type.ARRAY,
                                        items: {
                                            type: Type.OBJECT,
                                            properties: {
                                                day: { type: Type.STRING },
                                                type: { type: Type.STRING },
                                                duration: { type: Type.NUMBER },
                                                exercises: {
                                                    type: Type.ARRAY,
                                                    items: {
                                                        type: Type.OBJECT,
                                                        properties: {
                                                            name: { type: Type.STRING },
                                                            sets: { type: Type.NUMBER },
                                                            reps: { type: Type.NUMBER },
                                                            duration: { type: Type.STRING },
                                                        },
                                                    },
                                                },
                                            },
                                            required: ["day", "type", "duration", "exercises"],
                                        },
                                    },
                                },
                                required: ["plan"],
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
        const workoutPlan = parsed ?? (text ? JSON.parse(text) : null);

        if (!workoutPlan || !Array.isArray(workoutPlan.plan) || workoutPlan.plan.length === 0) {
            return NextResponse.json(
                { message: "AI returned empty/invalid plan", raw: text },
                { status: 500 }
            );
        }

        return NextResponse.json(workoutPlan, { status: 200 });
    } catch (error) {
        console.error("AI Workout Plan error:", error);
        return NextResponse.json(
            { message: "Failed to generate workout plan" },
            { status: 500 }
        );
    }
}

export async function getWorkoutPlanMethodInfo() {
    return NextResponse.json(
        {
            message:
                "This endpoint only supports POST requests for generating workout plans. Use POST with your fitness preferences to generate a personalized workout plan.",
        },
        { status: 405 }
    );
}

export async function saveWorkoutPlan(req: NextRequest) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { fitnessLevel, workoutDays } = body || {};

        let normalizedPlan: any | null = null;
        if (Array.isArray(body?.plan)) {
            normalizedPlan = { plan: body.plan };
        } else if (body?.plan && Array.isArray(body.plan.plan)) {
            normalizedPlan = body.plan;
        }

        if (!normalizedPlan || !Array.isArray(normalizedPlan.plan)) {
            return NextResponse.json({ message: "Valid workout plan is required" }, { status: 400 });
        }

        const workoutPlan = await prisma.workout.create({
            data: {
                userId: session.user.id as string,
                method: "Push/Pull/Legs (PPL) Split", // or set this dynamically if needed
                plan: {
                    ...normalizedPlan,
                    metadata: {
                        fitnessLevel: fitnessLevel || "beginner",
                        workoutDays: workoutDays || normalizedPlan.plan.length,
                        generatedAt: new Date().toISOString(),
                    },
                },
            },
        });

        return NextResponse.json(
            { message: "Workout plan saved successfully", plan: workoutPlan },
            { status: 201 }
        );
    } catch (error) {
        console.error("Save workout plan error:", error);
        return NextResponse.json({ message: "Failed to save workout plan" }, { status: 500 });
    }
}

export async function getSavedWorkoutPlans(req: NextRequest) {
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
                select: { id: true, plan: true, createdAt: true, updatedAt: true },
            });

            if (!plan) {
                return NextResponse.json({ message: "No workout plans found" }, { status: 404 });
            }

            return NextResponse.json(plan, { status: 200 });
        }

        const plans = await prisma.workout.findMany({
            where: { userId: session.user.id },
            orderBy: { createdAt: "desc" },
            select: { id: true, plan: true, createdAt: true, updatedAt: true },
        });

        return NextResponse.json(plans, { status: 200 });
    } catch (error) {
        console.error("Fetch saved workout plans error:", error);
        return NextResponse.json({ message: "Failed to fetch workout plans" }, { status: 500 });
    }
}


