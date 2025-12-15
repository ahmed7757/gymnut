"use client";

import { useUIStore } from "@/stores/useUIStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { Button } from "@/components/ui/button";
import { Menu, Bell } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AuthService } from "@/lib/api/services/authService";
import { useRouter } from "next/navigation";

export default function Header() {
    const { toggleSidebar } = useUIStore();
    const { user, logout } = useAuthStore();
    const router = useRouter();

    const handleLogout = async () => {
        await AuthService.logout();
        logout();
        router.push("/login");
    };

    return (
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur px-6 shadow-sm">
            <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={toggleSidebar}
            >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Sidebar</span>
            </Button>

            <div className="flex items-center gap-4 ml-auto">
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                    <Bell className="h-5 w-5" />
                </Button>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                            <Avatar className="h-9 w-9 border">
                                <AvatarImage src={user?.image || ""} alt={user?.name || "User"} />
                                <AvatarFallback>{user?.name?.[0]?.toUpperCase() || "U"}</AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">{user?.name}</p>
                                <p className="text-xs leading-none text-muted-foreground">
                                    {user?.email}
                                </p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => router.push("/dashboard/profile")}>
                            Profile Settings
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
