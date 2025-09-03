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
import { uploadImageToCloudinary } from "@/lib/services/cloudinary";

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
        const contentType = req.headers.get("content-type") || "";
        if (contentType.includes("multipart/form-data")) {
            const form = await req.formData();
            const imageFile = form.get("image") as File | null;
            const otherJson = form.get("data") as string | null;
            const base = otherJson ? JSON.parse(otherJson) : {};

            const parsed = updateProfileSchema.safeParse(base);
            if (!parsed.success) {
                return createValidationErrorResponse(parsed.error.issues);
            }

            let imageUrl: string | undefined;
            if (imageFile && typeof imageFile === "object") {
                const uploaded = await uploadImageToCloudinary(imageFile, { folder: "users" });
                imageUrl = uploaded.secure_url;
            }

            const payload = { ...parsed.data, ...(imageUrl ? { image: imageUrl } : {}) };
            const updated = await UserService.update(session.user.id, payload);
            return createApiResponse(updated, "Profile updated");
        }

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


