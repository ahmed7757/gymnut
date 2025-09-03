import { NextRequest } from "next/server";
import { updateUserData } from "@/app/api/_controllers/user.controller";

export async function PUT(req: NextRequest) {
    return updateUserData(req);
}


