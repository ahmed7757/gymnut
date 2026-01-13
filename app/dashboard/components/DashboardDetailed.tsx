import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Utensils } from 'lucide-react'
import React from 'react'

function DashboardDetailed() {
    return (
        <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
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
        </section>)
}

export default DashboardDetailed