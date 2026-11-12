export type Role = "ADMIN" | "DOCTOR" | "PATIENT" // tomar Prisma enum onujayi change koro

export interface User {
    id: string
    name: string
    email: string
    role: Role
}

export interface LoginPayload {
    email: string
    password: string
}

export interface RegisterPayload extends LoginPayload {
    name: string
}

export interface GoogleOAuthPayload {
    idToken: string
}

export interface VerifyemailPayload {
      email : string,
      otp : string
}
export interface ResetPasswordPayload {
   email : string
   newPassword : string
   otp : string
}
// Backend er response shape onujayi adjust koro
export interface ApiResponse<T> {
    success: boolean
    message: string
    data: T
}