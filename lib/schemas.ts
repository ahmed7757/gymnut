// lib/schemas.ts
import { z } from "zod";
import { emailSchema, passwordSchema, nameSchema } from "./validation";

export const registerSchema = z
  .object({
    name: nameSchema,
    gender: z.enum(["MALE", "FEMALE"], {
      message: "Please select a valid gender",
    }),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
    // Added for full registration wizard
    age: z.number().min(13).max(120).optional(),
    height: z.number().min(100).max(250).optional(),
    weight: z.number().min(30).max(300).optional(),
    goal: z.enum(["LOSE", "MAINTAIN", "GAIN"]).default("MAINTAIN"),
    diseases: z
      .array(
        z.enum(["DIABETES", "HYPERTENSION", "HEART_DISEASE", "ASTHMA", "NONE"])
      )
      .default(["NONE"]),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
  remember: z.union([z.boolean(), z.string()]).transform((val) => {
    if (typeof val === 'boolean') return val;
    return val === 'true' || val === 'on';
  }).optional(),
});

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, "Token is required"),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export const updateProfileSchema = z.object({
  name: nameSchema.optional(),
  age: z.number().min(13).max(120).optional(),
  height: z.number().min(100).max(250).optional(),
  weight: z.number().min(30).max(300).optional(),
  goal: z.enum(["LOSE", "MAINTAIN", "GAIN"]).optional(),
  diseases: z
    .array(
      z.enum(["DIABETES", "HYPERTENSION", "HEART_DISEASE", "ASTHMA", "NONE"])
    )
    .optional(),
  image: z.string().url().optional(),
});

export const mealLogSchema = z.object({
  foodName: z.string().min(1, "Food name is required"),
  foodImage: z.string().optional(),
  category: z.enum(["BREAKFAST", "LUNCH", "DINNER", "SNACK"]).default("LUNCH"),
  quantity: z.number().positive().optional(),
  portion: z.string().optional(),
  calories: z.number().positive(),
  protein: z.number().min(0),
  carbs: z.number().min(0),
  fat: z.number().min(0),
  fiber: z.number().min(0).optional(),
  sugar: z.number().min(0).optional(),
  sodium: z.number().min(0).optional(),
  foodData: z.record(z.string(), z.any()).optional(),
});

export const workoutSchema = z.object({
  type: z.string().min(1, "Workout type is required"),
  exercises: z.array(
    z.object({
      name: z.string(),
      sets: z.number().positive(),
      reps: z.number().positive(),
      weight: z.number().min(0).optional(),
      duration: z.number().positive().optional(),
    })
  ),
  duration: z.number().positive().optional(),
  calories: z.number().min(0).optional(),
});
