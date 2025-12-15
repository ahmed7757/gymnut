"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { AuthService } from "@/lib/api/services/authService";
import { z } from "zod";
import { registerSchema } from "@/lib/schemas";

import BasicInfoStep from "./register-steps/BasicInfoStep";
import BodyStatsStep from "./register-steps/BodyStatsStep";
import GoalsStep from "./register-steps/GoalsStep";
import HealthStep from "./register-steps/HealthStep";
import Link from "next/link";

type FormData = z.infer<typeof registerSchema>;

export default function RegisterWizard() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<Partial<FormData>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const updateData = (data: Partial<FormData>) => {
        setFormData((prev) => ({ ...prev, ...data }));
    };

    const nextStep = (data: Partial<FormData>) => {
        updateData(data);
        setStep((prev) => prev + 1);
    };

    const prevStep = () => {
        setStep((prev) => prev - 1);
    };

    const handleFinalSubmit = async (finalStepData: Partial<FormData>) => {
        const completeData = { ...formData, ...finalStepData } as FormData;
        setIsSubmitting(true);

        try {
            const result = await AuthService.register(completeData);
            if (result.success) {
                toast.success("Account created!", {
                    description: "Redirecting to login...",
                });
                // Optional: Auto login logic here? 
                router.push("/login?registered=true");
            } else {
                // AuthService might throw or return standard API response error
                // Assuming Axios interceptor handles throws, but if it returns object:
                toast.error("Registration failed");
            }
        } catch (error: any) {
            toast.error(error.message || "Registration failed");
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card className="w-full max-w-lg bg-card/50 backdrop-blur-sm border-muted/20 shadow-xl">
            {/* Progress Bar */}
            <div className="w-full h-1 bg-muted rounded-t-xl overflow-hidden">
                <div
                    className="h-full bg-primary transition-all duration-300 ease-in-out"
                    style={{ width: `${(step / 4) * 100}%` }}
                />
            </div>

            {step === 1 && (
                <BasicInfoStep defaultValues={formData} onNext={nextStep} />
            )}

            {step === 2 && (
                <BodyStatsStep
                    defaultValues={formData}
                    onNext={nextStep}
                    onBack={prevStep}
                />
            )}

            {step === 3 && (
                <GoalsStep
                    defaultValues={formData}
                    onNext={nextStep}
                    onBack={prevStep}
                />
            )}

            {step === 4 && (
                <HealthStep
                    defaultValues={formData}
                    onSubmit={handleFinalSubmit}
                    onBack={prevStep}
                    isSubmitting={isSubmitting}
                />
            )}

            <div className="p-4 text-center text-sm text-muted-foreground border-t">
                Already have an account?{" "}
                <Link href="/login" className="text-primary hover:underline">
                    Login
                </Link>
            </div>
        </Card>
    );
}
