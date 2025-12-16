import React from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-muted/20">
            <Sidebar />
            <div className="flex flex-1 flex-col transition-all duration-300 ease-in-out w-full">
                <Header />
                <main className="flex-1 p-6 space-y-6 overflow-y-auto h-[calc(100vh-4rem)]">
                    {children}
                </main>
            </div>
        </div>
    );
}
