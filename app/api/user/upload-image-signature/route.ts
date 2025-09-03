import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { createUploadSignature } from "@/lib/services/cloudinary";
import { createApiResponse, createUnauthorizedResponse, createErrorResponse } from "@/lib/api";

export async function GET(req: NextRequest) {
    const session = await auth();
    if (!session?.user?.id) {
        return createUnauthorizedResponse();
    }
    try {
        const { searchParams } = new URL(req.url);
        const folder = searchParams.get("folder") || "users";
        const sig = createUploadSignature({ folder });
        return createApiResponse(sig);
    } catch (error) {
        return createErrorResponse(error);
    }
}


