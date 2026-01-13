import React from "react";
import Link from "next/link";
import LoginForm from "@/components/features/auth/LoginForm";

export const metadata = {
    title: "Log in — FitAI",
    description: "Sign in to access your FitAI dashboard",
};

export default function LoginPage() {
    return (
        <main className=" bg-background-dark text-white flex items-center justify-center relative">
            <div className="absolute inset-0 bg-hero-glow pointer-events-none" />
            <div className="w-full max-w-7xl mx-auto px-6 py-12 lg:py-20 flex flex-col lg:flex-row gap-12 lg:gap-10 justify-between  items-center">
                {/* Left content - server rendered static marketing */}
                <section className="flex flex-col gap-8 lg:pr-10 relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 w-fit">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                        </span>
                        <span className="text-xs font-medium text-primary tracking-wide uppercase">Powerd By Gemini AI</span>
                    </div>

                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-black leading-tight tracking-tight text-white">
                        Unlock Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-300">Peak Performance</span> with AI
                    </h1>

                    <p className="text-lg text-slate-400 leading-relaxed max-w-xl">
                        Smart nutrition tracking and adaptive workout plans tailored just for you. Our algorithms learn from your
                        biometrics to build the perfect routine.
                    </p>

                    <div className="flex items-center gap-4 pt-2">
                        <div className="flex -space-x-3">
                            <img className="w-10 h-10 rounded-full border-2 border-background-dark object-cover" src="https://images.unsplash.com/photo-1554327124-5f38d9b4d9b6?w=512&q=60" alt="User avatar" />
                            <img className="w-10 h-10 rounded-full border-2 border-background-dark object-cover" src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=512&q=60" alt="User avatar" />
                            <img className="w-10 h-10 rounded-full border-2 border-background-dark object-cover" src="https://images.unsplash.com/photo-1545537245-5f48f0a3db88?w=512&q=60" alt="User avatar" />
                            <div className="w-10 h-10 rounded-full border-2 border-background-dark bg-slate-700 flex items-center justify-center text-xs font-bold text-white">+5k</div>
                        </div>

                        <div className="flex flex-col">
                            <div className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-yellow-500 text-[16px]">star</span>
                                <span className="material-symbols-outlined text-yellow-500 text-[16px]">star</span>
                                <span className="material-symbols-outlined text-yellow-500 text-[16px]">star</span>
                                <span className="material-symbols-outlined text-yellow-500 text-[16px]">star</span>
                                <span className="material-symbols-outlined text-yellow-500 text-[16px]">star</span>
                            </div>
                            <span className="text-sm text-slate-400 font-medium">Trusted by 50,000+ athletes</span>
                        </div>
                    </div>
                </section>

                {/* Right - client-side Login form (LoginForm is a client component) */}
                <aside className="flex justify-center w-full lg:justify-end">
                    <LoginForm />
                </aside>
            </div>
        </main>
    );
}
