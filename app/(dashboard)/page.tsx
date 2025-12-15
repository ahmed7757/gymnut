import { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    Activity,
    Flame,
    Utensils,
    TrendingUp,
    Target
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
    title: "Dashboard | GymNut",
    description: "Your fitness overview",
};

export default function DashboardPage() {
    return (
        <div className="space-y-6">
            {/* Welcome Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground">Overview of your daily progress.</p>
                </div>
                <div className="flex gap-2">
                    <Button size="sm">Log Meal</Button>
                    <Button size="sm" variant="outline">Log Workout</Button>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Daily Calories</CardTitle>
                        <Flame className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">1,248 / 2,400</div>
                        <p className="text-xs text-muted-foreground">
                            52% of daily goal
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Workouts</CardTitle>
                        <Activity className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">3</div>
                        <p className="text-xs text-muted-foreground">
                            +1 from last week
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Protein Intake</CardTitle>
                        <Utensils className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">102g / 160g</div>
                        <p className="text-xs text-muted-foreground">
                            64% of daily goal
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Weight Goal</CardTitle>
                        <Target className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">75.5 kg</div>
                        <p className="text-xs text-muted-foreground">
                            -1.2 kg this month
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Detailed Sections */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="lg:col-span-4">
                    <CardHeader>
                        <CardTitle>Activity Overview</CardTitle>
                        <CardDescription>
                            Your activity levels over the last 7 days.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[200px] flex items-center justify-center border rounded-md bg-muted/10 text-muted-foreground text-sm">
                            Chart Placeholder (Recharts / Chart.js)
                        </div>
                    </CardContent>
                </Card>

                <Card className="lg:col-span-3">
                    <CardHeader>
                        <CardTitle>Recent Meals</CardTitle>
                        <CardDescription>
                            Your last logged items.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {/* Placeholder Items */}
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center">
                                        <Utensils className="h-5 w-5 opacity-50" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">Grilled Chicken Salad</p>
                                        <p className="text-xs text-muted-foreground">Lunch • 450 kcal</p>
                                    </div>
                                    <div className="text-xs font-medium">+32g P</div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
