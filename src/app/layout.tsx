import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Redef & Focas Director Board",
  description: "Official news and updates from the Redef & Focas Director Board.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Geist:wght@100..900&family=Geist+Mono:wght@100..900&family=Kavivanar&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap" rel="stylesheet" />
        <style dangerouslySetInnerHTML={{ __html: `
          :root {
            --font-geist-sans: 'Geist', sans-serif;
            --font-geist-mono: 'Geist Mono', monospace;
            --font-playfair: 'Playfair Display', serif;
            --font-tamil: 'Kavivanar', cursive;
          }
        `}} />
      </head>
      <body className="min-h-full flex flex-col bg-background bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] text-foreground transition-colors duration-500">
        {children}
      </body>
    </html>
  );
}
