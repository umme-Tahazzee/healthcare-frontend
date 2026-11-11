"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { getMe, googleOAuth, userLogin, userLogout, userRegister } from "@/api"

export const authKeys = {
    all: ["auth"] as const,
    me: () => [...authKeys.all, "me"] as const,
}

export function useGetMe() {
    return useQuery({
        queryKey: authKeys.me(),
        queryFn: getMe,
        select: (res) => res.data, // component e directly User pabe
        retry: false, // 401 e retry kore lav nai
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
    })
}

export function useRegister() {
    return useMutation({
        mutationFn: userRegister,
    })
}

export function useLogin() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: userLogin,
        onSuccess: () => {
            // login er por fresh user data fetch hobe
            return queryClient.invalidateQueries({ queryKey: authKeys.me() })
        },
    })
}

export function useGoogleOAuth() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: googleOAuth,
        onSuccess: () => {
            return queryClient.invalidateQueries({ queryKey: authKeys.me() })
        },
    })
}

export function useLogout() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: userLogout,
        onSuccess: () => {
            // sob cache clear, noile next user purono user er data dekhte pare
            queryClient.clear()
        },
    })
}