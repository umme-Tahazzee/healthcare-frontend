import apiClient from "@/lib/apiClient"
import type {
    ApiResponse,
    GoogleOAuthPayload,
    LoginPayload,
    RegisterPayload,
    ResetPasswordPayload,
    User,
    VerifyemailPayload,
} from "@/types/auth"

export function userRegister(payload: RegisterPayload) {
    return apiClient<ApiResponse<User>>("/auth/register", {
        method: "POST",
        body: payload,
    })
}

export function userLogin(payload: LoginPayload) {
    return apiClient<ApiResponse<User>>("/auth/login", {
        method: "POST",
        body: payload,
    })
}

export function getMe() {
    return apiClient<ApiResponse<User>>("/auth/me", {
        method: "GET",
    })
}

export function userLogout() {
    return apiClient<ApiResponse<null>>("/auth/logout", {
        method: "POST",
    })
}

export function googleOAuth(payload: GoogleOAuthPayload) {
    return apiClient<ApiResponse<User>>("/auth/google", {
        method: "POST",
        body: payload,
    })
}

export function userVerifyEmail(payload: VerifyemailPayload) {
    return apiClient<ApiResponse<User>>("/auth/verify-email", {
        method: "POST",
        body: payload,
    })
}

export function userForgotPassword(payload: { email: string }) {
    return apiClient<ApiResponse<null>>("/auth/forgot-password", {
        method: "POST",
        body: payload,
    })
}

export function userResetPassword(payload: ResetPasswordPayload) {
    return apiClient<ApiResponse<null>>("/auth/reset-password", {
        method: "POST",
        body: payload,
    })
}