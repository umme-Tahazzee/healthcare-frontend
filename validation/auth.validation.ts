import { z } from "zod";

/* -------------------------------------------------------------------------- */
/*                               Shared fields                                */
/* -------------------------------------------------------------------------- */

const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .pipe(z.email("Please provide a valid email address"));

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[0-9]/, "Password must contain at least one number");

const otpSchema = z
  .string()
  .length(6, "Enter the 6-digit code")
  .regex(/^\d+$/, "Digits only");

const confirmPasswordSchema = z.string().min(1, "Please confirm your password");

/* -------------------------------------------------------------------------- */
/*                                   Signup                                   */
/* -------------------------------------------------------------------------- */

export const SignupZodSchema = z
  .object({
    name: z.string().trim().min(3, "Name must be at least 3 characters long"),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: confirmPasswordSchema,
    contactNumber: z
      .string()
      .trim()
      .refine(
        (v) => v === "" || /^(?:\+?88)?01[3-9]\d{8}$/.test(v),
        "Please provide a valid Bangladeshi phone number",
      )
      .optional()
      .transform((v) => v || undefined),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

/* -------------------------------------------------------------------------- */
/*                                    Login                                   */
/* -------------------------------------------------------------------------- */

export const LoginZodSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

/* -------------------------------------------------------------------------- */
/*                               Email verification                           */
/* -------------------------------------------------------------------------- */

export const VerifyemailSchema = z.object({
  email: emailSchema,
  otp: otpSchema,
});

/* -------------------------------------------------------------------------- */
/*                               Password recovery                            */
/* -------------------------------------------------------------------------- */

export const ForgotPasswordSchema = z.object({
  email: emailSchema,
});

export const ResetPasswordSchema = z
  .object({
    email: emailSchema,
    otp: otpSchema,
    newPassword: passwordSchema,
    confirmPassword: confirmPasswordSchema,
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */

// Form state = raw input values
export type SignupValues = z.input<typeof SignupZodSchema>;
export type LoginValues = z.input<typeof LoginZodSchema>;
export type VerifyEmailValues = z.input<typeof VerifyemailSchema>;
export type ForgotPasswordValues = z.input<typeof ForgotPasswordSchema>;
export type ResetPasswordValues = z.input<typeof ResetPasswordSchema>;

// API payloads = parsed output (after trim / transform)
export type SignupInput = z.output<typeof SignupZodSchema>;
export type LoginInput = z.output<typeof LoginZodSchema>;