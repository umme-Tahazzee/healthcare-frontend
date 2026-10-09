"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Eye, EyeOff, Loader2, Lock, Mail, ShieldCheck, Stethoscope } from "lucide-react"
import { useForm } from "@tanstack/react-form"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FieldError } from "@/components/ui/field"
import { LoginZodSchema } from "@/validation"
import loginImage from "@/app/assests/img/authentication/doctor.jpg"
import { useLogin } from "@/hooks"
import { useRouter } from "next/navigation"
import { toast } from "../ui/toast"
import { Spinner } from "../ui/spinner"


export default function LoginForm({ className, ...props }: React.ComponentProps<"div">) {



  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter();


  const { mutate: login, isPending: loginPending } = useLogin()

  const form = useForm({
    defaultValues: {
      email: "cse262@gmail.com",
      password: "aA@12345678",
    },
    validators: {
      onChange: LoginZodSchema,
      onSubmit: LoginZodSchema,
    },
    onSubmit: async ({ value }) => {
      const loginData = {
        email: value.email,
        password: value.password
      }
      login(loginData, {
        onSuccess: (res) => {
          console.log(res);
          toast.add({ type: "success", title: "Login Successfully"})
          router.push('/')

        },
        onError: (err) => {
          toast.add({
            type: "error",
            title: "Authorization Failure",

          })

        }
      })

    },
  })

  return (
    <div
      className={cn(
        "relative flex min-h-svh items-center justify-center overflow-hidden px-4 py-10",
        className
      )}
      {...props}
    >


      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative grid w-full max-w-5xl overflow-hidden rounded-3xl border
         bg-background  md:grid-cols-2"
      >
        {/* ---------- Left: form ---------- */}
        <div className="flex flex-col justify-center p-8 sm:p-12">
          {/* Brand */}
          <div className="mb-10 flex items-center gap-2.5">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md shadow-primary/30">
              <Stethoscope className="size-5" />
            </div>
            <span className="text-lg font-semibold tracking-tight">PH Healthcare</span>
          </div>

          {/* Header */}
          <div className="mb-8 space-y-2">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Welcome back
            </h1>
            <p className="text-sm text-muted-foreground">
              Sign in to manage your appointments and health records.
            </p>
          </div>

          <form
            noValidate
            className="space-y-5"
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
              form.handleSubmit()
            }}
          >

            {/* Email */}
            <form.Field name="email">
              {(field) => {
                const showError = field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <div className="space-y-2">
                    <label htmlFor={field.name} className="text-sm font-medium">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id={field.name}
                        type="email"
                        autoComplete="email"
                        placeholder="you@example.com"
                        name={field.name}
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

            {/* Password */}
            <form.Field name="password">
              {(field) => {
                const showError = field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label htmlFor={field.name} className="text-sm font-medium">
                        Password
                      </label>
                      <Link
                        href="/forgot-password"
                        className="text-xs font-medium text-primary hover:underline"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative">
                      <Lock className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id={field.name}
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        placeholder="Enter your password"
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={showError}
                        className="h-12 rounded-xl bg-muted/40 pl-10 pr-11 transition-all focus-visible:bg-background"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((p) => !p)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      </button>
                    </div>
                    {showError && <FieldError errors={field.state.meta.errors} />}
                  </div>
                )
              }}
            </form.Field>

            {/* Remember me */}
            <label className="flex cursor-pointer items-center gap-2.5 text-sm text-muted-foreground">
              <input
                type="checkbox"
                name="remember"
                className="size-4 rounded border-input accent-primary"
              />
              Keep me signed in
            </label>

            {/* Submit */}

            <Button
              type="submit"
              disabled={loginPending}
              className="h-12 w-full rounded-xl text-base font-semibold shadow-lg shadow-primary/25 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/30 active:translate-y-0"
            >
              {loginPending ? (
                <>
                  <Spinner className="mr-2 size-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>


          </form>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-semibold text-primary hover:underline">
              Create one
            </Link>
          </p>
        </div>

        {/* ---------- Right: image ---------- */}
        <div className="relative hidden min-h-[620px] md:block">
          <Image
            src={loginImage}
            alt="Doctor illustration"
            fill
            priority
            sizes="(min-width: 768px) 50vw, 0vw"
            className="object-cover dark:brightness-[0.4]"
          />
          {/* Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10" />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/25 to-transparent mix-blend-multiply" />

          {/* Top badge */}
          <div className="absolute left-6 top-6 flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-medium text-white backdrop-blur-md">
            <ShieldCheck className="size-3.5" />
            Secure & encrypted
          </div>

          {/* Bottom glass card */}
          <div className="absolute inset-x-6 bottom-6 rounded-2xl border border-white/15 bg-white/10 p-6 text-white backdrop-blur-xl">
            <p className="text-lg font-medium leading-snug">
              Quality healthcare, one tap away. Book, consult and track everything in one place.
            </p>
            <div className="mt-5 grid grid-cols-3 gap-4 border-t border-white/15 pt-4 text-center">
              {[
                { value: "500+", label: "Doctors" },
                { value: "20k+", label: "Patients" },
                { value: "4.9", label: "Rating" },
              ].map((s) => (
                <div key={s.label}>
                  <div className="text-xl font-bold">{s.value}</div>
                  <div className="text-xs text-white/70">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}