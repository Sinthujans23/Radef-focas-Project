"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useState } from "react";

export default function Greeting() {
  const [greeting, setGreeting] = useState("வணக்கம்"); // Default Vanakkam

  useEffect(() => {
    const hour = new Date().getHours();
    
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (hour >= 5 && hour < 12) {
      setGreeting("காலை வணக்கம்"); // Kaalai Vanakkam (Morning)
    } else if (hour >= 12 && hour < 16) {
      setGreeting("மதிய வணக்கம்"); // Mathiya Vanakkam (Afternoon)
    } else if (hour >= 16 && hour < 20) {
      setGreeting("மாலை வணக்கம்"); // Maalai Vanakkam (Evening)
    } else {
      setGreeting("இரவு வணக்கம்"); // Iravu Vanakkam (Night)
    }
  }, []);

  return (
    <h2 className="font-tamil text-2xl font-bold text-saffron-600 mb-2 drop-shadow-sm text-center">
      🙏 {greeting}
    </h2>
  );
}
