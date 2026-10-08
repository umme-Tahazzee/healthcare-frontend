import Link from "next/link";
import { Check, Lock, Search, ShieldCheck, Star, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const specialties = ["Cardiology", "Dermatology", "Pediatrics", "Neurology"];

const trust = [
  { icon: ShieldCheck, text: "Every doctor verified" },
  { icon: Zap, text: "Instant confirmation" },
  { icon: Lock, text: "Private and secure" },
];

const days = [
  { d: "Mon", n: "12" },
  { d: "Tue", n: "13" },
  { d: "Wed", n: "14" },
  { d: "Thu", n: "15" },
  { d: "Fri", n: "16" },
];

const slots = ["9:00 AM", "10:30 AM", "11:15 AM", "2:00 PM", "3:30 PM", "5:00 PM"];

const Hero = () => {
  return (
    <section className="relative isolate overflow-hidden
     bg-background text-dark">


      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center
       gap-16 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:py-20">
        {/* Left */}
        <div className="relative max-w-xl">

          {/* Badge */}
          <p className="inline-flex items-center gap-2 rounded-full border
           border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold 
           uppercase tracking-[0.2em] text-primary backdrop-blur">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            Trusted healthcare, simplified
          </p>

          {/* Heading */}
          <h1 className="mt-6 text-4xl font-semibold leading-[1.05] tracking-tight text-dark sm:text-5xl lg:text-6xl">
            Find the right doctor.{" "}
            <span className="bg-gradient-to-r from-primary via-primary to-navy bg-clip-text text-transparent">
              Book in minutes.
            </span>
          </h1>

          <p className="mt-6 max-w-md text-lg leading-relaxed text-dark/70">
            Search by name or specialty, see real availability, and confirm your
            appointment online. No phone calls, no waiting room.
          </p>

          {/* GET form: JS lagena */}
          <form
            action="/doctors"
            method="GET"
            className="group relative mt-9"
          >
            {/* glow behind the bar */}

            <div className="relative flex flex-col gap-2 rounded-2xl border 
    border-dark/10 bg-secondary/90 p-2 shadow-xl shadow-dark/10 backdrop-blur
     sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search
                  aria-hidden="true"
                  className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-navy/40 transition-colors group-focus-within:text-primary"
                />
                <Input
                  name="search"
                  type="search"
                  placeholder="Doctor name or specialty"
                  aria-label="Search doctors"
                  className="h-12 border-0 bg-transparent pl-12 text-base text-navy shadow-none placeholder:text-navy/40 focus-visible:ring-0"
                />
              </div>
              <Button
                type="submit"
                size="lg"
                className="h-12 rounded-xl bg-primary px-8 text-base font-semibold text-navy shadow-lg shadow-primary/30 transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/40 active:translate-y-0"
              >
                Find a doctor
              </Button>
            </div>
          </form>

          {/* Popular chips */}
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="mr-1 text-xs font-medium uppercase tracking-wider text-dark/40">
              Popular
            </span>
            {specialties.map((s) => (
              <Link
                key={s}
                href={`/doctors?search=${s}`}
                className="rounded-full border border-dark/10 bg-white/60 px-4 py-1.5 text-sm text-dark/80 backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-primary hover:bg-primary/10 hover:text-primary hover:shadow-md hover:shadow-primary/20 focus-visible:outline-2 focus-visible:outline-primary"
              >
                {s}
              </Link>
            ))}
          </div>

          {/* Trust row */}
          <ul className="mt-12 grid grid-cols-1 gap-4 border-t border-dark/10 pt-6 sm:grid-cols-3">
            {trust.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-sm text-dark/70">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 ring-1 ring-primary/20">
                  <Icon aria-hidden="true" className="h-4 w-4 text-primary" />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>

        {/* Right: booking preview */}
        <div className="relative mx-auto w-full max-w-md pb-8 lg:mx-0 lg:ml-auto">
          <div className="rounded-3xl bg-white p-6 text-navy shadow-xl shadow-black/30">
            <div className="flex items-center gap-4">
              <div
                aria-hidden="true"
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-navy text-lg font-semibold text-primary"
              >
                AR
              </div>
              <div className="min-w-0">
                <p className="truncate font-semibold">Dr. Ayesha Rahman</p>
                <p className="text-sm text-navy/60">Cardiologist</p>
              </div>
              <div className="ml-auto flex items-center gap-1 text-sm font-medium">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                4.9
              </div>
            </div>

            <p className="mt-6 text-sm font-medium text-navy/60">
              Choose a day
            </p>
            <div className="mt-2 grid grid-cols-5 gap-2">
              {days.map((day, i) => (
                <div
                  key={day.d}
                  className={`rounded-xl py-2.5 text-center ${i === 1
                      ? "bg-primary font-semibold text-navy"
                      : "border border-navy/10 text-navy/70"
                    }`}
                >
                  <div className="text-xs">{day.d}</div>
                  <div className="text-base font-semibold">{day.n}</div>
                </div>
              ))}
            </div>

            <p className="mt-5 text-sm font-medium text-navy/60">
              Choose a time
            </p>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {slots.map((slot, i) => (
                <div
                  key={slot}
                  className={`rounded-xl px-2 py-2.5 text-center text-sm ${i === 1
                      ? "bg-navy font-semibold text-dark"
                      : "border border-navy/10 text-navy/70"
                    }`}
                >
                  {slot}
                </div>
              ))}
            </div>

            <Button

              className="mt-6 h-12 w-full rounded-xl bg-primary text-base font-semibold text-navy hover:bg-primary/90"
            >
              <Link href="/doctors">Book appointment</Link>
            </Button>
          </div>

          {/* confirmation chip */}
          <div className="absolute bottom-0 left-0 flex items-center gap-3 rounded-2xl border border-white/15 bg-navy/90 px-4 py-3 shadow-xl backdrop-blur sm:-left-10">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-navy">
              <Check className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-semibold">Appointment confirmed</p>
              <p className="text-xs text-dark/60">Tue 13, 10:30 AM</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;