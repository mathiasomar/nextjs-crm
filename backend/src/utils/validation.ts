import { body } from "express-validator";
import { z } from "zod";

// Zod schemas for type safety
export const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  name: z.string().min(2, "First name must be at least 2 characters"),
  role: z.enum(["AGENT", "MANAGER", "ADMIN", "SUPPORT"]).optional(),
  department: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
    message: "Invalid email address!",
  }),
  password: z.string().min(1, "Password is required"),
});

// Express validator middleware
export const validateRegister = [
  body("email").isEmail().normalizeEmail(),
  body("password").isLength({ min: 8 }),
  body("firstName").trim().notEmpty(),
  body("lastName").trim().notEmpty(),
];

export const validateLogin = [
  body("email").isEmail().normalizeEmail(),
  body("password").notEmpty(),
];
