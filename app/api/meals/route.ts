import { NextRequest } from "next/server";
import { getMeals, logMeal } from "../_controllers/meals.controller";
export async function POST(req: NextRequest) {
    return logMeal(req);
}

export async function GET(req: NextRequest) {
    return getMeals(req);
}