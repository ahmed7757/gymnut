import { z } from "zod";

// Common validation patterns
export const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const passwordPattern =
  /^(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).{8,}$/;
export const namePattern = /^[a-zA-Z\s]{2,50}$/;

// Validation helpers
export function validateEmail(email: string): boolean {
  return emailPattern.test(email);
}

export function validatePassword(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }

  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain at least one number");
  }

  if (!/[^a-zA-Z0-9]/.test(password)) {
    errors.push("Password must contain at least one special character");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function validateName(name: string): boolean {
  return namePattern.test(name);
}

export function validateAge(age: number): boolean {
  return age >= 13 && age <= 120;
}

export function validateHeight(height: number): boolean {
  return height >= 100 && height <= 250; // cm
}

export function validateWeight(weight: number): boolean {
  return weight >= 30 && weight <= 300; // kg
}

// Zod schemas with custom error messages
export const emailSchema = z
  .string()
  .min(1, "Email is required")
  .email("Invalid email format")
  .max(255, "Email must be less than 255 characters")
  .regex(emailPattern, "Invalid email format");

export const passwordSchema = z
  .string()
  .min(1, "Password is required")
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Must contain at least one uppercase letter")
  .regex(/[0-9]/, "Must contain at least one number")
  .regex(/[^a-zA-Z0-9]/, "Must contain at least one special character")
  .max(32, "Password must be less than 32 characters");

export const nameSchema = z
  .string()
  .min(1, "Name is required")
  .min(2, "Name must be at least 2 characters")
  .max(255, "Name must be less than 255 characters")
  .regex(namePattern, "Name can only contain letters and spaces");

export const ageSchema = z
  .number()
  .min(13, "Age must be at least 13")
  .max(120, "Age must be less than 120");

export const heightSchema = z
  .number()
  .min(100, "Height must be at least 100 cm")
  .max(250, "Height must be less than 250 cm");

export const weightSchema = z
  .number()
  .min(30, "Weight must be at least 30 kg")
  .max(300, "Weight must be less than 300 kg");

// Form validation helpers
export function validateFormData<T extends Record<string, any>>(
  data: T,
  schema: z.ZodSchema<T>
): { isValid: boolean; errors: Record<string, string> } {
  const result = schema.safeParse(data);

  if (result.success) {
    return { isValid: true, errors: {} };
  }

  const errors: Record<string, string> = {};
  result.error.issues.forEach((issue) => {
    const field = issue.path.join(".");
    errors[field] = issue.message;
  });

  return { isValid: false, errors };
}

// Async validation helpers
export async function validateAsync<T extends Record<string, any>>(
  data: T,
  schema: z.ZodSchema<T>
): Promise<{ isValid: boolean; errors: Record<string, string> }> {
  try {
    await schema.parseAsync(data);
    return { isValid: true, errors: {} };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      error.issues.forEach((issue) => {
        const field = issue.path.join(".");
        errors[field] = issue.message;
      });
      return { isValid: false, errors };
    }
    throw error;
  }
}
