"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "@tanstack/react-form"
import { ArrowLeft, MailCheck } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "@/components/ui/toast"

import { getErrorMessage } from "@/lib/error"
import { VerifyemailSchema } from "@/validation"
import { useVerifyEmail } from "@/hooks"

const RESEND_SECONDS = 30

type Props = {
    email?: string
    className?: string
}

export function VerfiyEmail({ email = "", className }: Props) {
    const router = useRouter()
    const [seconds, setSeconds] = useState(RESEND_SECONDS)

    const { mutate: verify, isPending } = useVerifyEmail()

    useEffect(() => {
        if (seconds <= 0) return
        const t = setTimeout(() => setSeconds((s) => s - 1), 1000)
        return () => clearTimeout(t)
    }, [seconds])

    const form = useForm({
        defaultValues: { email, otp: "" },
        validators: { onSubmit: VerifyemailSchema },
        onSubmit: ({ value }) => {
            verify(
                { email: value.email, otp: value.otp },
                {
                    onSuccess: () => {
                        toast.add(
                        { 
                        type: "success", 
                        title: "Email verified" 
                        })
                        router.push("/login")
                    },
                    onError: (error) => {
                        form.setFieldValue("otp", "")
                        toast.add({
                            type: "error",
                            title: "Verification failed",
                            description: getErrorMessage(error),
                        })
                    },
                },
            )
        },
    })

    const handleResend = () => {
        setSeconds(RESEND_SECONDS)
    }

    return (
        <div
            className={cn(
                "flex w-full max-w-md flex-col items-center gap-6 text-center",
                className,
            )}
        >
            <div className="relative">
                <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl" />
                <div className="relative flex size-16 items-center justify-center rounded-full bg-primary/10 ring-8 ring-primary/5">
                    <MailCheck className="size-8 text-primary" />
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold">Check your email</h1>
                <p className="text-sm text-balance text-muted-foreground">
                    We sent a 6-digit verification code to
                    <br />
                    <span className="font-medium text-foreground">
                        {email || "your email address"}
                    </span>
                </p>
            </div>

            <form
                noValidate
                className="flex w-full flex-col items-center gap-5"
                onSubmit={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    void form.handleSubmit()
                }}
            >
                <form.Field name="otp">
                    {(field) => (
                        <div className="flex flex-col items-center gap-2">
                            <InputOTP
                                maxLength={6}
                                value={field.state.value}
                                onChange={(v) => field.handleChange(v)}
                                onBlur={field.handleBlur}
                                autoFocus
                            >
                                <InputOTPGroup>
                                    <InputOTPSlot index={0} className="size-11" />
                                    <InputOTPSlot index={1} className="size-11" />
                                    <InputOTPSlot index={2} className="size-11" />
                                </InputOTPGroup>
                                <InputOTPSeparator />
                                <InputOTPGroup>
                                    <InputOTPSlot index={3} className="size-11" />
                                    <InputOTPSlot index={4} className="size-11" />
                                    <InputOTPSlot index={5} className="size-11" />
                                </InputOTPGroup>
                            </InputOTP>

                            {field.state.meta.errors.length > 0 && (
                                <p role="alert" className="text-sm text-destructive">
                                    {String(
                                        (field.state.meta.errors[0] as { message?: string })
                                            ?.message ?? field.state.meta.errors[0],
                                    )}
                                </p>
                            )}
                        </div>
                    )}
                </form.Field>

                <Button
                    type="submit"
                    disabled={isPending}
                    className="h-12 w-full rounded-xl text-base font-semibold transition-all hover:-translate-y-0.5 active:translate-y-0"
                >
                    {isPending ? (
                        <>
                            <Spinner className="mr-2 size-4" />
                            Verifying...
                        </>
                    ) : (
                        "Verify email"
                    )}
                </Button>
            </form>

            <p className="text-sm text-muted-foreground">
                Didn&apos;t receive the code?{" "}
                {seconds > 0 ? (
                    <span className="font-medium text-foreground">
                        Resend in {seconds}s
                    </span>
                ) : (
                    <button
                        type="button"
                        onClick={handleResend}
                        className="font-medium text-primary underline-offset-4 hover:underline"
                    >
                        Resend code
                    </button>
                )}
            </p>

            <Link
                href="/login"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
                <ArrowLeft className="size-4" />
                Back to login
            </Link>

            <p className="px-6 text-xs text-muted-foreground">
                Check your spam folder if you can&apos;t find the email.
            </p>
        </div>
    )
}