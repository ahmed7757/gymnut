import { Dumbbell, Star } from "lucide-react";
import LoginForm from "@/components/features/auth/LoginForm";
import LandingHeader from "@/components/layout/LandingHeader";

export default function Home() {
    return (
        <div className="flex min-h-screen flex-col text-foreground relative overflow-x-hidden selection:bg-primary selection:text-white">
            <LandingHeader />

            <main className="flex-grow flex items-center justify-center relative">
                {/* Background Glows (Local + Global) */}


                <div className="w-full max-w-7xl mx-auto px-6 py-12 lg:py-20 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    {/* Left Column: Hero */}
                    <div className="flex flex-col gap-8 lg:pr-10 relative z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 w-fit">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                            </span>
                            <span className="text-xs font-medium text-primary tracking-wide uppercase">Powered by Gemini AI</span>
                        </div>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-black leading-tight tracking-tight text-white">
                            Unlock Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-300">Peak Performance</span> with AI
                        </h1>
                        <p className="text-lg text-slate-400 leading-relaxed max-w-xl">
                            Smart nutrition tracking and adaptive workout plans tailored just for you. Our algorithms learn from your biometrics to build the perfect routine.
                        </p>

                        {/* Social Proof */}
                        <div className="flex items-center gap-4 pt-2">
                            <div className="flex -space-x-3">
                                <img alt="User Avatar" className="w-10 h-10 rounded-full border-2 border-background object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBrsbBMCpLx0s4PpgtOVmtQTDDMi5wtJtEOZ85olCT9tRyI0S-dasWURa_y-7mAok2KqVrAkBSXZEuSYIhQz4eox1F_BeLwGt83b4el5HqYuAXdaDfLR2K585WlZym3OHqBep_HP-zLlQpnC0dIiTBPKE2OqcOhH5C05_0xM39pJSCZRzADOOTn5WA_J_cRygONz_4w4Jh9E_ppnENwlnpmYEVH_7oIVMRJuVdimv-QPme2878qr7Yo0-KzfUAnOxshV40gn1IyTOE" />
                                <img alt="User Avatar" className="w-10 h-10 rounded-full border-2 border-background object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD132nat2RdLGYJP7SymWIueqKJ6326Xc3KgzfHuoiWgj_S9kJGQaJPeKj1CiQni2CTlbnRzJ0LOXuF3g5j8kFrKYqXH8PAVZgiWrNbXJSvq8vWUkUKCiV0LzRM8LTkG64eocP6u1HAhIYL9FQb6wXiyAeLzBOmyZrTwDVO134M8xFgZYWVfmTgeSbpeIMRPe0dENh_lf1lVav0jlCDB5xRFL3T6zo9w4ssGUGIgifAgkiYGXtfYwPYpnlxVfsZb1bVu8BqsskXoHs" />
                                <img alt="User Avatar" className="w-10 h-10 rounded-full border-2 border-background object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD-f9k5K9RE9VLaO8-M_-LGXjYLidpXVVr_8wximhPsaLaa8w5CRwY_q5Spmw0_kwKNfqU4z6o9ZV7YBl0oiISEb4Szpu6slxmwNBr07CAqw9IapA1oKxaU_xhId_fXHsgo1nh1fJMKGjRMpaF5Vga8hWtfarHKN9V9wPpIL-x53iIybp7AgLVYc1ejH0x9rHNBMu3zi1kNiFfyjdXwvPbYWwsm9NqjWdcD6JKYvh--dVAeOqj9dSPKmP1t4t9k4Gmc127FXyQAlPM" />
                                <div className="w-10 h-10 rounded-full border-2 border-background bg-slate-700 flex items-center justify-center text-xs font-bold text-white">
                                    +5k
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <div className="flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <Star key={i} className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                    ))}
                                </div>
                                <span className="text-sm text-slate-400 font-medium">Trusted by 50,000+ athletes</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Login Form */}
                    <div className="flex justify-center w-full lg:justify-end">
                        <LoginForm />
                    </div>
                </div>
            </main>
        </div>
    );
}
