import { NextRequest } from "next/server";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import {
  createApiResponse,
  createErrorResponse,
  createValidationErrorResponse,
  createNotFoundResponse,
} from "@/lib/api";
import { UserService } from "@/lib/database";

export async function POST(req: NextRequest) {
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

    if (!process.env.JWT_SECRET) {
      return createErrorResponse(
        new Error("JWT_SECRET is not configured"),
        500
      );
    }

    const resetToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60);

    await UserService.updateResetToken(body.email, resetToken, expiresAt);

    const resetUrl = `${
      process.env.NEXT_PUBLIC_APP_URL
    }/reset-password?token=${encodeURIComponent(resetToken)}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.AUTH_GOOGLE_EMAIL,
        pass: process.env.AUTH_GOOGLE_APP,
      },
    });

    const mailOptions = await transporter.sendMail({
      from: process.env.AUTH_GOOGLE_EMAIL,
      to: user.email,
      subject: "Reset Password",
      text: `Click the link below to reset your password: ${resetUrl}`,
      html: `
            <html>
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <style>
                @media only screen and (max-width: 600px) {
                    .email-container {
                    width: 100% !important;
                    margin: 0 auto !important;
                    border-radius: 0 !important;
                    }
                    .btn a {
                    display: block !important;
                    width: 100% !important;
                    text-align: center !important;
                    padding: 10px 4px !important;
                    font-size: 18px !important;
                    }
                    .body-text {
                    font-size: 16px !important;
                    }
                }
                </style>
            </head>
            <body style="background-color: #f4f4f7; font-family: Arial, sans-serif; margin: 0; padding: 20px;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                    <td align="center">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 600px; background: #ffffff; border-radius: 8px; box-shadow: 0px 3px 8px rgba(0,0,0,0.05);" class="email-container">
                        
                        <!-- HEADER -->
                        <tr>
                        <td align="center" style="padding: 20px; background-color: #4CAF50; color: #ffffff;">
                            <h1 style="margin: 0; font-size: 22px; line-height: 1.2;">Password Reset Request</h1>
                        </td>
                        </tr>
                        
                        <!-- BODY -->
                        <tr>
                        <td style="padding: 24px; color: #333333; font-size: 15px; line-height: 1.6;" class="body-text">
                            <p>Hello,</p>
                            <p>You requested to reset your password. Please click the button below to set a new password:</p>
                            
                            <!-- Button -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" style="margin: 30px auto;">
                            <tr>
                                <td class="btn">
                                <a href="${resetUrl}" style="background-color: #4CAF50; color: #ffffff; text-decoration: none; font-weight: bold; padding: 12px 32px; border-radius: 6px; display: inline-block;">Reset Password</a>
                                </td>
                            </tr>
                            </table>
                            
                            <p>This link will expire in <strong>1 hour</strong>.</p>
                            <p>If you did not request this, you can safely ignore this message.</p>
                            <p style="margin-top: 20px;">If the button doesn't work, copy and paste this link into your browser:</p>
                            <p style="word-wrap: break-word; color: #4CAF50;">${resetUrl}</p>
                        </td>
                        </tr>
                        
                        <!-- FOOTER -->
                        <tr>
                        <td align="center" style="padding: 18px; background-color: #f9f9f9; color: #777; font-size: 12px;">
                            <p style="margin: 0;">&copy; ${new Date().getFullYear()} GymNut. All rights reserved.</p>
                        </td>
                        </tr>
                        
                    </table>
                    </td>
                </tr>
                </table>
            </body>
            </html>
            `,
    });

    return createApiResponse(
      { email: user.email },
      "Password reset email sent successfully"
    );
  } catch (error) {
    return createErrorResponse(error);
  }
}
