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

        // Optional preferences from client
        const { fitnessLevel = "beginner", workoutDays = 5 } = await req.json();

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

        // Call Gemini with structured output
        const response = await ai.models.generateContent({
            model: MODEL,
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
        console.error("AI Workout Plan error:", error);
        return NextResponse.json(
            { message: "Failed to generate workout plan" },
            { status: 500 }
        );
    }
}