// app/about/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import {
  CalendarCheck,
  CheckCircle2,
  Clock,
  HeartHandshake,
  Lock,
  Search,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About us | PH Healthcare",
  description:
    "We help patients find the right doctor and book a confirmed appointment online, without phone calls or waiting rooms.",
};

/* ---------- Content (apnar real data diye replace koro) ---------- */

const stats = [
  { value: "500+", label: "Verified doctors" }, // TODO: real number
  { value: "40+", label: "Specialties" }, // TODO: real number
  { value: "2 min", label: "Average time to book" }, // TODO: real number
  { value: "24/7", label: "Online booking" },
];

const steps = [
  {
    icon: Search,
    title: "Search",
    text: "Type a doctor's name or a specialty. Filter by availability and fee.",
  },
  {
    icon: CalendarCheck,
    title: "Pick a slot",
    text: "See the doctor's real open times, not a vague 'call to confirm'.",
  },
  {
    icon: CheckCircle2,
    title: "Get confirmed",
    text: "Pay online and receive your confirmation right away.",
  },
];

const values = [
  {
    icon: ShieldCheck,
    title: "Every doctor is verified",
    text: "We check credentials before a profile goes live, so you only see practitioners we would send our own family to.",
  },
  {
    icon: Clock,
    title: "Your time counts",
    text: "Availability is live. If a slot is shown, it is bookable. If it is taken, it disappears.",
  },
  {
    icon: Lock,
    title: "Your data stays yours",
    text: "Medical details are shared only with the doctor you book. We never sell patient information.",
  },
  {
    icon: HeartHandshake,
    title: "Care before convenience",
    text: "Fast booking matters, but only because it gets people to the right care sooner.",
  },
];

const team = [
  { name: "Abdullah Al Shahadath", role: "Founder & CEO" }, // TODO
  { name: "Full Name", role: "Head of Medical Network" }, // TODO
  { name: "Umme Tahazzee", role: "Lead Engineer" }, // TODO
  { name: "Full Name", role: "Patient Support Lead" }, // TODO
];

/* ---------- Page ---------- */

