"use client";

import { useEffect, useState } from "react";
import { getLastSeen, setLastSeenNow } from "@/lib/viewer";

const POLL_INTERVAL_MS = 15000;

export default function NotificationBell() {
  const [newCount, setNewCount] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let ignore = false;
    const runCheck = async () => {
      try {
        const since = getLastSeen();
        const res = await fetch(`/api/posts?since=${encodeURIComponent(since)}`, {
          cache: "no-store",
        });
        if (!res.ok) return;
        const data = await res.json();
        if (!ignore) setNewCount(data.newCount || 0);
      } catch {
        // ignore transient network errors
      }
    };

    runCheck();
    const interval = setInterval(runCheck, POLL_INTERVAL_MS);
    return () => {
      ignore = true;
      clearInterval(interval);
    };
  }, []);

  function handleMarkRead() {
    setLastSeenNow();
    setNewCount(0);
    setOpen(false);
    window.dispatchEvent(new CustomEvent("rf:refresh-feed"));
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Notifications"
        className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gold-500/15 text-gold-100 ring-1 ring-gold-400/40 transition hover:bg-gold-500/25"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
          <path d="M12 22a2.25 2.25 0 0 0 2.236-2h-4.472A2.25 2.25 0 0 0 12 22Z" />
          <path
            fillRule="evenodd"
            d="M12 2.25a6.75 6.75 0 0 0-6.75 6.75v2.34c0 .58-.19 1.145-.54 1.607l-1.02 1.36c-.87 1.16-.09 2.943 1.44 2.943h13.74c1.53 0 2.31-1.782 1.44-2.943l-1.02-1.36a2.69 2.69 0 0 1-.54-1.607V9A6.75 6.75 0 0 0 12 2.25Z"
            clipRule="evenodd"
          />
        </svg>
        {newCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-xs font-semibold text-white">
            {newCount > 9 ? "9+" : newCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-20 mt-2 w-64 rounded-lg border border-gold-300 bg-cream-50 p-4 text-maroon-900 shadow-xl">
          {newCount > 0 ? (
            <>
              <p className="text-sm font-medium">
                {newCount} new post{newCount === 1 ? "" : "s"} from the admin
              </p>
              <button
                onClick={handleMarkRead}
                className="mt-3 w-full rounded-md bg-gradient-to-r from-saffron-600 to-maroon-700 px-3 py-1.5 text-sm font-medium text-white hover:brightness-110"
              >
                Mark as read
              </button>
            </>
          ) : (
            <p className="text-sm text-maroon-900/60">You&apos;re all caught up.</p>
          )}
        </div>
      )}
    </div>
  );
}
