import { useMutation, useQueryClient } from "@tanstack/react-query"
import { authKeys } from "./auth.hooks"
import { googleOAuth } from "@/api"

export function useApplyDoctor() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: googleOAuth,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: authKeys.me() }),
    })
}