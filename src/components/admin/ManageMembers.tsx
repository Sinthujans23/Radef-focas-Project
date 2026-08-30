"use client";

import { useState, useEffect } from "react";
import { MemberDTO } from "@/lib/types";

export default function ManageMembers() {
  const [members, setMembers] = useState<MemberDTO[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Add Member State
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [address, setAddress] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMembers();
  }, []);

  async function fetchMembers() {
    // We can fetch from a public API if we create one, or just query supabase client-side
    // Actually, creating a public GET API is better or just calling supabase client directly since it's RLS enabled for public read
    // But since it's admin, let's create a quick fetch. Wait, we don't have a GET /api/members route. 
    // We can just use supabase client directly.
    const { supabase } = await import("@/lib/supabase");
    const { data, error } = await supabase.from("members").select("*").order("created_at", { ascending: true });
    
    if (data) {
      setMembers(data.map(m => ({
        _id: String(m.id),
        name: m.name,
        role: m.role || "",
        address: m.address || "",
        imageUrl: m.image_url || "",
        createdAt: m.created_at
      })));
    }
    setLoading(false);
  }

  async function handleAddMember(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!name.trim()) {
      setError("Name is required");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, role, address, imageUrl }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to add member");
        return;
      }
      setMembers(prev => [...prev, {
        _id: String(data.id),
        name: data.name,
        role: data.role || "",
        address: data.address || "",
        imageUrl: data.image_url || "",
        createdAt: data.created_at
      }]);
      setName("");
      setRole("");
      setAddress("");
      setImageUrl("");
    } catch (err) {
      setError("An error occurred");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to remove this member?")) return;
    
    try {
      const res = await fetch(`/api/admin/members/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        alert("Failed to delete member");
        return;
      }
      setMembers(prev => prev.filter(m => m._id !== id));
    } catch (err) {
      alert("An error occurred while deleting");
    }
  }

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-gold-300 bg-white p-6 shadow-md">
        <h3 className="mb-4 font-heading text-lg font-bold text-maroon-950">Add New Member</h3>
        <form onSubmit={handleAddMember} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-maroon-900 mb-1">Name *</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-md border border-gold-300 bg-cream-50 px-3 py-2 text-sm text-maroon-950 outline-none focus:border-saffron-500 focus:ring-1 focus:ring-saffron-500"
                placeholder="Member Name"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-maroon-900 mb-1">Role / Designation</label>
              <input
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full rounded-md border border-gold-300 bg-cream-50 px-3 py-2 text-sm text-maroon-950 outline-none focus:border-saffron-500 focus:ring-1 focus:ring-saffron-500"
                placeholder="e.g. Director"
              />
            </div>
          </div>
            <div>
              <label className="block text-sm font-bold text-maroon-900 mb-1">Image URL</label>
              <input
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full rounded-md border border-gold-300 bg-cream-50 px-3 py-2 text-sm text-maroon-950 outline-none focus:border-saffron-500 focus:ring-1 focus:ring-saffron-500"
                placeholder="https://example.com/photo.jpg"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-maroon-900 mb-1">Address</label>
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full rounded-md border border-gold-300 bg-cream-50 px-3 py-2 text-sm text-maroon-950 outline-none focus:border-saffron-500 focus:ring-1 focus:ring-saffron-500"
                placeholder="e.g. Jaffna, Sri Lanka"
              />
            </div>

          {error && <p className="text-sm text-rose-600 font-bold">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="rounded-md bg-maroon-900 px-4 py-2 text-sm font-bold text-white hover:bg-maroon-800 disabled:opacity-50"
          >
            {submitting ? "Adding..." : "Add Member"}
          </button>
        </form>
      </div>

      <div className="rounded-2xl border border-gold-300 bg-white p-6 shadow-md">
        <h3 className="mb-4 font-heading text-lg font-bold text-maroon-950">Current Members</h3>
        {loading ? (
          <p className="text-sm text-maroon-900/60 font-medium">Loading members...</p>
        ) : members.length === 0 ? (
          <p className="text-sm text-maroon-900/60 font-medium">No members added yet.</p>
        ) : (
          <div className="divide-y divide-gold-200">
            {members.map(member => (
              <div key={member._id} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 shrink-0 rounded-full bg-cream-100 overflow-hidden flex items-center justify-center border border-gold-300">
                    {member.imageUrl ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={member.imageUrl} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-maroon-800 font-bold">{member.name.charAt(0)}</span>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-maroon-950">{member.name}</p>
                    <p className="text-xs font-medium text-maroon-800">{member.role}</p>
                    {member.address && <p className="text-xs text-maroon-700/80 mt-0.5">📍 {member.address}</p>}
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(member._id)}
                  className="text-xs font-bold text-rose-600 hover:text-rose-700 underline"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
