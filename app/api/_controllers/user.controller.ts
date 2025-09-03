import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { UserService } from "@/lib/database";
import {
    createApiResponse,
    createErrorResponse,
    createUnauthorizedResponse,
    createValidationErrorResponse,
} from "@/lib/api";
import { updateProfileSchema } from "@/lib/schemas";

export async function getUserData() {
    const session = await auth();
    if (!session?.user?.id) {
        return createUnauthorizedResponse();
    }
    try {
        const user = await UserService.findById(session.user.id);
        return createApiResponse(user);
    } catch (error) {
        return createErrorResponse(error);
    }
}

export async function updateUserData(req: NextRequest) {
    const session = await auth();
    if (!session?.user?.id) {
        return createUnauthorizedResponse();
    }
    try {
        const body = await req.json();
        const parsed = updateProfileSchema.safeParse(body);
        if (!parsed.success) {
            return createValidationErrorResponse(parsed.error.issues);
        }
        const updated = await UserService.update(session.user.id, parsed.data);
        return createApiResponse(updated, "Profile updated");
    } catch (error) {
        return createErrorResponse(error);
    }
}


