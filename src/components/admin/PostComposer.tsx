"use client";

import { useRef, useState } from "react";
import { PostDTO } from "@/lib/types";
import Avatar from "@/components/Avatar";

export default function PostComposer({
  orgName,
  orgLogo,
  onPosted,
}: {
  orgName: string;
  orgLogo?: string;
  onPosted: (post: PostDTO) => void;
}) {
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(selected: File | null) {
    setFile(selected);
    setPreview(selected ? URL.createObjectURL(selected) : null);
  }

  function clearFile() {
    handleFileChange(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!text.trim() && !file) {
      setError("Add some text or attach a photo/video.");
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("text", text);
      if (file) formData.append("media", file);

      const res = await fetch("/api/admin/posts", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not create post.");
        return;
      }
      onPosted(data);
      setText("");
      clearFile();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="overflow-hidden rounded-2xl bg-white border-2 border-gold-300 shadow-xl transition-shadow hover:shadow-2xl relative">
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-saffron-600 via-gold-500 to-saffron-600" />
      <div className="p-4">
        <div className="flex items-start gap-3">
          <Avatar name={orgName} imageUrl={orgLogo} size={44} />
          <textarea
            placeholder="Share an update... (Supports Markdown: **bold**, *italic*, - list)"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="min-h-[120px] w-full resize-none rounded-lg border-2 border-gold-200 bg-cream-50 p-4 text-sm font-medium text-maroon-950 outline-none placeholder:text-maroon-900/40 focus:border-saffron-500 focus:ring-2 focus:ring-saffron-500/20 shadow-sm"
          />
        </div>

        {preview && file && (
          <div className="relative mt-3 overflow-hidden rounded-xl border border-gold-200">
            <button
              type="button"
              onClick={clearFile}
              aria-label="Remove attachment"
              className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-maroon-950/70 text-white hover:bg-maroon-950"
            >
              ✕
            </button>
            {file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf") ? (
              <div className="flex h-32 items-center justify-center bg-black/20 text-white">
                <span className="text-4xl mr-3">📄</span>
                <span className="font-medium truncate max-w-[200px]">{file.name}</span>
              </div>
            ) : file.type.startsWith("video/") ? (
              <video src={preview} controls className="max-h-80 w-full bg-black" />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt="" className="max-h-80 w-full object-cover" />
            )}
          </div>
        )}

        {error && <p className="mt-2 text-sm text-rose-600">{error}</p>}
      </div>

      <div className="flex items-center justify-between border-t border-gold-200 bg-cream-50/50 px-4 py-3">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-bold text-maroon-900 hover:bg-white hover:text-saffron-700 shadow-sm transition"
        >
          <span className="text-lg">🖼️</span>
          Media / PDF
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*,.pdf"
          onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
          className="hidden"
        />

        <button
          type="submit"
          disabled={submitting || (!text.trim() && !file)}
          className="rounded-lg bg-gradient-to-r from-saffron-600 to-gold-500 px-5 py-2 text-sm font-bold text-white shadow-md hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40 transition"
        >
          {submitting ? "Posting..." : "Publish"}
        </button>
      </div>
    </form>
  );
}
