import { Button } from '@/components/ui/button'
import React from 'react'

function DashboardHeader() {
    return (
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">Overview of your daily progress.</p>
            </div>
            <div className="flex gap-2">
                <Button size="sm">Log Meal</Button>
                <Button size="sm" variant="outline">Log Workout</Button>
            </div>
        </header>)
}

export default DashboardHeader