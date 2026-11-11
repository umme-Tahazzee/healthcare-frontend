import apiClient from "@/lib/apiClient"
import type {
    ApiResponse,
    GoogleOAuthPayload,
    LoginPayload,
    RegisterPayload,
    User,
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