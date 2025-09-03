import { NextRequest } from "next/server";
import { handleForgotPassword } from "@/app/api/_controllers/auth.controller";

export async function POST(req: NextRequest) {
  return handleForgotPassword(req);
}
