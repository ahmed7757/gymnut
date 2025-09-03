import prisma from "@/lib/prisma";
import { auth } from "@/auth"; // corrected import
import { NextRequest, NextResponse } from "next/server";
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

        // Safely parse optional JSON body
        let fitnessLevel = "beginner";
        let workoutDays = 5;
        try {
            const body = await req.json();
            if (body && typeof body === "object") {
                if (typeof body.fitnessLevel === "string") fitnessLevel = body.fitnessLevel;
                if (typeof body.workoutDays === "number") workoutDays = body.workoutDays;
            }
        } catch {
            // ignore body parse errors and use defaults
        }

        // Build the AI prompt
        const prompt = `
You are an AI personal trainer. Generate a personalized ${workoutDays}-day workout plan for a user.

User Profile:
- Age: ${user.age ?? "unknown"}
- Gender: ${user.gender ?? "unknown"}
- Height: ${user.height ?? "unknown"} cm
- Weight: ${user.weight ?? "unknown"} kg
- Goal: ${user.goal}
- Diseases/conditions: ${user.diseases.length > 0 ? user.diseases.join(", ") : "none"}
- Fitness Level: ${fitnessLevel}

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
        console.error("AI Workout Plan error:", error);
        return NextResponse.json(
            { message: "Failed to generate workout plan" },
            { status: 500 }
        );
    }
}