"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
    getMe, googleOAuth, userForgotPassword, userLogin,
    userLogout, userRegister, userResetPassword, userVerifyEmail,
} from "@/api"

export const authKeys = {
    all: ["auth"] as const,
    me: () => [...authKeys.all, "me"] as const,
}

export function useGetMe() {
    return useQuery({
        queryKey: authKeys.me(),
        queryFn: getMe,
        select: (res) => res.data,
        retry: false,
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
    })
}

export function useRegister() {
    return useMutation({ mutationFn: userRegister })
}

export function useLogin() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: userLogin,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: authKeys.me() }),
    })
}

export function useGoogleOAuth() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: googleOAuth,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: authKeys.me() }),
    })
}

export function useVerifyEmail() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: userVerifyEmail,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: authKeys.me() }),
    })
}

export function useForgotPassword() {
    return useMutation({ mutationFn: userForgotPassword })
}

export function useResetPassword() {
    return useMutation({ mutationFn: userResetPassword })
}

export function useLogout() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: userLogout,
        onSettled: () => {
            queryClient.setQueryData(authKeys.me(), null)
            queryClient.clear()
        },
    })
}