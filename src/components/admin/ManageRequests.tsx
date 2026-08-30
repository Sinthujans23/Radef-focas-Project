"use client";

import { useState, useEffect } from "react";

type RequestType = {
  _id: string;
  name: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
};

export default function ManageRequests() {
  const [requests, setRequests] = useState<RequestType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/requests")
      .then((res) => res.json())
      .then((data) => {
        setRequests(data);
        setLoading(false);
      });
  }, []);

  const handleUpdate = async (id: string, status: "approved" | "rejected") => {
    const res = await fetch("/api/admin/requests", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });

    if (res.ok) {
      const updated = await res.json();
      setRequests((prev) => prev.map((r) => (r._id === id ? { ...r, status: updated.status } : r)));
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12">
        <div className="animate-spin text-4xl text-saffron-500 drop-shadow-md">🪷</div>
        <p className="mt-4 font-heading font-bold text-maroon-900 animate-pulse">Loading requests...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {requests.length === 0 && (
        <div className="rounded-xl border-2 border-dashed border-gold-300 bg-white p-8 text-center text-maroon-800 font-medium shadow-sm">
          No access requests found.
        </div>
      )}
      
      {requests.map((req) => (
        <div
          key={req._id}
          className="flex items-center justify-between rounded-xl border-2 border-gold-200 bg-white p-5 shadow-md transition hover:shadow-lg"
        >
          <div>
            <p className="font-bold text-maroon-950">{req.name}</p>
            <p className="text-sm font-medium text-maroon-900/60">
              {typeof window !== "undefined" ? new Date(req.createdAt).toLocaleDateString() : ""}
            </p>
            <p className="mt-2 text-sm font-bold text-maroon-900">
              Status:{" "}
              <span
                className={`rounded-full px-3 py-1 text-xs border shadow-sm ${
                  req.status === "approved"
                    ? "bg-green-50 text-green-800 border-green-200"
                    : req.status === "rejected"
                    ? "bg-rose-50 text-rose-800 border-rose-200"
                    : "bg-saffron-50 text-saffron-800 border-saffron-200"
                }`}
              >
                {req.status}
              </span>
            </p>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => handleUpdate(req._id, "approved")}
              disabled={req.status === "approved"}
              className="rounded-md bg-green-50 border border-green-200 px-4 py-2 text-xs font-bold text-green-700 shadow-sm hover:bg-green-100 hover:border-green-300 disabled:opacity-50 transition"
            >
              Approve
            </button>
            <button
              onClick={() => handleUpdate(req._id, "rejected")}
              disabled={req.status === "rejected"}
              className="rounded-md bg-rose-50 border border-rose-200 px-4 py-2 text-xs font-bold text-rose-700 shadow-sm hover:bg-rose-100 hover:border-rose-300 disabled:opacity-50 transition"
            >
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
