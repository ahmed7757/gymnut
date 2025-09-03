import nodemailer from "nodemailer";

export class EmailService {
    static async sendResetPasswordEmail(to: string, resetUrl: string) {
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

        await transporter.sendMail({
            from: process.env.AUTH_GOOGLE_EMAIL,
            to,
            subject: "Reset Password",
            text: `Click the link below to reset your password: ${resetUrl}`,
            html: `<p>Reset your password here: <a href="${resetUrl}">${resetUrl}</a></p>`,
        });
    }
}


