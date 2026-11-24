import z from "zod"
import { confirmPasswordSchema, emailSchema, passwordSchema } from "./shared.validation"

export const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

export const ACCEPTED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/png',
  'image/jpeg',

]

export function isAcceptedFileSize(fileSize: number) {
  return fileSize <= MAX_FILE_SIZE
}

export function isAcceptedFileType(fileType: string) {
  return ACCEPTED_FILE_TYPES.includes(fileType)
}


const requiredFile = (label: string) =>
  z
    .file({ error: `${label} is required` })
    .max(MAX_FILE_SIZE, "File must be 5MB or smaller")
    .mime(ACCEPTED_FILE_TYPES, "Only PDF, DOC, DOCX, PNG, JPG files are allowed")

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

    resume: requiredFile("Resume"),
    additionalFile: requiredFile("Additional file").nullable().optional(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })