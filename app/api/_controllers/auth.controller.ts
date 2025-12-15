import { NextRequest, NextResponse } from "next/server";
import { registerSchema } from "@/lib/schemas";
import { hashPassword } from "@/utils/password";
import { Gender } from "@prisma/client";
import {
    createApiResponse,
    createErrorResponse,
    createValidationErrorResponse,
    createNotFoundResponse,
} from "@/lib/api";
import { UserService } from "@/lib/database";
import { TokenService } from "@/lib/services/tokens";
import { EmailService } from "@/lib/services/email";

export async function handleRegister(req: NextRequest) {
    try {
        const body = await req.json();
        const parsed = registerSchema.safeParse(body);

        if (!parsed.success) {
            return createValidationErrorResponse(
                parsed.error.issues,
                "Invalid input data"
            );
        }

        const { email, password, name, gender, age, height, weight, goal, diseases } = parsed.data;

        const hashedPassword = await hashPassword(password);

        const user = await UserService.create({
            email,
            password: hashedPassword,
            name,
            gender: gender as Gender,
            age,
            height,
            weight,
            goal,
            diseases,
        });

        return createApiResponse(user, "Registration successful", 201);
    } catch (error) {
        return createErrorResponse(error);
    }
}

export async function handleForgotPassword(req: NextRequest) {
    try {
        const body = await req.json();
        if (!body.email) {
            return createValidationErrorResponse(
                [{ field: "email", message: "Email is required" }],
                "Email is required"
            );
        }

        const user = await UserService.findByEmail(body.email);
        if (!user) {
            return createNotFoundResponse("User not found");
        }

        const resetToken = TokenService.createResetToken(user.id, 3600);
        const expiresAt = new Date(Date.now() + 1000 * 60 * 60);
        await UserService.updateResetToken(body.email, resetToken, expiresAt);

        const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${encodeURIComponent(
            resetToken
        )}`;

        await EmailService.sendResetPasswordEmail(user.email, resetUrl);

        return createApiResponse({ email: user.email }, "Password reset email sent successfully");
    } catch (error) {
        return createErrorResponse(error);
    }
}

export async function handleResetPassword(req: NextRequest) {
    try {
        const body = await req.json();
        const { token, newPassword } = body;
        if (!token || !newPassword) {
            return NextResponse.json(
                { message: "Token and new password are required", success: false },
                { status: 400 }
            );
        }
        let decoded: { userId: string };
        try {
            decoded = TokenService.verifyToken<{ userId: string }>(token);
        } catch {
            return NextResponse.json(
                { message: "Invalid or expired reset token", success: false },
                { status: 400 }
            );
        }

        const user = await UserService.findById(decoded.userId).catch(() => null);
        if (!user) {
            return NextResponse.json(
                { message: "Invalid or expired reset token", success: false },
                { status: 400 }
            );
        }

        const hashedPassword = await hashPassword(newPassword);

        // Update via prisma directly since UserService doesn't expose password update
        const prisma = (await import("@/lib/prisma")).default;
        await prisma.user.update({
            where: { id: decoded.userId },
            data: {
                password: hashedPassword,
                resetToken: null,
                resetTokenExpires: null,
            },
        });

        return NextResponse.json({ message: "Password reset successfully", success: true }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            {
                message: "Error resetting password",
                success: false,
                error: error instanceof Error ? error.message : String(error),
            },
            { status: 500 }
        );
    }
}


