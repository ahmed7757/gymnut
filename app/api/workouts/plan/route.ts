import { NextRequest } from "next/server";
import { generateWorkoutPlan, getWorkoutPlanMethodInfo } from "../../_controllers/workouts.controller";

export async function GET(req: NextRequest) {
    return getWorkoutPlanMethodInfo();
}

export async function POST(req: NextRequest) {
    return generateWorkoutPlan(req);
}