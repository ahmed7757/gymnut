// types/index.ts

// --- Domain Entities ---
export interface User {
  id: string;
  email: string;
  name?: string | null;
  image?: string | null;
  gender?: "MALE" | "FEMALE";
  goal?: "LOSE" | "MAINTAIN" | "GAIN";
  // Add other user fields as needed
}

// --- API Responses ---
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  statusCode: number;
}

// --- Form States (Legacy/Existing) ---
// Kept for backward compatibility if needed, but we might move to Shadcn Form logic
export interface AuthFormState {
  email: string;
  password: string;
  error: string;
  loading: boolean;
  showPassword: boolean;
  remember: boolean;
}

export interface RegisterFormState extends AuthFormState {
  name: string;
  gender: string;
  confirmPassword: string;
  formError: string | null;
  showConfirmPassword: boolean;
  passwordFocused: boolean;
}

export interface ForgotPasswordState {
  email: string;
  error: string;
  loading: boolean;
  token: string;
  isLoading: boolean;
  validEmail: boolean;
  success: boolean;
  emailFocus: boolean;
}

// --- Store Actions (Legacy/Existing) ---
export interface AuthStoreActions {
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setError: (error: string) => void;
  setLoading: (loading: boolean) => void;
  setShowPassword: (showPassword: boolean) => void;
  setRemember: (remember: boolean) => void;
}
