
/* -------------------------------------------------------------------------- */
/*                               Shared fields                                */
/* -------------------------------------------------------------------------- */

import z from "zod";

export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .pipe(z.email("Please provide a valid email address"));

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[0-9]/, "Password must contain at least one number");

export const otpSchema = z
  .string()
  .length(6, "Enter the 6-digit code")
  .regex(/^\d+$/, "Digits only");

export const confirmPasswordSchema = z.string().min(1, "Please confirm your password");