import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { registerSchema } from "@/lib/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

const stepSchema = registerSchema.pick({
    age: true,
    height: true,
    weight: true,
});

type StepData = z.infer<typeof stepSchema>;

interface Props {
    defaultValues: Partial<StepData>;
    onNext: (data: StepData) => void;
    onBack: () => void;
}

export default function BodyStatsStep({ defaultValues, onNext, onBack }: Props) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<StepData>({
        resolver: zodResolver(stepSchema),
        defaultValues: {
            age: defaultValues.age,
            height: defaultValues.height,
            weight: defaultValues.weight,
        },
    });

    return (
        <form onSubmit={handleSubmit(onNext)}>
            <CardHeader>
                <CardTitle>Body Stats</CardTitle>
                <CardDescription>Help us customize your plan.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="age">Age (years)</Label>
                    <Input
                        id="age"
                        type="number"
                        placeholder="25"
                        {...register("age", { valueAsNumber: true })}
                    />
                    {errors.age && <p className="text-sm text-destructive">{errors.age.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="height">Height (cm)</Label>
                        <Input
                            id="height"
                            type="number"
                            placeholder="175"
                            {...register("height", { valueAsNumber: true })}
                        />
                        {errors.height && <p className="text-sm text-destructive">{errors.height.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="weight">Weight (kg)</Label>
                        <Input
                            id="weight"
                            type="number"
                            placeholder="70"
                            {...register("weight", { valueAsNumber: true })}
                        />
                        {errors.weight && <p className="text-sm text-destructive">{errors.weight.message}</p>}
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex justify-between gap-4">
                <Button type="button" variant="outline" onClick={onBack}>Back</Button>
                <Button type="submit" className="flex-1">Next: Goals</Button>
            </CardFooter>
        </form>
    );
}
