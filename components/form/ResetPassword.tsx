"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "@tanstack/react-form"
import { ArrowLeft, Eye, EyeOff, KeyRound, Lock, Mail } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { FieldError } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "@/components/ui/toast"

import { getErrorMessage } from "@/lib/error"
import { ResetPasswordSchema } from "@/validation"
import { useResetPassword } from "@/hooks"

const RESEND_SECONDS = 30

type Props = {
    email?: string
    className?: string
}

export function ResetPassword({ email = "", className }: Props) {
    const router = useRouter()
    const [showPassword, setShowPassword] = useState(false)
    const [seconds, setSeconds] = useState(RESEND_SECONDS)

    const { mutate: resetPassword, isPending } = useResetPassword()

    useEffect(() => {
        if (seconds <= 0) return
        const t = setTimeout(() => setSeconds((s) => s - 1), 1000)
        return () => clearTimeout(t)
    }, [seconds])

    const form = useForm({
        defaultValues: { email, newPassword: "", confirmPassword: "", otp: "" },
        validators: {
            onChange: ResetPasswordSchema,
            onSubmit: ResetPasswordSchema
        },
        onSubmitInvalid: ({ value, formApi }) => {
            console.log("Validation Failed!", formApi.state.errors, value)
        },
        onSubmit: ({ value }) => {
            resetPassword(
                {
                    email: value.email,
                    newPassword: value.newPassword,
                    otp: value.otp,
                },
                {
                    onSuccess: () => {
                        toast.add({
                            type: "success",
                            title: "Password updated",
                            description: "You can now sign in with your new password.",
                        })
                        router.replace("/login?reset=success")
                    },
                    onError: (error) => {
                        form.setFieldValue("otp", "")
                        toast.add({
                            type: "error",
                            title: "Couldn't reset password",
                            description: getErrorMessage(error),
                        })
                    },
                },
            )
        },
    })

    const handleResend = () => {
        // TODO: call the "send reset code" endpoint here
        setSeconds(RESEND_SECONDS)
    }

    return (
        <div className={cn("flex w-full max-w-md flex-col items-center gap-6", className)}>
            {/* Icon */}
            <div className="relative">
                <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl" />
                <div className="relative flex size-16 items-center justify-center rounded-full bg-primary/10 ring-8 ring-primary/5">
                    <KeyRound className="size-8 text-primary" />
                </div>
            </div>

            {/* Heading */}
            <div className="flex flex-col gap-2 text-center">
                <h1 className="text-2xl font-bold tracking-tight">Reset your password</h1>
                <p className="text-sm text-balance text-muted-foreground">
                    {email ? (
                        <>
                            Enter the 6-digit code we sent to
                            <br />
                            <span className="font-medium text-foreground">{email}</span>
                        </>
                    ) : (
                        "Enter the 6-digit code from your email and choose a new password."
                    )}
                </p>
            </div>

            <form
                noValidate
                className="flex w-full flex-col gap-5"
                onSubmit={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    form.handleSubmit()
                }}
            >
                {/* Email — only asked for when we don't already know it */}
                {!email && (
                    <form.Field name="email">
                        {(field) => {
                            const showError =
                                (field.state.meta.isTouched || form.state.submissionAttempts > 0) &&
                                !field.state.meta.isValid
                            return (
                                <div className="flex flex-col gap-2">
                                    <label htmlFor={field.name} className="text-sm font-medium">
                                        Email
                                    </label>
                                    <div className="relative">
                                        <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            id={field.name}
                                            name={field.name}
                                            type="email"
                                            autoComplete="email"
                                            placeholder="you@example.com"
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            aria-invalid={showError}
                                            className="h-12 rounded-xl bg-muted/40 pl-10 transition-colors focus-visible:bg-background"
                                        />
                                    </div>
                                    {showError && <FieldError errors={field.state.meta.errors} />}
                                </div>
                            )
                        }}
                    </form.Field>
                )}

                {/* Verification code */}
                <form.Field name="otp">
                    {(field) => {
                        const showError = !field.state.meta.isValid
                        return (
                            <div className="flex flex-col gap-2">
                                <label htmlFor={field.name} className="text-sm font-medium">
                                    Verification code
                                </label>
                                <div className="flex justify-center">
                                    <InputOTP
                                        id={field.name}
                                        maxLength={6}
                                        inputMode="numeric"
                                        autoComplete="one-time-code"
                                        value={field.state.value}
                                        onChange={(v) => field.handleChange(v)}
                                        onBlur={field.handleBlur}
                                        aria-invalid={showError}
                                        autoFocus={Boolean(email)}
                                    >
                                        <InputOTPGroup>
                                            <InputOTPSlot index={0} className="size-12" />
                                            <InputOTPSlot index={1} className="size-12" />
                                            <InputOTPSlot index={2} className="size-12" />
                                        </InputOTPGroup>
                                        <InputOTPSeparator />
                                        <InputOTPGroup>
                                            <InputOTPSlot index={3} className="size-12" />
                                            <InputOTPSlot index={4} className="size-12" />
                                            <InputOTPSlot index={5} className="size-12" />
                                        </InputOTPGroup>
                                    </InputOTP>
                                </div>
                                {showError && (
                                    <FieldError
                                        className="text-center"
                                        errors={field.state.meta.errors}
                                    />
                                )}
                            </div>
                        )
                    }}
                </form.Field>

                {/* New password */}
                <form.Field name="newPassword">
                    {(field) => {
                        const showError =
                            field.state.meta.isTouched && !field.state.meta.isValid
                        return (
                            <div className="flex flex-col gap-2">
                                <label htmlFor={field.name} className="text-sm font-medium">
                                    New password
                                </label>
                                <div className="relative">
                                    <Lock className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        id={field.name}
                                        name={field.name}
                                        type={showPassword ? "text" : "password"}
                                        autoComplete="new-password"
                                        placeholder="Create a new password"
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        aria-invalid={showError}
                                        className="h-12 rounded-xl bg-muted/40 pl-10 pr-11 transition-colors focus-visible:bg-background"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((p) => !p)}
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                        aria-pressed={showPassword}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="size-4" />
                                        ) : (
                                            <Eye className="size-4" />
                                        )}
                                    </button>
                                </div>
                                {showError && <FieldError errors={field.state.meta.errors} />}
                            </div>
                        )
                    }}
                </form.Field>

                <form.Field name="confirmPassword">
                    {(field) => {
                        const showError =
                            (field.state.meta.isTouched || form.state.submissionAttempts > 0) &&
                            !field.state.meta.isValid
                        return (
                            <div className="flex flex-col gap-2">
                                <label htmlFor={field.name} className="text-sm font-medium">
                                    Confirm password
                                </label>
                                <div className="relative">
                                    <Lock className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        id={field.name}
                                        name={field.name}
                                        type={showPassword ? "text" : "password"}
                                        autoComplete="new-password"
                                        placeholder="Confirm your new password"
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        aria-invalid={showError}
                                        className="h-12 rounded-xl bg-muted/40 pl-10 pr-11 transition-colors focus-visible:bg-background"
                                    />
                                </div>
                                {showError && <FieldError errors={field.state.meta.errors} />}
                            </div>
                        )
                    }}
                </form.Field>

                <Button
                    type="submit"
                    disabled={isPending}
                    className="mt-1 h-12 w-full rounded-xl text-base font-semibold transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:hover:translate-y-0"
                >
                    {isPending ? (
                        <>
                            <Spinner className="mr-2 size-4" />
                            Resetting password...
                        </>
                    ) : (
                        "Reset password"
                    )}
                </Button>
            </form>

            {/* Resend + help */}
            <div className="flex flex-col items-center gap-1 text-center">
                <p className="text-sm text-muted-foreground">
                    Didn&apos;t receive the code?{" "}
                    {seconds > 0 ? (
                        <span className="font-medium tabular-nums text-foreground">
                            Resend in {seconds}s
                        </span>
                    ) : (
                        <button
                            type="button"
                            onClick={handleResend}
                            className="rounded-sm font-medium text-primary 
                            underline-offset-4 hover:underline focus-visible:outline-none
                             focus-visible:ring-2 focus-visible:ring-ring"
                        >
                            Resend code
                        </button>
                    )}
                </p>
                <p className="text-xs text-muted-foreground">
                    Check your spam folder if you can&apos;t find the email.
                </p>
            </div>

            <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-sm text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
                <ArrowLeft className="size-4" />
                Back to login
            </Link>
        </div>
    )
}