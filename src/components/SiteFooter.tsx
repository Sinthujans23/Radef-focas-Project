import TempleDivider from "./TempleDivider";
import FestivalToggle from "./FestivalToggle";
import DarkModeToggle from "./DarkModeToggle";
import { OrganizationDTO } from "@/lib/types";

export default function SiteFooter({ org }: { org: OrganizationDTO }) {
  return (
    <footer className="mt-auto bg-maroon-950 border-t-4 border-gold-500 text-gold-100">
      <TempleDivider className="text-gold-500/30 -scale-y-100 mb-2" />
      <div className="mx-auto max-w-3xl px-4 pb-8 pt-2 text-center">
        <p className="font-heading text-lg font-bold tracking-wide text-gold-300 drop-shadow-sm">{org.name}</p>
        <p className="mt-2 text-sm font-medium text-gold-100/70">
          &copy; {new Date().getFullYear()} {org.name}. All rights reserved.
        </p>
        <div className="mt-6 flex flex-col items-center gap-4 text-sm font-medium">
          <div className="flex gap-4">
            <DarkModeToggle />
            <FestivalToggle />
          </div>
          <a href="/admin/login" className="text-gold-500 hover:text-gold-300 hover:underline transition">
            Admin Login
          </a>
        </div>
      </div>
    </footer>
  );
}
