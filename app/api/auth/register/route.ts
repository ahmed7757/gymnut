import { NextRequest } from "next/server";
import { handleRegister } from "@/app/api/_controllers/auth.controller";

export async function POST(req: NextRequest) {
  return handleRegister(req);
}
