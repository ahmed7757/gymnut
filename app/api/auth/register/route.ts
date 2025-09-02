import { signSchema } from "@/lib/zod";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { hashPassword } from "@/utils/password";
import { Gender } from "@prisma/client";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const parsed = signSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({ message: "Invalid input", errors: parsed.error.issues }, { status: 400 });
        }
        const { email, password, name, gender } = parsed.data;

        // Check if user already exists
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            return NextResponse.json({ message: "Email already registered" }, { status: 400 });
        }

        // Hash password
        const hashedPassword = await hashPassword(password);

        // Create user
        await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                gender: Gender.MALE || Gender.FEMALE,
            },
        });

        return NextResponse.json({ message: "Registration successful" }, { status: 201 });
    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}
