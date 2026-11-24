"use client"

import type { ComponentProps } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm, type AnyFieldApi } from "@tanstack/react-form"

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
import { Textarea } from "@/components/ui/textarea"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "@/components/ui/toast"
import GoogleLoginComponents from "@/components/modules/google-login/GoogleLoginComponents"
import loginImage from "@/app/assests/img/authentication/doctor.jpg"
import { useRegister } from "@/hooks"
import { getErrorMessage } from "@/lib/error"
import { DoctorApplyZodSchema, MAX_FILE_SIZE } from "@/validation/doctor.validation"


/* -------------------------------------------------------------------------- */
/*                                Default values                              */
/* -------------------------------------------------------------------------- */

const DEFAULT_VALUES = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    specialization: "",
    qualifications: "",
    experienceYear: "",
    licenseNumber: "",
    consultationFee: "",
    bio: "",
    resume: [] as File[],
    additionalFile: [] as File[],
}

/* -------------------------------------------------------------------------- */
/*                              Reusable components                           */
/* -------------------------------------------------------------------------- */

function FieldError({ field }: { field: AnyFieldApi }) {
    const { isTouched, isValid, errors } = field.state.meta
    if (!isTouched || isValid) return null

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

type BaseFieldProps = {
    field: AnyFieldApi
    label: string
    description?: string
}

type FormInputProps = BaseFieldProps &
    Omit<ComponentProps<typeof Input>, "id" | "name" | "value" | "onBlur" | "onChange">

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

type FormTextareaProps = BaseFieldProps &
    Omit<ComponentProps<typeof Textarea>, "id" | "name" | "value" | "onBlur" | "onChange">

function FormTextarea({ field, label, description, ...props }: FormTextareaProps) {
    const { isTouched, isValid } = field.state.meta

    return (
        <Field>
            <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
            <Textarea
                {...props}
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

type FormFileInputProps = BaseFieldProps & {
    multiple?: boolean
    accept?: string
}

function FormFileInput({
    field,
    label,
    description,
    multiple,
    accept,
}: FormFileInputProps) {
    const { isTouched, isValid } = field.state.meta

    return (
        <Field>
            <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
            {/* File inputs are uncontrolled: never pass `value`. */}
            <Input
                id={field.name}
                name={field.name}
                type="file"
                multiple={multiple}
                accept={accept}
                onBlur={field.handleBlur}
                onChange={(e) =>{
                      const selected = e.target.files?.[0] ?? null
                      if(!selected){
                         field.handleChange(null)
                         field.handleBlur()
                         e.target.value = ""
                         return
                      }
                      field.handleChange(selected)
                      e.target.value = ""
                } }
                aria-invalid={isTouched && !isValid}
            />
            <FieldError field={field} />
            {description && <FieldDescription>{description}</FieldDescription>}
        </Field>
    )
}

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <section className="flex flex-col gap-4">
            <h2 className="border-b pb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                {title}
            </h2>
            {children}
        </section>
    )
}

const TWO_COL = "grid grid-cols-1 gap-4 sm:grid-cols-2"

/* -------------------------------------------------------------------------- */
/*                               Doctor apply form                            */
/* -------------------------------------------------------------------------- */

export function DoctorApplyForm({ className, ...props }: ComponentProps<"div">) {
    const router = useRouter()
    const { mutateAsync: registerUser, isPending } = useRegister()

    const form = useForm({
        defaultValues: DEFAULT_VALUES,

        onSubmit: async ({ value }) => {
            console.log(value);
            
            const { confirmPassword: _confirmPassword, ...payload } =
                DoctorApplyZodSchema.parse(value)

            try {
                await registerUser(payload)

                toast.add({ type: "success", title: "Account created" })
                console.log("");
                
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
                            form.handleSubmit()
                        }}
                    >
                        <FieldGroup className="gap-8">
                            <header className="flex flex-col items-center gap-2 text-center">
                                <h1 className="text-2xl font-bold">Apply as a doctor</h1>
                                <p className="text-sm text-balance text-muted-foreground">
                                    Fill in your details and documents. We&apos;ll review your
                                    application shortly.
                                </p>
                            </header>

                            {/* ------------------------- Account ------------------------- */}
                            <FormSection title="Account">
                                <form.Field name="name">
                                    {(field) => (
                                        <FormInput
                                            field={field}
                                            label="Full name"
                                            type="text"
                                            placeholder="Dr. John Doe"
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

                                <div className="flex flex-col gap-2">
                                    <div className={TWO_COL}>
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
                                    </div>
                                    <FieldDescription>
                                        At least 8 characters, with one uppercase letter, one
                                        lowercase letter, and one number.
                                    </FieldDescription>
                                </div>
                            </FormSection>

                            {/* --------------------- Professional info -------------------- */}
                            <FormSection title="Professional details">
                                <div className={TWO_COL}>
                                    <form.Field name="specialization">
                                        {(field) => (
                                            <FormInput
                                                field={field}
                                                label="Specialization"
                                                type="text"
                                                placeholder="Cardiology"
                                            />
                                        )}
                                    </form.Field>

                                    <form.Field name="qualifications">
                                        {(field) => (
                                            <FormInput
                                                field={field}
                                                label="Qualifications"
                                                type="text"
                                                placeholder="MBBS, FCPS"
                                            />
                                        )}
                                    </form.Field>

                                    <form.Field name="experienceYear">
                                        {(field) => (
                                            <FormInput
                                                field={field}
                                                label="Experience (years)"
                                                type="number"
                                                min={0}
                                                inputMode="numeric"
                                                placeholder="5"
                                            />
                                        )}
                                    </form.Field>

                                    <form.Field name="licenseNumber">
                                        {(field) => (
                                            <FormInput
                                                field={field}
                                                label="License number"
                                                type="text"
                                                placeholder="BMDC-12345"
                                            />
                                        )}
                                    </form.Field>
                                </div>

                                <form.Field name="consultationFee">
                                    {(field) => (
                                        <FormInput
                                            field={field}
                                            label="Consultation fee"
                                            type="number"
                                            min={0}
                                            inputMode="decimal"
                                            placeholder="500"
                                        />
                                    )}
                                </form.Field>

                                <form.Field name="bio">
                                    {(field) => (
                                        <FormTextarea
                                            field={field}
                                            label="Bio"
                                            rows={4}
                                            placeholder="Tell patients a little about yourself and
                                             your practice..."
                                        />
                                    )}
                                </form.Field>
                            </FormSection>

                            {/* ------------------------ Documents ------------------------ */}
                            <FormSection title="Documents">
                                <div className="flex flex-col gap-2">
                                    <div className={TWO_COL}>
                                        <form.Field name="resume">
                                            {(field) => (
                                                <FormFileInput
                                                    field={field}
                                                    label="Resume"
                                                    accept=".pdf,.doc,.docx"
                                                />
                                            )}
                                        </form.Field>

                                        <form.Field name="additionalFile">
                                            {(field) => (
                                                <FormFileInput
                                                    field={field}
                                                    label="Additional files"
                                                    accept=".pdf,.jpg,.jpeg,.png"
                                                    multiple
                                                />
                                            )}
                                        </form.Field>
                                    </div>
                                    <FieldDescription>
                                        Resume is required (PDF/DOC, max 5MB). Additional files
                                        are optional.
                                    </FieldDescription>
                                </div>
                            </FormSection>

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
                                                    Submitting...
                                                </>
                                            ) : (
                                                "Submit application"
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