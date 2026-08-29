"use client";

import { useState } from "react";
import { OrganizationDTO } from "@/lib/types";

const FIELDS: { key: keyof OrganizationDTO; label: string; type?: string }[] = [
  { key: "name", label: "Organization name" },
  { key: "tagline", label: "Tagline" },
  { key: "description", label: "Description" },
  { key: "contactEmail", label: "Contact email" },
  { key: "contactPhone", label: "Contact phone" },
  { key: "address", label: "Address" },
  { key: "facebookUrl", label: "Facebook URL" },
  { key: "twitterUrl", label: "Twitter / X URL" },
  { key: "instagramUrl", label: "Instagram URL" },
];

export default function OrgSettingsForm({
  org,
  onSaved,
}: {
  org: OrganizationDTO;
  onSaved: (org: OrganizationDTO) => void;
}) {
  const [values, setValues] = useState(org);
  const [logo, setLogo] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  function update(key: keyof OrganizationDTO, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      const formData = new FormData();
      for (const { key } of FIELDS) {
        formData.append(key, values[key] as string);
      }
      if (logo) formData.append("logo", logo);

      const res = await fetch("/api/admin/org", { method: "PUT", body: formData });
      const data = await res.json();
      if (res.ok) {
        onSaved(data);
        setMessage("Saved.");
      } else {
        setMessage(data.error || "Could not save changes.");
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border-2 border-gold-300 bg-white p-6 shadow-xl transition hover:shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-saffron-600 via-gold-500 to-saffron-600" />
      <h2 className="font-heading text-xl font-bold text-maroon-950 flex items-center gap-2">
        <span className="text-gold-400">🪷</span> Organization Details
      </h2>

      {FIELDS.map(({ key, label }) => (
        <div key={key}>
          <label className="block text-sm font-bold text-maroon-950 mb-1">{label}</label>
          {key === "description" ? (
            <textarea
              value={values[key] as string}
              onChange={(e) => update(key, e.target.value)}
              rows={3}
              className="mt-1 w-full rounded-lg border-2 border-gold-200 bg-cream-50 px-4 py-2.5 text-sm font-medium text-maroon-950 outline-none placeholder:text-maroon-900/40 focus:border-saffron-500 focus:ring-2 focus:ring-saffron-500/20 shadow-sm"
            />
          ) : (
            <input
              value={values[key] as string}
              onChange={(e) => update(key, e.target.value)}
              className="mt-1 w-full rounded-lg border-2 border-gold-200 bg-cream-50 px-4 py-2.5 text-sm font-medium text-maroon-950 outline-none placeholder:text-maroon-900/40 focus:border-saffron-500 focus:ring-2 focus:ring-saffron-500/20 shadow-sm"
            />
          )}
        </div>
      ))}

      <div className="pt-2">
        <label className="block text-sm font-bold text-maroon-950 mb-1">Logo</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setLogo(e.target.files?.[0] || null)}
          className="mt-1 text-sm font-medium text-maroon-800"
        />
      </div>

      <div className="pt-4 flex items-center justify-between border-t border-gold-200">
        <p className="text-sm font-bold text-green-700">{message}</p>
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-gradient-to-r from-saffron-600 to-gold-500 px-6 py-2.5 text-sm font-bold text-white shadow-md hover:brightness-110 disabled:opacity-50 transition"
        >
          {saving ? "Saving..." : "Save changes"}
        </button>
      </div>
    </form>
  );
}
