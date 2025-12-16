import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface LoginState {
    email: string;
    password: string;
    remember: boolean;
    showPassword: boolean;
    isLoading: boolean;
    error: string | null;
}

interface LoginActions {
    setEmail: (email: string) => void;
    setPassword: (password: string) => void;
    setRemember: (remember: boolean) => void;
    setShowPassword: (showPassword: boolean) => void;
    setIsLoading: (isLoading: boolean) => void;
    setError: (error: string | null) => void;
    toggleShowPassword: () => void;
    resetForm: () => void;
    clearError: () => void;
}

type LoginStore = LoginState & LoginActions;

const initialState: LoginState = {
    email: '',
    password: '',
    remember: false,
    showPassword: false,
    isLoading: false,
    error: null,
};

export const useLoginStore = create<LoginStore>()(
    devtools(
        persist(
            (set, get) => ({
                ...initialState,

                setEmail: (email) => set({ email }, false, 'setEmail'),

                setPassword: (password) => set({ password }, false, 'setPassword'),

                setRemember: (remember) => {
                    set({ remember }, false, 'setRemember');
                    // Clear email if remember is unchecked
                    if (!remember) {
                        set({ email: '' }, false, 'clearEmail');
                    }
                },

                setShowPassword: (showPassword) => set({ showPassword }, false, 'setShowPassword'),

                setIsLoading: (isLoading) => set({ isLoading }, false, 'setIsLoading'),

                setError: (error) => set({ error }, false, 'setError'),

                toggleShowPassword: () => set(
                    (state) => ({ showPassword: !state.showPassword }),
                    false,
                    'toggleShowPassword'
                ),

                clearError: () => set({ error: null }, false, 'clearError'),

                resetForm: () => set(
                    { ...initialState, remember: get().remember, email: get().remember ? get().email : '' },
                    false,
                    'resetForm'
                ),
            }),
            {
                name: 'login-storage',
                partialize: (state) => ({
                    remember: state.remember,
                    email: state.remember ? state.email : ''
                }),
            }
        ),
        { name: 'LoginStore' }
    )
);
