import { registerSchema } from "@/lib/schemas";
import { NextRequest } from "next/server";
import { hashPassword } from "@/utils/password";
import { Gender } from "@prisma/client";
import {
  createApiResponse,
  createErrorResponse,
  createValidationErrorResponse,
} from "@/lib/api";
import { UserService } from "@/lib/database";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return createValidationErrorResponse(
        parsed.error.issues,
        "Invalid input data"
      );
    }

    const { email, password, name, gender } = parsed.data;

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user using service
    const user = await UserService.create({
      email,
      password: hashedPassword,
      name,
      gender: gender as Gender,
    });

    return createApiResponse(user, "Registration successful", 201);
  } catch (error) {
    return createErrorResponse(error);
  }
}
