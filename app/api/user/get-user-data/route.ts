import { getUserData } from "@/app/api/_controllers/user.controller";

export async function GET() {
    return getUserData();
}


