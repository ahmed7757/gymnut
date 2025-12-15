import { NextRequest } from "next/server";
import { handleFoodSearch } from "../_controllers/food.controller";

export async function GET(req: NextRequest) {
    return handleFoodSearch(req);
}
export async function POST(req: NextRequest) { }