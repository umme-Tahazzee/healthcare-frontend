"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "@tanstack/react-form"
import { ArrowLeft, KeyRound, Mail } from "lucide-react"

import { Button } from "@/components/ui/button"
import { FieldError } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "@/components/ui/toast"
import { useForgotPassword } from "@/hooks"
import { getErrorMessage } from "@/lib/error"
import { ForgotPasswordSchema } from "@/validation"

export function ForgotPasswordForm() {
  const router = useRouter()
  const { mutate: requestReset, isPending } = useForgotPassword()
  
  const form = useForm({
    defaultValues: { email: "" },
    validators: { onChange: ForgotPasswordSchema },
    onSubmit: ({ value }) => {
      const { email } = ForgotPasswordSchema.parse(value)

      requestReset(
        { email },
        {
          onSuccess: (res) => {
              console.log("LOGIN SUCCESS:", res)
            toast.add({
              type: "success",
              title: "Check your email",
              description: "If an account exists, we've sent a reset code.",
            })
            router.push(`/reset-password?email=${encodeURIComponent(email)}`)
          },
          onError: (error) =>
            toast.add({
              type: "error",
              title: "Request failed",
              description: getErrorMessage(error),
            }),
        },
      )
    },
  })

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-8">
      <header className="space-y-4">
        <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <KeyRound className="size-6" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Forgot password?</h1>
          <p className="text-sm text-muted-foreground">
            Enter the email linked to your account and we&apos;ll send you a
            6-digit code to reset your password.
          </p>
        </div>
      </header>

      <form
        noValidate
        className="space-y-5"
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          void form.handleSubmit()
        }}
      >
        <form.Field name="email">
          {(field) => {
            const showError = field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <div className="space-y-2">
                <label htmlFor={field.name} className="text-sm font-medium">
                  Email
                </label>
                <div className=" relative">
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
                    className="h-12 rounded-xl bg-muted/40 pl-10 transition-all focus-visible:bg-background"
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
          className="h-12 w-full rounded-xl text-base font-semibold transition-all hover:-translate-y-0.5 active:translate-y-0"
        >
          {isPending ? (
            <>
              <Spinner className="mr-2 size-4" />
              Sending code...
            </>
          ) : (
            "Send reset code"
          )}
        </Button>
      </form>

      <Link
        href="/login"
        className="inline-flex items-center justify-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to login
      </Link>
    </div>
  )
}