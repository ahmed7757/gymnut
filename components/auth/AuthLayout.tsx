import { ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Apple, Zap, Target } from 'lucide-react';

interface AuthLayoutProps {
    children: ReactNode;
    title: string;
    description: string;
    subtitle?: string;
    className?: string;
}

export function AuthLayout({
    children,
    title,
    description,
    subtitle,
    className = "from-green-50 via-emerald-50 to-green-100"
}: AuthLayoutProps) {
    return (
        <div className={`min-h-screen bg-gradient-to-br ${className} flex items-center justify-center px-4 py-8 relative overflow-hidden`}>
            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-200/30 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-200/30 rounded-full blur-3xl"></div>
            </div>

            <Card className="w-full max-w-md shadow-2xl rounded-3xl border-0 bg-white/95 backdrop-blur-sm relative z-10">
                <CardHeader className="text-center space-y-4 pb-6">
                    {/* Logo */}
                    <div className="flex items-center justify-center gap-3">
                        <div className="flex items-center gap-2 text-green-600">
                            <Apple className="h-8 w-8" />
                            <Zap className="h-6 w-6 text-emerald-500" />
                            <Target className="h-6 w-6 text-green-700" />
                        </div>
                    </div>

                    {/* Brand */}
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 bg-clip-text text-transparent">
                            Gym Nutrition
                        </h1>
                        <p className="text-sm text-green-600 font-medium mt-1">
                            Fuel Your Fitness Journey
                        </p>
                    </div>

                    {/* Page Title */}
                    <CardTitle className="text-2xl font-semibold text-gray-800">
                        {title}
                    </CardTitle>
                    <CardDescription className="text-gray-600 text-base">
                        {description}
                    </CardDescription>
                    {subtitle && (
                        <p className="text-sm text-gray-500 italic">
                            {subtitle}
                        </p>
                    )}
                </CardHeader>

                <CardContent className="px-8 pb-8">
                    {children}
                </CardContent>
            </Card>
        </div>
    );
}
