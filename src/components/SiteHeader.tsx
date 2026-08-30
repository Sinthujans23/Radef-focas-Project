"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { OrganizationDTO } from "@/lib/types";
import NotificationBell from "./NotificationBell";
import TempleDivider from "./TempleDivider";

export default function SiteHeader({ org }: { org: OrganizationDTO }) {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => setIsAdmin(Boolean(data.isAdmin)))
      .catch(() => setIsAdmin(false));
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-b from-maroon-950 to-maroon-900 border-b-4 border-gold-500 shadow-xl">
      <div className="h-2 bg-gradient-to-r from-saffron-600 via-gold-500 to-saffron-600" />
      <div className="mx-auto flex max-w-3xl flex-col sm:flex-row items-center justify-between gap-4 px-4 py-4 text-center sm:text-left">
        <Link href="/" className="flex flex-col sm:flex-row items-center gap-3">
          {org.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={org.logoUrl}
              alt={org.name}
              className="h-11 w-11 rounded-full object-cover ring-2 ring-gold-400/80 bg-white"
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src="/logo.jpg"
              alt={org.name}
              className="h-11 w-11 rounded-full object-contain ring-2 ring-gold-400/80 bg-white p-1"
            />
          )}
          <div>
            <p className="font-heading text-xl sm:text-2xl font-bold leading-tight tracking-wide text-gold-100 drop-shadow-md">
              {org.name}
            </p>
            {org.tagline && (
              <p className="text-sm font-medium italic leading-tight text-gold-300">{org.tagline}</p>
            )}
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <NotificationBell />
          <Link
            href={isAdmin ? "/admin/dashboard" : "/admin/login"}
            className="rounded-md bg-gradient-to-r from-saffron-600 to-maroon-700 px-4 py-2 text-sm font-bold text-white shadow-md hover:brightness-110 transition border border-gold-500/50"
          >
            {isAdmin ? "Dashboard" : "Admin Login"}
          </Link>
        </div>
      </div>
      <TempleDivider className="text-gold-400 drop-shadow-lg" />
    </header>
  );
}
