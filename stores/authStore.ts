// stores/authStore.ts
import { create } from "zustand";
import {
  AuthFormState,
  RegisterFormState,
  ForgotPasswordState,
  AuthStoreActions,
  RegisterStoreActions,
  ForgotPasswordActions,
} from "@/types";

export const useLoginStore = create<AuthFormState & AuthStoreActions>(
  (set) => ({
    email: "",
    password: "",
    error: "",
    loading: false,
    showPassword: false,
    remember: false,
    setEmail: (email) => set({ email }),
    setPassword: (password) => set({ password }),
    setError: (error) => set({ error }),
    setLoading: (loading) => set({ loading }),
    setShowPassword: (showPassword) => set({ showPassword }),
    setRemember: (remember) => set({ remember }),
  })
);

export const useRegisterStore = create<
  RegisterFormState & RegisterStoreActions
>((set) => ({
  email: "",
  password: "",
  name: "",
  gender: "",
  confirmPassword: "",
  error: "",
  formError: null,
  loading: false,
  showPassword: false,
  showConfirmPassword: false,
  passwordFocused: false,
  setEmail: (email) => set({ email }),
  setPassword: (password) => set({ password }),
  setName: (name) => set({ name }),
  setGender: (gender) => set({ gender }),
  setConfirmPassword: (confirmPassword) => set({ confirmPassword }),
  setError: (error) => set({ error }),
  setFormError: (formError) => set({ formError }),
  setLoading: (loading) => set({ loading }),
  setShowPassword: (showPassword) => set({ showPassword }),
  setShowConfirmPassword: (showConfirmPassword) => set({ showConfirmPassword }),
  setPasswordFocused: (passwordFocused) => set({ passwordFocused }),
}));

export const useForgotPasswordStore = create<
  ForgotPasswordState & ForgotPasswordActions
>((set) => ({
  email: "",
  error: "",
  loading: false,
  token: "",
  isLoading: false,
  validEmail: false,
  success: false,
  emailFocus: false,
  setEmail: (email) => set({ email }),
  setError: (error) => set({ error }),
  setLoading: (loading) => set({ loading }),
  setToken: (token) => set({ token }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setValidEmail: (validEmail) => set({ validEmail }),
  setSuccess: (success) => set({ success }),
  setEmailFocus: (emailFocus) => set({ emailFocus }),
}));
