import z from "zod"
import { confirmPasswordSchema, emailSchema, passwordSchema } from "./shared.validation"

export const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

const fileArray = (max: number) =>
  z
    .array(z.file())
    .max(max, `Maximum ${max} file(s) allowed`)
    .refine(
      (files) => files.every((f) => f.size <= MAX_FILE_SIZE),
      "Each file must be 5MB or smaller"
    )

export const DoctorApplyZodSchema = z
  .object({
    name: z.string().trim().min(3, "Name must be at least 3 characters long"),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: confirmPasswordSchema,

    specialization: z.string().trim().optional(),
    qualifications: z.string().trim().optional(),
    licenseNumber: z.string().trim().optional(),
    bio: z.string().trim().optional(),

    // input theke empty string ashle undefined, na hole number
    experienceYear: z.preprocess(
      (v) => (v === "" ? undefined : v),
      z.coerce.number().int().min(0, "Cannot be negative").optional()
    ),
    consultationFee: z.preprocess(
      (v) => (v === "" ? undefined : v),
      z.coerce.number().min(0, "Cannot be negative").optional()
    ),

    resume: fileArray(1),
    additionalFile: fileArray(5),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })