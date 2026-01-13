"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { useRegisterStore } from "@/stores/useRegisterStore";
import Link from "next/link";


import BasicInfoStep from "./register-steps/BasicInfoStep";
import BodyStatsStep from "./register-steps/BodyStatsStep";
import GoalsStep from "./register-steps/GoalsStep";
import HealthStep from "./register-steps/HealthStep";

export default function RegisterWizard() {
    const router = useRouter();
    const { currentStep, isSubmitting } = useRegisterStore();

    // Handle successful registration redirect
    useEffect(() => {
        const handleRegistrationSuccess = () => {
            router.push("/login?registered=true");
        };

        // Listen for successful registration
        // This is handled in the store's submitRegistration method
        return () => {
            // Cleanup if needed
        };
    }, [router]);

    return (
        <Card className="w-full max-w-lg bg-card/50 backdrop-blur-sm border-muted/20 shadow-xl">
            {/* Progress Bar */}
            <div className="w-full h-1 bg-muted rounded-t-xl overflow-hidden">
                <div
                    className="h-full bg-primary transition-all duration-300 ease-in-out"
                    style={{ width: `${(currentStep / 4) * 100}%` }}
                />
            </div>

            {currentStep === 1 && <BasicInfoStep />}
            {currentStep === 2 && <BodyStatsStep />}
            {currentStep === 3 && <GoalsStep />}
            {currentStep === 4 && <HealthStep />}

            <div className="p-4 text-center text-sm text-muted-foreground border-t">
                Already have an account?{" "}
                <Link href="/login" className="text-primary hover:underline">
                    Login
                </Link>
            </div>
        </Card>
    );
}
