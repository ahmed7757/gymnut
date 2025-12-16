import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { z } from 'zod';
import { registerSchema } from '@/lib/schemas';
import { AuthService } from '@/lib/api/services/authService';
import { toast } from 'sonner';

type FormData = z.infer<typeof registerSchema>;

interface RegisterState {
    formData: Partial<FormData>;
    currentStep: number;
    isSubmitting: boolean;
    error: string | null;
}

interface RegisterActions {
    updateFormData: (data: Partial<FormData>) => void;
    setCurrentStep: (step: number) => void;
    nextStep: (data?: Partial<FormData>) => void;
    prevStep: () => void;
    setIsSubmitting: (loading: boolean) => void;
    setError: (error: string | null) => void;
    submitRegistration: (finalData?: Partial<FormData>) => Promise<boolean>;
    resetForm: () => void;
}

type RegisterStore = RegisterState & RegisterActions;

const initialState: RegisterState = {
    formData: {},
    currentStep: 1,
    isSubmitting: false,
    error: null,
};

export const useRegisterStore = create<RegisterStore>()(
    devtools(
        persist(
            (set, get) => ({
                ...initialState,

                updateFormData: (data) => set(
                    (state) => ({
                        formData: { ...state.formData, ...data },
                    }),
                    false,
                    'updateFormData'
                ),

                setCurrentStep: (step) => set(
                    { currentStep: step },
                    false,
                    'setCurrentStep'
                ),

                nextStep: (data) => {
                    const state = get();
                    if (data) {
                        set(
                            {
                                formData: { ...state.formData, ...data },
                                currentStep: state.currentStep + 1,
                            },
                            false,
                            'nextStep'
                        );
                    } else {
                        set(
                            { currentStep: state.currentStep + 1 },
                            false,
                            'nextStep'
                        );
                    }
                },

                prevStep: () => set(
                    (state) => ({
                        currentStep: Math.max(1, state.currentStep - 1),
                    }),
                    false,
                    'prevStep'
                ),

                setIsSubmitting: (loading) => set(
                    { isSubmitting: loading },
                    false,
                    'setIsSubmitting'
                ),

                setError: (error) => set(
                    { error },
                    false,
                    'setError'
                ),

                submitRegistration: async (finalData) => {
                    const state = get();
                    const completeData = { ...state.formData, ...finalData } as FormData;

                    set({ isSubmitting: true, error: null }, false, 'submitRegistration:start');

                    try {
                        const result = await AuthService.register(completeData);
                        if (result.success) {
                            toast.success('Account created!', {
                                description: 'Redirecting to login...',
                            });
                            // Reset form and clear persisted data
                            get().resetForm();
                            return true;
                        } else {
                            const errorMsg = 'Registration failed';
                            set({ error: errorMsg }, false, 'submitRegistration:error');
                            toast.error(errorMsg);
                            return false;
                        }
                    } catch (error: any) {
                        const errorMsg = error.message || 'Registration failed';
                        set({ error: errorMsg }, false, 'submitRegistration:error');
                        toast.error(errorMsg);
                        console.error('Registration error:', error);
                        return false;
                    } finally {
                        set({ isSubmitting: false }, false, 'submitRegistration:end');
                    }
                },

                resetForm: () => set(
                    { ...initialState },
                    false,
                    'resetForm'
                ),
            }),
            {
                name: 'register-storage',
                partialize: (state) => ({
                    formData: state.formData,
                    currentStep: state.currentStep,
                }),
            }
        ),
        { name: 'RegisterStore' }
    )
);
