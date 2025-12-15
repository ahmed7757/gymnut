import { Metadata } from "next";
import RegisterWizard from "@/components/features/auth/RegisterWizard";

export const metadata: Metadata = {
    title: "Register | GymNut",
    description: "Create your GymNut account",
};

export default function RegisterPage() {
    return (
        <div className="w-full flex justify-center">
            <RegisterWizard />
        </div>
    );
}
