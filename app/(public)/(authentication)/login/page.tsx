import LoginForm from "@/components/form/login-form"
import Logo from "@/components/ui/logo"
import loginImage from "@/app/assests/img/authentication/doctor.jpg"
import Image from "next/image"

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      {/* Left: form */}
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <Logo className="mt-2" imageClassName="w-fit h-12" />

        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm">
            <LoginForm />
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          By continuing, you agree to our{" "}
          <a href="#" className="underline underline-offset-4 hover:text-foreground">
            Terms
          </a>{" "}
          and{" "}
          <a href="#" className="underline underline-offset-4 hover:text-foreground">
            Privacy Policy
          </a>
          .
        </p>
      </div>

      {/* Right: image */}
      <div className="relative hidden overflow-hidden bg-muted lg:block">
        <Image
          src={loginImage}
          alt="Doctor illustration"
          fill
          priority
          className="object-cover dark:brightness-[0.3] dark:grayscale"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Bottom text */}
        <div className="absolute inset-x-0 bottom-0 p-10 text-white">
          <blockquote className="space-y-3">
            <p className="text-2xl font-semibold leading-snug tracking-tight">
              Quality healthcare, just a few clicks away.
            </p>
            <p className="max-w-md text-sm text-white/70">
              Book appointments, consult with trusted doctors and manage your
              health records, all in one secure place.
            </p>
          </blockquote>
        </div>
      </div>
    </div>
  )
}