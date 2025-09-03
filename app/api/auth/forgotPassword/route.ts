import { NextRequest } from "next/server";
import { handleForgotPassword } from "../../_controllers/auth.controller";

export async function POST(req: NextRequest) {
  return handleForgotPassword(req);
}
