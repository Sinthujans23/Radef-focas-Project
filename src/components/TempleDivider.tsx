"use client";

import { useId } from "react";

export default function TempleDivider({
  className = "",
  flip = false,
}: {
  className?: string;
  flip?: boolean;
}) {
  const patternId = useId();

  return (
    <svg
      viewBox="0 0 100 14"
      preserveAspectRatio="none"
      className={`h-3.5 w-full ${flip ? "rotate-180" : ""} ${className}`}
      aria-hidden="true"
    >
      <defs>
        <pattern id={patternId} width="14" height="14" patternUnits="userSpaceOnUse">
          <path d="M0 14 L0 8.5 Q7 1 14 8.5 L14 14 Z" fill="currentColor" />
          <circle cx="7" cy="4.5" r="1.1" fill="currentColor" />
        </pattern>
      </defs>
      <rect width="100" height="14" fill={`url(#${patternId})`} />
    </svg>
  );
}