export default function AboutPage() {
  return (
    <main className="bg-secondary text-dark">
      {/* ===== Hero ===== */}
      <section className="mx-auto grid max-w-7xl items-center gap-14 
      px-6 py-20 lg:grid-cols-[1.15fr_0.85fr] lg:py-28">
        <div>
          <h1 className="text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
            Getting care shouldn&apos;t start with a phone queue.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-dark/70">
            We built PH Healthcare so that finding a good doctor and booking a
            time takes minutes, not a morning. Patients get a confirmed
            appointment. Doctors get a full, organised schedule.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Button
            
              size="lg"
              className="h-12 rounded-xl bg-primary px-7 text-base 
              font-semibold text-navy hover:bg-primary/90"
            >
              <Link href="/doctors">Find a doctor</Link>
            </Button>
            <Button
            
              size="lg"
              variant="outline"
              className="h-12 rounded-xl border-dark/20 px-7 text-base"
            >
              <Link href="/contact">Talk to us</Link>
            </Button>
          </div>
        </div>

        {/* Product moment: what a booking looks like */}
        <div
          className="rounded-3xl border border-dark/10 bg-white p-6 shadow-xl shadow-dark/10"
          aria-label="Example of a confirmed appointment"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/15">
              <Stethoscope className="h-5 w-5 text-primary" aria-hidden="true" />
            </span>
            <div>
              <p className="font-semibold">Dr. Example Name</p>
              <p className="text-sm text-dark/60">Cardiologist</p>
            </div>
          </div>
          <dl className="mt-6 divide-y divide-dark/10 text-sm">
            <div className="flex justify-between py-3">
              <dt className="text-dark/60">Date</dt>
              <dd className="font-medium">Sat, 12 Oct</dd>
            </div>
            <div className="flex justify-between py-3">
              <dt className="text-dark/60">Time</dt>
              <dd className="font-medium">6:30 PM</dd>
            </div>
            <div className="flex justify-between py-3">
              <dt className="text-dark/60">Status</dt>
              <dd className="inline-flex items-center gap-1.5 font-medium text-primary">
                <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                Confirmed
              </dd>
            </div>
          </dl>
        </div>
      </section>

      {/* ===== Stats ===== */}
      <section className="border-y border-dark/10 bg-white/50">
        <dl className="mx-auto grid max-w-6xl grid-cols-2 gap-y-8 px-6 py-12 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="lg:border-l lg:border-dark/10 lg:pl-8 lg:first:border-0 lg:first:pl-0">
              <dd className="text-4xl font-semibold tracking-tight">
                {s.value}
              </dd>
              <dt className="mt-1 text-sm text-dark/60">{s.label}</dt>
            </div>
          ))}
        </dl>
      </section>

      {/* ===== Story ===== */}
      <section className="mx-auto grid max-w-6xl gap-10 px-6 py-20 lg:grid-cols-[0.8fr_1.2fr] lg:py-28">
        <h2 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
          Why we started
        </h2>
        <div className="max-w-2xl space-y-5 text-lg leading-relaxed text-dark/75">
          <p>
            Most of us know the routine. Ask around for a recommendation, call a
            number that rings busy, then travel to a clinic only to learn the
            doctor isn&apos;t in today.
          </p>
          <p>
            We thought that was a problem software could fix. So we put verified
            doctors, their real schedules and online booking in one place. You
            see who is available, you choose a time, and it is yours.
          </p>
          <p>
            Today we work with doctors across many specialties, and our focus
            has not changed: make the first step toward care simple.
          </p>
        </div>
      </section>

      {/* ===== How it works (real sequence, so numbered) ===== */}
      <section className="bg-primary/5 text-dark">
        <div className="mx-auto max-w-6xl px-6 py-20 lg:py-24">
          <h2 className="max-w-xl text-3xl font-semibold tracking-tight sm:text-4xl">
            Three steps from symptom to appointment
          </h2>
          <ol className="mt-12 grid gap-10 md:grid-cols-3">
            {steps.map(({ icon: Icon, title, text }, i) => (
              <li key={title} className="relative">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-navy">
                    {i + 1}
                  </span>
                  <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
                </div>
                <h3 className="mt-5 text-xl font-semibold">{title}</h3>
                <p className="mt-2 leading-relaxed text-secondary-foreground">{text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ===== Values ===== */}
      <section className="mx-auto max-w-6xl px-6 py-20 lg:py-28">
        <h2 className="max-w-xl text-3xl font-semibold tracking-tight sm:text-4xl">
          What we promise
        </h2>
        <ul className="mt-12 divide-y divide-dark/10 border-y border-dark/10">
          {values.map(({ icon: Icon, title, text }) => (
            <li
              key={title}
              className="grid gap-3 py-8 md:grid-cols-[auto_1fr_1.4fr] md:items-start md:gap-10"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 ring-1 ring-primary/20">
                <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
              </span>
              <h3 className="text-xl font-semibold">{title}</h3>
              <p className="leading-relaxed text-dark/70">{text}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* ===== Team ===== */}
      <section className="border-t border-dark/10 bg-white/50">
        <div className="mx-auto max-w-6xl px-6 py-20 lg:py-24">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            The people behind it
          </h2>
          <ul className="mt-12 grid grid-cols-2 gap-8 lg:grid-cols-4">
            {team.map((m, i) => (
              <li key={i}>
                {/* Real photo thakle <Image /> diye replace koro */}
                <div className="flex aspect-square items-center justify-center rounded-2xl bg-primary/10 text-3xl font-semibold text-primary">
                  {m.name
                    .split(" ")
                    .map((w) => w[0])
                    .join("")
                    .slice(0, 2)}
                </div>
                <p className="mt-4 font-semibold">{m.name}</p>
                <p className="text-sm text-dark/60">{m.role}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="mx-auto max-w-6xl px-6 py-20 lg:py-24">
        <div className="flex flex-col items-start justify-between gap-8 rounded-3xl bg-primary px-8 py-12 text-navy md:flex-row md:items-center md:px-14">
          <div className="max-w-xl">
            <h2 className="text-3xl font-semibold tracking-tight">
              Ready to see a doctor?
            </h2>
            <p className="mt-2 text-navy/80">
              Search by name or specialty and book in minutes.
            </p>
          </div>
          <Button
          variant={"outline"}
            size="lg"
            className="h-12 rounded-xl bg-navy px-8 text-base font-semibold text-white hover:bg-navy/90"
          >
            <Link href="/doctors">Find a doctor</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}