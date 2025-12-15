import { NextRequest } from "next/server";
import { generateMealPlan } from "../../_controllers/meals.controller";

export async function POST(req: NextRequest) {
    return generateMealPlan(req);
}