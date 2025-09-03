import { NextRequest } from "next/server";
import { handleResetPassword } from "../../_controllers/auth.controller";

export async function POST(req: NextRequest) {
    return handleResetPassword(req);
}


