import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { registerSchema } from "@/lib/schemas";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useRegisterStore } from "@/stores/useRegisterStore";
import { useRouter } from "next/navigation";

const stepSchema = registerSchema.pick({
    diseases: true,
}).required();

type StepData = z.infer<typeof stepSchema>;

const CONDITIONS = [
    { id: "DIABETES", label: "Diabetes" },
    { id: "HYPERTENSION", label: "Hypertension (High BP)" },
    { id: "HEART_DISEASE", label: "Heart Disease" },
    { id: "ASTHMA", label: "Asthma" },
    { id: "NONE", label: "None / I'm healthy" },
] as const;

export default function HealthStep() {
    const router = useRouter();
    const { formData, submitRegistration, prevStep, isSubmitting } = useRegisterStore();

    const {
        handleSubmit,
        setValue,
        watch,
    } = useForm<StepData>({
        resolver: zodResolver(stepSchema),
        mode: "onChange",
        defaultValues: {
            diseases: formData.diseases || ["NONE"],
        },
    });

    const selectedDiseases = watch("diseases") || [];

    const handleToggle = (id: string) => {
        let current = [...selectedDiseases];

        // If selecting NONE, clear others. If selecting others, clear NONE
        if (id === "NONE") {
            current = ["NONE"];
        } else {
            current = current.filter(c => c !== "NONE");
            if (current.includes(id as any)) {
                current = current.filter(c => c !== id);
            } else {
                current.push(id as any);
            }
            if (current.length === 0) current = ["NONE"];
        }

        setValue("diseases", current as any);
    }

    const onSubmit = async (data: StepData) => {
        const success = await submitRegistration(data);
        if (success) {
            router.push("/login?registered=true");
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <CardHeader>
                <CardTitle>Medical Conditions</CardTitle>
                <CardDescription>Select any conditions so we can adjust safely.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-3">
                    {CONDITIONS.map((condition) => (
                        <div key={condition.id} className="flex items-center space-x-2 border rounded-md p-3 hover:bg-muted/50 transition-colors">
                            <Checkbox
                                id={condition.id}
                                checked={selectedDiseases.includes(condition.id as any)}
                                onCheckedChange={() => handleToggle(condition.id)}
                            />
                            <Label htmlFor={condition.id} className="flex-1 cursor-pointer font-normal">
                                {condition.label}
                            </Label>
                        </div>
                    ))}
                </div>
            </CardContent>
            <CardFooter className="flex justify-between gap-4">
                <Button type="button" variant="outline" onClick={prevStep} disabled={isSubmitting}>Back</Button>
                <Button type="submit" className="flex-1" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Create Account
                </Button>
            </CardFooter>
        </form>
    );
}
