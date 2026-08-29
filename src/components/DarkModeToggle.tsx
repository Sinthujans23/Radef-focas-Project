"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useState } from "react";

export default function DarkModeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check local storage on mount
    const saved = localStorage.getItem("theme");
    if (saved === "dark") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsDark(true);
      document.body.classList.add("dark-temple");
    }
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.body.classList.add("dark-temple");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark-temple");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className={`rounded-full px-4 py-1.5 text-xs font-bold transition shadow-sm border ${
        isDark
          ? "bg-gradient-to-r from-saffron-600 to-gold-500 text-white border-gold-400"
          : "bg-maroon-900 text-gold-500 hover:bg-maroon-800 border-maroon-800"
      }`}
      title="Toggle Night Temple Mode"
    >
      {isDark ? "🌙 Night Temple On" : "🌙 Night Temple Off"}
    </button>
  );
}
