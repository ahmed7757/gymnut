import Link from "next/link";
import { Dumbbell } from "lucide-react";

export default function LandingHeader() {
    return (
        <header className="w-full z-50 border-b border-white/5 bg-background/80 backdrop-blur-md sticky top-0">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="size-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                        <Dumbbell className="h-5 w-5" />
                    </div>
                    <h2 className="text-xl font-bold tracking-tight text-white">GymNut</h2>
                </div>
                <nav className="hidden md:flex items-center gap-8">
                    <Link href="#" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Features</Link>
                    <Link href="#" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Pricing</Link>
                    <Link href="#" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">About</Link>
                </nav>
                <div className="flex gap-3">
                    <Link href="/register" className="hidden sm:flex h-9 px-4 items-center justify-center rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all">
                        Sign Up
                    </Link>
                    <Link href="/login" className="flex h-9 px-4 items-center justify-center rounded-lg bg-primary hover:bg-primary/90 text-white text-sm font-bold transition-all shadow-lg shadow-primary/20">
                        Log In
                    </Link>
                </div>
            </div>
        </header>
    );
}
