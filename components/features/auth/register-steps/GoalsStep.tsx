import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { registerSchema } from "@/lib/schemas";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useRegisterStore } from "@/stores/useRegisterStore";

const stepSchema = registerSchema.pick({
    goal: true,
}).required();

type StepData = z.infer<typeof stepSchema>;

export default function GoalsStep() {
    const { formData, nextStep, prevStep } = useRegisterStore();

    const {
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<StepData>({
        resolver: zodResolver(stepSchema),
        mode: "onChange",
        defaultValues: {
            goal: formData.goal || "MAINTAIN",
        },
    });

    const selectedGoal = watch("goal");

    const onSubmit = (data: StepData) => {
        nextStep(data);
    };

    // Helper to make radio button look like a card
    const GoalCard = ({ value, title, desc }: { value: string, title: string, desc: string }) => (
        <Label
            htmlFor={value}
            className={cn(
                "flex items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer [&:has([data-state=checked])]:border-primary",
                selectedGoal === value && "border-primary bg-primary/5"
            )}
        >
            <div>
                <div className="font-semibold">{title}</div>
                <div className="text-sm text-muted-foreground">{desc}</div>
            </div>
            <RadioGroupItem value={value} id={value} className="sr-only" />
        </Label>
    )

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <CardHeader>
                <CardTitle>What is your main goal?</CardTitle>
                <CardDescription>This will help AI tailor your workouts.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <RadioGroup
                    onValueChange={(val) => setValue("goal", val as any)}
                    defaultValue={selectedGoal}
                    className="flex flex-col gap-3"
                >
                    <GoalCard value="LOSE" title="Lose Weight" desc="Burn fat and get lean" />
                    <GoalCard value="MAINTAIN" title="Maintain" desc="Stay fit and healthy" />
                    <GoalCard value="GAIN" title="Build Muscle" desc="Gain size and strength" />
                </RadioGroup>
                {errors.goal && <p className="text-sm text-destructive">{errors.goal.message}</p>}
            </CardContent>
            <CardFooter className="flex justify-between gap-4">
                <Button type="button" variant="outline" onClick={prevStep}>Back</Button>
                <Button type="submit" className="flex-1">Next: Health</Button>
            </CardFooter>
        </form>
    );
}
