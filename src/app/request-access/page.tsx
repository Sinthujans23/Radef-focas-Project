"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RequestAccessPage() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/request-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to submit request");
      }

      router.push("/");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 relative overflow-hidden bg-[#fdfaf6] bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]">
      <div className="w-full max-w-md rounded-2xl border-4 border-gold-400 bg-white p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-saffron-600 via-gold-500 to-saffron-600" />
        <div className="mb-8 text-center mt-2">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-cream-50 text-3xl shadow-inner border border-gold-300 ring-4 ring-gold-100">
            🔒
          </div>
          <h1 className="font-heading text-2xl font-bold text-maroon-950">
            Redef-Focas Director Board
          </h1>
          <p className="mt-2 text-sm font-medium text-maroon-900/70">
            This is a private space. Please request access to view the posts.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-bold text-maroon-950">
              Your Name
            </label>
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 block w-full rounded-lg border-2 border-gold-300 bg-white px-4 py-2.5 text-maroon-950 font-medium shadow-sm outline-none placeholder:text-maroon-900/40 focus:border-saffron-500 focus:ring-2 focus:ring-saffron-500/20"
              placeholder="John Doe"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-gradient-to-r from-saffron-600 to-gold-500 px-4 py-3 text-sm font-bold text-white shadow-md hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-saffron-500/50 focus:ring-offset-2 disabled:opacity-50 transition"
          >
            {loading ? "Submitting..." : "Request Access"}
          </button>
        </form>
        
        <div className="mt-8 text-center pt-6 border-t border-gold-200">
          <a href="/admin/login" className="text-xs font-bold text-maroon-800 hover:text-saffron-700 transition">
            Are you an Admin? Login here
          </a>
        </div>
      </div>
    </div>
  );
}
