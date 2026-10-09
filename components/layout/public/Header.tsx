"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Logo from '@/components/ui/logo';
import { useGetMe, useLogout } from '@/hooks';
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";
import { toast, Toast } from "@/components/ui/toast";
import { useQueryClient } from "@tanstack/react-query";

const routes = [
  { name: "Home", url: "/" },
  { name: "About us", url: "/about-us" },

];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const queryClient = useQueryClient()


  const { data, isLoading } = useGetMe()

  const { mutate: logout } = useLogout()

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        toast.add({
          type: "success",
          title: "Logout Successfully"
        })
        queryClient.removeQueries({queryKey:["user"]})

      },
      onError: () => {
        toast.add({
          type: "error",
          title: "Logout failed",
          description: "Something went wrong"
        })
      }
    })
  }

  // route change hole mobile menu bondho
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // scroll korle subtle shadow
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (url: string) =>
    url === "/" ? pathname === "/" : pathname.startsWith(url);

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b bg-white/85 backdrop-blur transition-shadow ${scrolled ? "border-slate-200 shadow-sm" : "border-transparent"
        }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Logo
          className="mt-2"
          imageClassName="h-12 w-full"
        />

        {/* Desktop nav */}
        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {routes.map((route) => {
            const active = isActive(route.url);
            return (
              <Link
                key={route.name}
                href={route.url}
                aria-current={active ? "page" : undefined}
                className={`rounded-lg px-3.5 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-teal-700 ${active
                  ? "bg-teal-50 text-primary"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
              >
                {route.name}
              </Link>
            );
          })}

          {
            !isLoading && !data && (
              <Button
                variant={"outline"}
                render={<Link href='/login' >Login</Link>}
                nativeButton={false}
                className="bg-primary text-white"
              >
                Login
              </Button>
            )}


          {!isLoading && data && (
            <Button
              variant="destructive"
              onClick={handleLogout}   // useLogout mutation
            >
              <LogOut className="mr-2 size-4" />
              Logout
            </Button>
          )}

        </nav>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          className="flex h-10 w-10 items-center justify-center rounded-lg
           text-slate-700 hover:bg-slate-100 focus-visible:outline-2
            focus-visible:outline-teal-700 md:hidden"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={`grid transition-[grid-template-rows] duration-200 md:hidden ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          }`}
      >
        <nav
          aria-label="Mobile"
          className="overflow-hidden border-t border-slate-100 bg-white"
        >
          <div className="flex flex-col gap-1 p-4">
            {routes.map((route) => {
              const active = isActive(route.url);
              return (
                <Link
                  key={route.name}
                  href={route.url}
                  tabIndex={open ? 0 : -1}
                  aria-current={active ? "page" : undefined}
                  className={`rounded-lg px-3 py-3 text-base font-medium ${active
                    ? "bg-teal-50 text-teal-800"
                    : "text-slate-700 hover:bg-slate-100"
                    }`}
                >
                  {route.name}
                </Link>
              );
            })}
            <Link
              href="/login"
              tabIndex={open ? 0 : -1}
              className="mt-2 rounded-lg bg-teal-700 px-4 py-3 text-center text-base font-semibold text-white hover:bg-teal-800"
            >
              Login
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}