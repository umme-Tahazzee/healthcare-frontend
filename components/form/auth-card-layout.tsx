import Image from "next/image"
import { ShieldCheck } from "lucide-react"
import type { ReactNode } from "react"

import img from "@/app/assests/img/authentication/doctor.jpg"
import { Card, CardContent } from "@/components/ui/card"

type Props = {
  children: ReactNode
  caption: string
  subcaption: string
}

export function AuthCardLayout({ children, caption, subcaption }: Props) {
  return (
    <main className="flex min-h-svh w-full items-center justify-center bg-muted/40 p-4 md:p-10">
      <Card className="w-full max-w-5xl overflow-hidden p-0 shadow-lg">
        <CardContent className="grid p-0 md:grid-cols-2">
          <section className="flex flex-col justify-center p-6 md:p-10">
            {children}
          </section>

          <aside className="relative hidden min-h-[560px] bg-muted md:block">
            <Image
              src={img}
              alt="Doctor illustration"
              fill
              priority
              sizes="(min-width: 768px) 50vw, 0px"
              className="object-cover dark:brightness-[0.3] dark:grayscale"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 space-y-2 p-8 text-white">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur">
                <ShieldCheck className="size-4" />
                Secure account recovery
              </div>
              <h2 className="text-2xl font-semibold leading-tight">{caption}</h2>
              <p className="text-sm text-white/80">{subcaption}</p>
            </div>
          </aside>
        </CardContent>
      </Card>
    </main>
  )
}