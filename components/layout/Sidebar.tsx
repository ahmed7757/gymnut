"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/useAuthStore";
import { useUIStore } from "@/stores/useUIStore";
import {
    LayoutDashboard,
    Utensils,
    Dumbbell,
    User,
    LogOut,
    Menu,
    X,
    PlusCircle,
    Settings
} from "lucide-react";
import { AuthService } from "@/lib/api/services/authService";
import { useRouter } from "next/navigation";

const NAV_ITEMS = [
    { label: "Overview", icon: LayoutDashboard, href: "/dashboard" },
    { label: "Meals", icon: Utensils, href: "/dashboard/meals" },
    { label: "Workouts", icon: Dumbbell, href: "/dashboard/workouts" },
    { label: "Profile", icon: User, href: "/dashboard/profile" },
];

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const logout = useAuthStore((state) => state.logout);
    const { isSidebarOpen, closeSidebar } = useUIStore();

    const handleLogout = async () => {
        await AuthService.logout();
        logout();
        router.push("/login");
    };

    return (
        <>
            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
                    onClick={closeSidebar}
                />
            )}

            {/* Sidebar Container */}
            <aside
                className={cn(
                    "fixed top-0 left-0 z-50 h-screen w-64 border-r bg-card transition-transform duration-300 lg:static lg:translate-x-0",
                    isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="flex h-16 items-center border-b px-6">
                    <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl text-primary">
                        <Dumbbell className="h-6 w-6" />
                        <span>GymNut</span>
                    </Link>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="ml-auto lg:hidden"
                        onClick={closeSidebar}
                    >
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                <div className="flex flex-col h-[calc(100vh-4rem)] justify-between py-4">
                    <nav className="space-y-1 px-2">
                        {NAV_ITEMS.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => closeSidebar()} // Close on mobile click
                                    className={cn(
                                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                                        isActive ? "bg-primary/10 text-primary" : "text-muted-foreground"
                                    )}
                                >
                                    <item.icon className="h-4 w-4" />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="px-4 space-y-4">
                        {/* Quick Action Card */}
                        <div className="rounded-xl bg-primary/5 p-4 border border-primary/10">
                            <h4 className="font-semibold text-sm mb-2">Quick Add</h4>
                            <div className="flex gap-2">
                                <Button size="sm" className="w-full text-xs" variant="outline">
                                    Meal
                                </Button>
                                <Button size="sm" className="w-full text-xs" variant="outline">
                                    Workout
                                </Button>
                            </div>
                        </div>

                        <div className="border-t pt-4 space-y-1">
                            <Button
                                variant="ghost"
                                className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive"
                                onClick={handleLogout}
                            >
                                <LogOut className="h-4 w-4" />
                                Logout
                            </Button>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}
