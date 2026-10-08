import Image from "next/image";
import Link from "next/link";
import logo from '../../../app/assests/img/logo/mediflow-1.png'
import Logo from "@/components/ui/logo";


const links = [
    { name: "Home", url: "/" },
    { name: "About us", url: "/about-us" },
    { name: "Find a doctor", url: "/doctors" },
];

export default function Footer() {
    return (
        <footer className="w-full border-t border-slate-200 bg-slate-50">
            <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[2fr_1fr]">
                <div className="max-w-sm">
                    {/* Logo */}
                    <Logo
                        className="mt-2"
                        imageClassName="h-12 w-fit"
                    />
                    <p className="mt-3 text-sm leading-relaxed text-slate-600">
                        Find trusted doctors and book your appointment online, without the
                        waiting room.
                    </p>
                </div>

                <nav aria-label="Footer">
                    <h2 className="text-sm font-semibold text-slate-900">Quick links</h2>
                    <ul className="mt-3 space-y-2">
                        {links.map((link) => (
                            <li key={link.name}>
                                <Link
                                    href={link.url}
                                    className="text-sm text-slate-600 transition-colors hover:text-teal-800 focus-visible:outline-2 focus-visible:outline-teal-700"
                                >
                                    {link.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>

            <div className="border-t border-slate-200">
                <p className="mx-auto max-w-6xl px-4 py-4 text-sm text-slate-500 sm:px-6">
                    © {new Date().getFullYear()} PH Healthcare. All rights reserved.
                </p>
            </div>
        </footer>
    );
}