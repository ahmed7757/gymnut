import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import jwt from "jsonwebtoken"
import { hashPassword } from "@/utils/password"

export async function POST(req: NextRequest) {
    try {
        console.log("=== RESET PASSWORD REQUEST RECEIVED ===");
        const body = await req.json();
        console.log("Request body:", body);

        const { token, newPassword } = body;

        if (!token || !newPassword) {
            console.log("Error: Token and new password are required");
            return NextResponse.json({
                message: "Token and new password are required",
                success: false
            }, { status: 400 });
        }

        if (!process.env.JWT_SECRET) {
            console.log("Error: JWT_SECRET is not set");
            return NextResponse.json({
                message: "Internal server error",
                success: false
            }, { status: 500 });
        }

        // Verify the JWT token
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET) as { userId: string };
        } catch (jwtError) {
            console.log("Error: Invalid or expired token");
            return NextResponse.json({
                message: "Invalid or expired reset token",
                success: false
            }, { status: 400 });
        }

        console.log("Token verified for user ID:", decoded.userId);

        // Find user with the reset token
        const user = await prisma.user.findFirst({
            where: {
                id: decoded.userId,
                resetToken: token,
                resetTokenExpires: {
                    gt: new Date()
                }
            }
        });

        if (!user) {
            console.log("Error: User not found or token expired");
            return NextResponse.json({
                message: "Invalid or expired reset token",
                success: false
            }, { status: 400 });
        }

        console.log(`User found: ${user.name} (${user.email})`);

        // Hash the new password using existing utility
        const hashedPassword = await hashPassword(newPassword);

        // Update user's password and clear reset token
        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                resetToken: null,
                resetTokenExpires: null
            }
        });

        console.log("Password updated successfully");
        return NextResponse.json({
            message: "Password reset successfully",
            success: true
        }, { status: 200 });

    } catch (error) {
        console.error("=== ERROR IN RESET PASSWORD FUNCTION ===");
        console.error("Error resetting password:", error);
        console.error("Error details:", error instanceof Error ? error.message : String(error));
        return NextResponse.json({
            message: "Error resetting password",
            success: false,
            error: error instanceof Error ? error.message : String(error)
        }, { status: 500 });
    } finally {
        console.log("=== RESET PASSWORD REQUEST PROCESSING COMPLETED ===");
    }
}