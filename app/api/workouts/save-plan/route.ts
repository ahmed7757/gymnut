import { NextRequest } from "next/server";
import { getSavedWorkoutPlans, saveWorkoutPlan } from "../../_controllers/workouts.controller";

export async function POST(req: NextRequest) {
    return saveWorkoutPlan(req);
}
export async function GET(req: NextRequest) {
    return getSavedWorkoutPlans(req);
}
