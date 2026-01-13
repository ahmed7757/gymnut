import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Activity, Flame, Target, Utensils } from 'lucide-react'
import React from 'react'

function DashboardStats() {
    return (
        <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
        </section>)
}

export default DashboardStats