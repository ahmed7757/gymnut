import { object, string } from "zod"

export const signSchema = object({
    email: string()
        .min(1, "Email is required")
        .email("Invalid email")
        .max(255, "Email must be less than 255 characters")
        .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email format"),
    password: string()
        .min(1, "Password is required")
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Must contain at least one uppercase letter")
        .regex(/[0-9]/, "Must contain at least one number")
        .regex(/[^a-zA-Z0-9]/, "Must contain at least one special character")
        .max(32, "Password must be less than 32 characters"),
    name: string()
        .min(1, "Name is required")
        .min(2, "Name must be at least 2 characters")
        .max(255, "Name must be less than 255 characters"),
    gender: string()
        .min(1, "Gender is required")
        .min(2, "Gender must be at least 2 characters")
        .max(255, "Gender must be less than 255 characters"),
})

export const loginSchema = object({
    email: string()
        .min(1, "Email is required")
        .email("Invalid email")
        .max(255, "Email must be less than 255 characters")
        .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email format"),
    password: string()
        .min(1, "Password is required")
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Must contain at least one uppercase letter")
        .regex(/[0-9]/, "Must contain at least one number")
        .regex(/[^a-zA-Z0-9]/, "Must contain at least one special character")
        .max(32, "Password must be less than 32 characters"),
})