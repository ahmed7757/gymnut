// lib/constants.ts

// App Configuration
export const APP_CONFIG = {
  name: "GymNut",
  description: "AI-Powered Fitness & Nutrition Tracker",
  version: "1.0.0",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
} as const;

// Authentication Configuration
export const AUTH_CONFIG = {
  sessionMaxAge: 30 * 24 * 60 * 60, // 30 days
  passwordMinLength: 8,
  passwordMaxLength: 32,
  resetTokenExpiry: 60 * 60 * 1000, // 1 hour
} as const;

// Validation Rules
export const VALIDATION_RULES = {
  email: {
    minLength: 1,
    maxLength: 255,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  password: {
    minLength: 8,
    maxLength: 32,
    requireUppercase: true,
    requireNumber: true,
    requireSpecialChar: true,
  },
  name: {
    minLength: 2,
    maxLength: 255,
    pattern: /^[a-zA-Z\s]{2,50}$/,
  },
  age: {
    min: 13,
    max: 120,
  },
  height: {
    min: 100, // cm
    max: 250, // cm
  },
  weight: {
    min: 30, // kg
    max: 300, // kg
  },
} as const;

// API Configuration
export const API_CONFIG = {
  baseUrl: "/api",
  timeout: 10000, // 10 seconds
  retryAttempts: 3,
} as const;

// Database Configuration
export const DB_CONFIG = {
  maxConnections: 10,
  connectionTimeout: 30000, // 30 seconds
  queryTimeout: 10000, // 10 seconds
} as const;

// Pagination Configuration
export const PAGINATION_CONFIG = {
  defaultPageSize: 20,
  maxPageSize: 100,
  defaultPage: 1,
} as const;

// File Upload Configuration
export const UPLOAD_CONFIG = {
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedImageTypes: ["image/jpeg", "image/png", "image/webp"],
  maxImageDimensions: {
    width: 1920,
    height: 1080,
  },
} as const;

// Email Configuration
export const EMAIL_CONFIG = {
  from: process.env.AUTH_GOOGLE_EMAIL || "noreply@gymnut.com",
  templates: {
    passwordReset: "password-reset",
    welcome: "welcome",
    verification: "email-verification",
  },
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  auth: {
    invalidCredentials: "Invalid email or password",
    userNotFound: "User not found",
    emailAlreadyExists: "Email already registered",
    passwordMismatch: "Passwords do not match",
    invalidToken: "Invalid or expired token",
    unauthorized: "Unauthorized access",
  },
  validation: {
    required: "This field is required",
    invalidEmail: "Please enter a valid email address",
    invalidPassword: "Password does not meet requirements",
    invalidName: "Name can only contain letters and spaces",
    invalidAge: "Age must be between 13 and 120",
    invalidHeight: "Height must be between 100 and 250 cm",
    invalidWeight: "Weight must be between 30 and 300 kg",
  },
  server: {
    internalError: "An internal server error occurred",
    serviceUnavailable: "Service temporarily unavailable",
    badRequest: "Invalid request",
    notFound: "Resource not found",
    conflict: "Resource conflict",
  },
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  auth: {
    registrationSuccess: "Registration successful",
    loginSuccess: "Login successful",
    passwordResetSent: "Password reset email sent",
    passwordResetSuccess: "Password reset successful",
    logoutSuccess: "Logout successful",
  },
  profile: {
    updateSuccess: "Profile updated successfully",
    deleteSuccess: "Account deleted successfully",
  },
  meal: {
    logSuccess: "Meal logged successfully",
    updateSuccess: "Meal updated successfully",
    deleteSuccess: "Meal deleted successfully",
  },
  workout: {
    logSuccess: "Workout logged successfully",
    updateSuccess: "Workout updated successfully",
    deleteSuccess: "Workout deleted successfully",
  },
} as const;

// UI Configuration
export const UI_CONFIG = {
  theme: {
    primary: "#4CAF50",
    secondary: "#2196F3",
    success: "#4CAF50",
    warning: "#FF9800",
    error: "#F44336",
    info: "#2196F3",
  },
  animation: {
    duration: 200,
    easing: "ease-in-out",
  },
  responsive: {
    mobile: 768,
    tablet: 1024,
    desktop: 1280,
  },
} as const;
