import jwt from "jsonwebtoken";

export class TokenService {
    static ensureSecret() {
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is not configured");
        }
        return process.env.JWT_SECRET as string;
    }

    static createResetToken(userId: string, expiresIn: string = "1h") {
        const secret = this.ensureSecret();
        return jwt.sign({ userId }, secret, { expiresIn });
    }

    static verifyToken<T = any>(token: string) {
        const secret = this.ensureSecret();
        return jwt.verify(token, secret) as T;
    }
}


