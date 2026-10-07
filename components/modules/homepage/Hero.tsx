import Link from "next/link";
import { CalendarCheck, Clock, Search, ShieldCheck, Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const stats = [
  { value: "500+", label: "Verified doctors" },
  { value: "40+", label: "Specialties" },
  { value: "20k+", label: "Appointments booked" },
];

const slots = ["9:00 AM", "10:30 AM", "2:00 PM"];

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-teal-50/60 to-white">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-12 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:py-0">
        {/* Left: copy */}
        <div className="max-w-xl">
          <Badge
            variant="secondary"
            className="gap-1.5 bg-teal-100 text-teal-800 hover:bg-teal-100"
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            Every doctor is verified
          </Badge>

          <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Book a trusted doctor in minutes
          </h1>

          <p className="mt-5 text-lg leading-relaxed text-slate-600">
            Search by name or specialty, check real availability, and confirm
            your appointment online. No calls, no waiting room.
          </p>

          {/* Search: GET form, JS lagena */}
          <form
            action="/doctors"
            method="GET"
            className="mt-8 flex flex-col gap-3 sm:flex-row"
          >
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                name="search"
                type="search"
                placeholder="Doctor name or specialty"
                aria-label="Search doctors"
                className="h-12 bg-white pl-10 text-base"
              />
            </div>
            <Button
              type="submit"
              size="lg"
              className="h-12 bg-teal-700 px-6 text-base hover:bg-teal-800"
            >
              Find a doctor
            </Button>
          </form>

          <p className="mt-3 text-sm text-slate-500">
            Popular:{" "}
            {["Cardiology", "Dermatology", "Pediatrics"].map((s, i) => (
              <span key={s}>
                <Link
                  href={`/doctors?search=${s}`}
                  className="font-medium text-teal-800 underline-offset-4 hover:underline"
                >
                  {s}
                </Link>
                {i < 2 && ", "}
              </span>
            ))}
          </p>

          <dl className="mt-10 grid grid-cols-3 gap-4 border-t border-slate-200 pt-6">
            {stats.map((s) => (
              <div key={s.label}>
                <dt className="sr-only">{s.label}</dt>
                <dd className="text-2xl font-bold text-slate-900 sm:text-3xl">
                  {s.value}
                </dd>
                <p className="mt-1 text-sm text-slate-500">{s.label}</p>
              </div>
            ))}
          </dl>
        </div>

        {/* Right: appointment preview card */}
        <div className="relative mx-auto w-full max-w-md lg:mx-0 lg:ml-auto">
          <div
            aria-hidden="true"
            className="absolute -inset-4 -z-10 rounded-[2rem] bg-teal-100/60 blur-2xl"
          />
          <Card className="border-slate-200 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div
                  aria-hidden="true"
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-teal-700 text-lg font-semibold text-white"
                >
                  AR
                </div>
                <div className="min-w-0">
                  <p className="truncate font-semibold text-slate-900">
                    Dr. Ayesha Rahman
                  </p>
                  <p className="text-sm text-slate-500">
                    Cardiologist · 12 yrs experience
                  </p>
                </div>
                <div className="ml-auto flex items-center gap-1 text-sm font-medium text-slate-700">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  4.9
                </div>
              </div>

              <div className="mt-6 flex items-center gap-2 text-sm font-medium text-slate-700">
                <CalendarCheck className="h-4 w-4 text-teal-700" />
                Available tomorrow
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2">
                {slots.map((slot, i) => (
                  <div
                    key={slot}
                    className={`rounded-lg border px-2 py-2 text-center text-sm font-medium ${
                      i === 1
                        ? "border-teal-700 bg-teal-700 text-white"
                        : "border-slate-200 text-slate-700"
                    }`}
                  >
                    {slot}
                  </div>
                ))}
              </div>

              <Button
                
                className="mt-6 h-11 w-full bg-teal-700 hover:bg-teal-800"
              >
                <Link href="/doctors">Book appointment</Link>
              </Button>
            </CardContent>
          </Card>

          {/* floating chip */}
          <div className="absolute -bottom-5 -left-3 flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-lg sm:-left-8">
            <Clock className="h-4 w-4 text-teal-700" />
            <span className="text-sm font-medium text-slate-700">
              Confirmed in under 2 minutes
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;