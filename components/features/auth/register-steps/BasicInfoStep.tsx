import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { registerSchema } from "@/lib/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

// Pick fields for this step
const stepSchema = registerSchema.pick({
    name: true,
    email: true,
    password: true,
    confirmPassword: true,
    gender: true,
}).refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
});

type StepData = z.infer<typeof stepSchema>;

interface Props {
    defaultValues: Partial<StepData>;
    onNext: (data: StepData) => void;
}

export default function BasicInfoStep({ defaultValues, onNext }: Props) {
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<StepData>({
        resolver: zodResolver(stepSchema),
        defaultValues: {
            name: defaultValues.name || "",
            email: defaultValues.email || "",
            password: defaultValues.password || "",
            confirmPassword: defaultValues.confirmPassword || "",
            gender: defaultValues.gender || undefined,
        },
    });

    const gender = watch("gender");

    return (
        <form onSubmit={handleSubmit(onNext)}>
            <CardHeader>
                <CardTitle>Create Account</CardTitle>
                <CardDescription>Let's start with your basic information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" placeholder="John Doe" {...register("name")} />
                    {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" placeholder="john@example.com" {...register("email")} />
                    {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" type="password" {...register("password")} />
                        {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <Input id="confirmPassword" type="password" {...register("confirmPassword")} />
                        {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>}
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Gender</Label>
                    <Select onValueChange={(val: string) => setValue("gender", val as any)} defaultValue={gender}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="MALE">Male</SelectItem>
                            <SelectItem value="FEMALE">Female</SelectItem>
                        </SelectContent>
                    </Select>
                    {errors.gender && <p className="text-sm text-destructive">{errors.gender.message}</p>}
                </div>
            </CardContent>
            <CardFooter>
                <Button type="submit" className="w-full">Next: Body Stats</Button>
            </CardFooter>
        </form>
    );
}
