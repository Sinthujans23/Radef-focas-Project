"use client";

import { useState, useEffect } from "react";
import { OrganizationDTO, PostDTO } from "@/lib/types";
import { getViewerId, getViewerName, setViewerName } from "@/lib/viewer";
import Avatar from "./Avatar";
import Lightbox from "./Lightbox";
import ReactMarkdown from "react-markdown";

function formatDate(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function PostCard({ post, org }: { post: PostDTO; org: OrganizationDTO }) {
  const [likes, setLikes] = useState(post.likes);
  const [comments, setComments] = useState(post.comments);
  const [name, setName] = useState("");
  const [editingName, setEditingName] = useState(false);

  useEffect(() => {
    const vName = getViewerName();
    setName(vName);
    setEditingName(!vName);
  }, []);
  const [commentText, setCommentText] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [language, setLanguage] = useState<"original" | "english" | "tamil">("original");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const viewerId = mounted ? getViewerId() : "";
  const liked = likes.includes(viewerId);

  async function toggleLike() {
    const res = await fetch(`/api/posts/${post._id}/like`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ viewerId: getViewerId() }),
    });
    if (!res.ok) return;
    const data = await res.json();
    setLikes((prev) =>
      data.liked ? [...prev, viewerId] : prev.filter((id) => id !== viewerId)
    );
  }

  async function submitComment(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!name.trim() || !commentText.trim()) {
      setError("Please enter your name and a comment.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`/api/posts/${post._id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ viewerId: getViewerId(), name, text: commentText }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not post comment.");
        return;
      }
      setComments((prev) => [...prev, data]);
      setCommentText("");
      setViewerName(name);
      setEditingName(false);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <article className="overflow-hidden rounded-2xl bg-white border border-gold-300 shadow-xl transition-all duration-300 hover:shadow-2xl hover:shadow-gold-500/20 hover:-translate-y-1 relative group">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-saffron-600 via-gold-500 to-saffron-600" />
      <div className="flex items-center gap-3 p-4">
        <Avatar name={org.name} imageUrl={org.logoUrl} size={44} />
        <div className="min-w-0">
          <p className="truncate font-heading font-bold text-lg text-maroon-950">{org.name}</p>
          <p className="flex items-center gap-1 text-xs text-maroon-700/80 font-medium">
            {mounted ? formatDate(post.createdAt) : ""} <span aria-hidden>· 🪔</span>
          </p>
        </div>
      </div>

      {post.text && (
        <div className="px-5 pb-4">
          <div className={`whitespace-pre-wrap leading-relaxed font-medium text-sm sm:text-base prose prose-maroon max-w-none ${language === "tamil" ? "font-tamil text-maroon-800 text-lg" : "text-maroon-900"}`}>
            <ReactMarkdown
              components={{
                p: ({node, ...props}) => <p className="mb-4 last:mb-0" {...props} />,
                ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-4" {...props} />,
                ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-4" {...props} />,
                li: ({node, ...props}) => <li className="mb-1" {...props} />,
                strong: ({node, ...props}) => <strong className="font-bold text-maroon-950" {...props} />,
                em: ({node, ...props}) => <em className="italic opacity-90" {...props} />,
              }}
            >
              {language === "english" && post.textEnglish
                ? post.textEnglish
                : language === "tamil" && post.textTamil
                ? post.textTamil
                : post.text}
            </ReactMarkdown>
          </div>
          {(post.textEnglish || post.textTamil) && (
            <div className="mt-3 flex gap-3 text-xs font-bold text-saffron-700">
              {post.textEnglish && language !== "english" && (
                <button onClick={() => setLanguage("english")} className="hover:underline flex items-center gap-1">
                  <span className="text-lg">🌐</span> See Translation (English)
                </button>
              )}
              {post.textTamil && language !== "tamil" && (
                <button onClick={() => setLanguage("tamil")} className="hover:underline flex items-center gap-1">
                  <span className="text-lg">🌐</span> See Translation (Tamil)
                </button>
              )}
              {language !== "original" && (
                <button onClick={() => setLanguage("original")} className="hover:underline flex items-center gap-1">
                  <span className="text-lg">👁️</span> See Original
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {post.mediaType === "image" && post.mediaUrl && (
        <div className="relative group cursor-pointer" onClick={() => setLightboxOpen(true)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={post.mediaUrl} alt="" className="max-h-[600px] w-full object-cover transition duration-300 group-hover:brightness-90" />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="bg-black/50 text-white px-4 py-2 rounded-full font-bold shadow-lg flex items-center gap-2 border border-white/20">
              <span className="text-xl">⛶</span> View Full Image
            </span>
          </div>
        </div>
      )}
      {post.mediaType === "video" && post.mediaUrl && (
        <video src={post.mediaUrl} controls className="max-h-[600px] w-full bg-black" />
      )}
      {post.mediaType === "document" && post.mediaUrl && (
        <div className="border-y border-gold-200 bg-saffron-50 px-4 py-6 text-center transition flex flex-col items-center justify-center gap-3 hover:bg-saffron-100">
          <a
            href={post.mediaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 font-bold text-maroon-900 hover:text-maroon-700"
          >
            <span className="text-3xl">📜</span>
            <span className="underline decoration-dotted underline-offset-4">View Attached Document</span>
          </a>
          <a
            href={post.mediaUrl + "?download=true"}
            download
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 rounded-full bg-maroon-900 px-4 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-maroon-800 transition"
          >
            📥 Download
          </a>
        </div>
      )}

      {(likes.length > 0 || comments.length > 0) && (
        <div className="flex items-center justify-between px-5 py-3 text-xs font-bold text-maroon-800 bg-cream-50/50">
          <span className="flex items-center gap-1.5">
            {likes.length > 0 && (
              <>
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-saffron-600 text-[10px] text-white shadow-sm ring-2 ring-white">
                  🪷
                </span>
                {likes.length}
              </>
            )}
          </span>
          {comments.length > 0 && (
            <button
              onClick={() => setShowComments((v) => !v)}
              className="hover:underline"
            >
              {comments.length} comment{comments.length === 1 ? "" : "s"}
            </button>
          )}
        </div>
      )}

      <div className="flex flex-col sm:flex-row border-t border-gold-200 px-2 py-1 bg-white">
        <button
          onClick={toggleLike}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-bold transition ${
            liked ? "text-saffron-600 hover:bg-saffron-50" : "text-maroon-800 hover:bg-cream-100"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill={liked ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth={1.8}
            className="h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
            />
          </svg>
          Like
        </button>

        <button
          onClick={() => setShowComments((v) => !v)}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-bold text-maroon-800 hover:bg-cream-100 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            className="h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm3.75 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm3.75 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"
            />
          </svg>
          Comment
        </button>

        {post.mediaUrl && (
          <a
            href={post.mediaUrl + "?download=true"}
            download
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-bold text-maroon-800 hover:bg-cream-100 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.8}
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
              />
            </svg>
            Download
          </a>
        )}
      </div>

      {showComments && (
        <div className="space-y-4 border-t border-gold-200 bg-cream-50 p-5">
          {comments.map((c) => (
            <div key={c._id} className="flex items-start gap-3">
              <Avatar name={c.name} size={36} />
              <div className="min-w-0">
                <div className="inline-block rounded-2xl rounded-tl-sm bg-white border border-gold-200 px-4 py-2 shadow-sm">
                  <p className="text-sm font-bold text-maroon-950">{c.name}</p>
                  <p className="text-sm text-maroon-900/90 font-medium leading-snug mt-0.5">{c.text}</p>
                </div>
                <p className="mt-1 pl-1 text-xs font-semibold text-maroon-700/60">{mounted ? formatDate(c.createdAt) : ""}</p>
              </div>
            </div>
          ))}

          <form onSubmit={submitComment} className="flex flex-col sm:flex-row items-start gap-2 sm:gap-3 pt-1">
            <div className="hidden sm:block">
              <Avatar name={name || "?"} size={32} />
            </div>
            <div className="flex-1 w-full space-y-1.5">
              {editingName ? (
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  maxLength={60}
                  className="w-full rounded-full border border-gold-300 bg-white px-4 py-2 text-sm text-maroon-950 font-bold outline-none placeholder:text-maroon-900/40 focus:border-saffron-500 focus:ring-2 focus:ring-saffron-500/20 shadow-sm"
                />
              ) : (
                <p className="px-1 text-xs text-maroon-900/70 font-medium">
                  Commenting as <span className="font-bold text-maroon-950">{name}</span>{" "}
                  <button
                    type="button"
                    onClick={() => setEditingName(true)}
                    className="underline decoration-dotted font-bold hover:text-saffron-700"
                  >
                    change
                  </button>
                </p>
              )}
              <div className="flex items-center gap-2 mt-1">
                <input
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Write a comment..."
                  maxLength={1000}
                  className="w-full rounded-full border border-gold-300 bg-white px-4 py-2 text-sm font-medium text-maroon-950 outline-none placeholder:text-maroon-900/40 focus:border-saffron-500 focus:ring-2 focus:ring-saffron-500/20 shadow-sm"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="shrink-0 rounded-full bg-gradient-to-r from-saffron-600 to-gold-500 px-5 py-2 text-sm font-bold text-white shadow-md hover:brightness-110 disabled:opacity-50 transition"
                >
                  {submitting ? "..." : "Post"}
                </button>
              </div>
              {error && <p className="text-xs text-rose-600">{error}</p>}
            </div>
          </form>
        </div>
      )}

      {post.mediaType === "image" && post.mediaUrl && (
        <Lightbox 
          src={lightboxOpen ? post.mediaUrl : null} 
          onClose={() => setLightboxOpen(false)} 
        />
      )}
    </article>
  );
}
