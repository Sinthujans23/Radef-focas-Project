"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed.");
        return;
      }
      router.push("/admin/dashboard");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4 relative overflow-hidden bg-[#fdfaf6] bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]">
      <div className="w-full max-w-sm rounded-2xl border-4 border-gold-400 bg-white p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-saffron-600 via-gold-500 to-saffron-600" />
        <div className="mb-8 text-center mt-2">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-cream-50 text-3xl shadow-inner border border-gold-300 ring-4 ring-gold-100">
            🪷
          </div>
          <h1 className="font-heading mt-4 text-2xl font-bold text-maroon-950 text-center">Admin Login</h1>
          <p className="mt-1 text-sm font-medium text-maroon-900/70 text-center">Radef &amp; Focas Director Board</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-bold text-maroon-950">Username</label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                required
                className="mt-2 w-full rounded-lg border-2 border-gold-300 bg-white px-4 py-2.5 text-sm text-maroon-950 font-medium outline-none placeholder:text-maroon-900/40 focus:border-saffron-500 focus:ring-2 focus:ring-saffron-500/20 shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-maroon-950">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                className="mt-2 w-full rounded-lg border-2 border-gold-300 bg-white px-4 py-2.5 text-sm text-maroon-950 font-medium outline-none placeholder:text-maroon-900/40 focus:border-saffron-500 focus:ring-2 focus:ring-saffron-500/20 shadow-sm"
              />
            </div>
            {error && <p className="text-sm text-rose-600">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-gradient-to-r from-saffron-600 to-gold-500 px-4 py-3 text-sm font-bold text-white shadow-md hover:brightness-110 disabled:opacity-50 transition"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <div className="mt-8 text-center pt-6 border-t border-gold-200">
            <Link href="/" className="block text-sm font-bold text-maroon-800 hover:text-saffron-700 transition">
              ← Back to site
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
