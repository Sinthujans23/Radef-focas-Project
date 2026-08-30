"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavigationBar() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "About Us" },
    { href: "/updates", label: "Latest Updates" },
    { href: "/members", label: "Members" },
  ];

  return (
    <nav className="sticky top-0 z-40 bg-white border-b-2 border-gold-300 shadow-md">
      <div className="mx-auto max-w-3xl px-4">
        <ul className="flex items-center justify-center gap-1 sm:gap-4 overflow-x-auto">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <li key={link.href} className="shrink-0">
                <Link
                  href={link.href}
                  className={`block px-4 py-3 text-sm sm:text-base font-bold transition-all border-b-4 ${
                    isActive
                      ? "border-saffron-600 text-maroon-950"
                      : "border-transparent text-maroon-900/60 hover:text-maroon-900 hover:border-gold-300"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
