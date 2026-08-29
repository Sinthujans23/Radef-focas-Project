"use client";

import { useEffect, useState } from "react";

export default function FestivalToggle() {
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (active) {
      document.body.classList.add("festival-mode");
    } else {
      document.body.classList.remove("festival-mode");
    }
  }, [active]);

  return (
    <button
      onClick={() => setActive(!active)}
      className={`rounded-full px-4 py-1.5 text-xs font-bold transition shadow-sm border ${
        active 
          ? "bg-gradient-to-r from-saffron-600 to-gold-500 text-white border-gold-400" 
          : "bg-maroon-900 text-gold-500 hover:bg-maroon-800 border-maroon-800"
      }`}
      title="Toggle Festival Mode"
    >
      {active ? "✨ Festival Mode On" : "🪔 Festival Mode Off"}
    </button>
  );
}
