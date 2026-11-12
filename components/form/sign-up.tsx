"use client"

import type { ComponentProps } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm, type AnyFieldApi } from "@tanstack/react-form"
import type { z } from "zod"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "@/components/ui/toast"
import GoogleLoginComponents from "@/components/modules/google-login/GoogleLoginComponents"
import loginImage from "@/app/assests/img/authentication/doctor.jpg"
import { useRegister } from "@/hooks"
import { getErrorMessage } from "@/lib/error"
import { SignupZodSchema } from "@/validation"

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */

// Form state holds the raw (pre-transform) values, so use the schema's input type.
type SignupValues = z.input<typeof SignupZodSchema>

const DEFAULT_VALUES: SignupValues = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    contactNumber: "",
}

/* -------------------------------------------------------------------------- */
/*                              Reusable components                           */
/* -------------------------------------------------------------------------- */

function FieldError({ field }: { field: AnyFieldApi }) {
    const { isTouched, isValid, errors } = field.state.meta
    if (!isTouched || isValid) return null

    // Show only the first error to keep the UI clean.
    const first = errors[0]
    const message =
        typeof first === "string" ? first : (first as { message?: string })?.message
    if (!message) return null

    return (
        <p role="alert" className="text-sm text-destructive">
            {message}
        </p>
    )
}

type FormInputProps = {
    field: AnyFieldApi
    label: string
    description?: string
} & Omit<ComponentProps<typeof Input>, "id" | "name" | "value" | "onBlur" | "onChange">

function FormInput({ field, label, description, ...inputProps }: FormInputProps) {
    const { isTouched, isValid } = field.state.meta

    return (
        <Field>
            <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
            <Input
                {...inputProps}
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                aria-invalid={isTouched && !isValid}
            />
            <FieldError field={field} />
            {description && <FieldDescription>{description}</FieldDescription>}
        </Field>
    )
}

/* -------------------------------------------------------------------------- */
/*                                 Signup form                                */
/* -------------------------------------------------------------------------- */

export function SignupForm({ className, ...props }: ComponentProps<"div">) {
    const router = useRouter()
    const { mutateAsync: registerUser, isPending } = useRegister()

    const form = useForm({
        defaultValues: DEFAULT_VALUES,
        validators: {
            onChange: SignupZodSchema,
        },
        onSubmit: async ({ value }) => {
            
            const { confirmPassword: _confirmPassword, ...payload } =
                SignupZodSchema.parse(value)

            try {
                await registerUser(payload)

                toast.add({ type: "success", title: "Account created" })
                router.push(`/account-verfiy?email=${encodeURIComponent(payload.email)}`)
            } catch (error) {
                toast.add({
                    type: "error",
                    title: "Signup failed",
                    description: getErrorMessage(error),
                })
            }
        },
    })

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card className="overflow-hidden p-0">
                <CardContent className="grid p-0 md:grid-cols-2">
                    <form
                        className="p-6 md:p-8"
                        noValidate
                        onSubmit={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            void form.handleSubmit()
                        }}
                    >
                        <FieldGroup>
                            <header className="flex flex-col items-center gap-2 text-center">
                                <h1 className="text-2xl font-bold">Create your account</h1>
                                <p className="text-sm text-balance text-muted-foreground">
                                    Enter your details below to create your account
                                </p>
                            </header>

                            <form.Field name="name">
                                {(field) => (
                                    <FormInput
                                        field={field}
                                        label="Full name"
                                        type="text"
                                        placeholder="John Doe"
                                        autoComplete="name"
                                    />
                                )}
                            </form.Field>

                            <form.Field name="email">
                                {(field) => (
                                    <FormInput
                                        field={field}
                                        label="Email"
                                        type="email"
                                        placeholder="m@example.com"
                                        autoComplete="email"
                                        description="We'll use this to contact you. We will not share your email with anyone else."
                                    />
                                )}
                            </form.Field>

                            <form.Field name="contactNumber">
                                {(field) => (
                                    <FormInput
                                        field={field}
                                        label="Contact number (optional)"
                                        type="tel"
                                        placeholder="01XXXXXXXXX"
                                        autoComplete="tel"
                                    />
                                )}
                            </form.Field>

                            <Field>
                                <Field className="grid grid-cols-2 gap-4">
                                    <form.Field name="password">
                                        {(field) => (
                                            <FormInput
                                                field={field}
                                                label="Password"
                                                type="password"
                                                autoComplete="new-password"
                                            />
                                        )}
                                    </form.Field>

                                    <form.Field name="confirmPassword">
                                        {(field) => (
                                            <FormInput
                                                field={field}
                                                label="Confirm password"
                                                type="password"
                                                autoComplete="new-password"
                                            />
                                        )}
                                    </form.Field>
                                </Field>
                                <FieldDescription>
                                    At least 8 characters, with one uppercase letter, one
                                    lowercase letter, and one number.
                                </FieldDescription>
                            </Field>

                            <Field>
                                <form.Subscribe selector={(s) => s.canSubmit}>
                                    {(canSubmit) => (
                                        <Button
                                            type="submit"
                                            disabled={!canSubmit || isPending}
                                            className="h-12 w-full rounded-xl text-base font-semibold transition-all hover:-translate-y-0.5 active:translate-y-0"
                                        >
                                            {isPending ? (
                                                <>
                                                    <Spinner className="mr-2 size-4" />
                                                    Creating account...
                                                </>
                                            ) : (
                                                "Create account"
                                            )}
                                        </Button>
                                    )}
                                </form.Subscribe>
                            </Field>

                            <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                                Or continue with
                            </FieldSeparator>

                            <GoogleLoginComponents />

                            <FieldDescription className="text-center">
                                Already have an account? <Link href="/login">Sign in</Link>
                            </FieldDescription>
                        </FieldGroup>
                    </form>

                    <div className="relative hidden bg-muted md:block">
                        <Image
                            src={loginImage}
                            alt="Doctor illustration"
                            fill
                            priority
                            sizes="(min-width: 768px) 50vw, 0px"
                            className="object-cover dark:brightness-[0.3] dark:grayscale"
                        />
                    </div>
                </CardContent>
            </Card>

            <FieldDescription className="px-6 text-center">
                By clicking continue, you agree to our{" "}
                <Link href="/terms">Terms of Service</Link> and{" "}
                <Link href="/privacy">Privacy Policy</Link>.
            </FieldDescription>
        </div>
    )
}