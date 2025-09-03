// types/index.ts
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

export interface AuthStoreActions {
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setError: (error: string) => void;
  setLoading: (loading: boolean) => void;
  setShowPassword: (showPassword: boolean) => void;
  setRemember: (remember: boolean) => void;
}

export interface RegisterStoreActions extends AuthStoreActions {
  setName: (name: string) => void;
  setGender: (gender: string) => void;
  setConfirmPassword: (confirmPassword: string) => void;
  setFormError: (formError: string | null) => void;
  setShowConfirmPassword: (showConfirmPassword: boolean) => void;
  setPasswordFocused: (passwordFocused: boolean) => void;
}

export interface ForgotPasswordActions {
  setEmail: (email: string) => void;
  setError: (error: string) => void;
  setLoading: (loading: boolean) => void;
  setToken: (token: string) => void;
  setIsLoading: (isLoading: boolean) => void;
  setValidEmail: (validEmail: boolean) => void;
  setSuccess: (success: boolean) => void;
  setEmailFocus: (emailFocus: boolean) => void;
}

export interface PasswordStrength {
  label: string;
  color: string;
  textColor: string;
}

export interface PasswordRequirement {
  label: string;
  valid: boolean;
  icon: string;
}
