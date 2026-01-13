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
import DashboardHeader from "./components/DashboardHeader";
import DashboardStats from "./components/DashboardStats";
import DashboardDetailed from "./components/DashboardDetailed";

export const metadata: Metadata = {
    title: "Dashboard | GymNut",
    description: "Your fitness overview",
};

export default function DashboardPage() {
    return (
        <div className="space-y-6">
            <DashboardHeader />

            <DashboardStats />

            <DashboardDetailed />
        </div>
    );
}
