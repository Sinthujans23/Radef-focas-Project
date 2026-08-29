"use client";

import { useState, useRef, useEffect } from "react";
import { PostDTO } from "@/lib/types";

function formatDate(iso: string) {
  return new Date(iso).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}

function EditPostForm({
  post,
  onSaved,
  onCancel,
}: {
  post: PostDTO;
  onSaved: (post: PostDTO) => void;
  onCancel: () => void;
}) {
  const [text, setText] = useState(post.text);
  const [removeMedia, setRemoveMedia] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleSave() {
    setError("");
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("text", text);
      if (removeMedia) formData.append("removeMedia", "true");
      if (file) formData.append("media", file);

      const res = await fetch(`/api/admin/posts/${post._id}`, { method: "PUT", body: formData });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not save changes.");
        return;
      }
      onSaved(data);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4 rounded-xl border-2 border-gold-300 bg-cream-50 p-5 shadow-inner">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={3}
        maxLength={5000}
        className="w-full rounded-lg border-2 border-gold-200 bg-white px-4 py-2 text-sm font-medium text-maroon-950 outline-none placeholder:text-maroon-900/40 focus:border-saffron-500 focus:ring-2 focus:ring-saffron-500/20"
      />

      {post.mediaType !== "none" && !removeMedia && !file && (
        <label className="flex items-center gap-2 text-xs text-maroon-700/70">
          <input
            type="checkbox"
            checked={removeMedia}
            onChange={(e) => setRemoveMedia(e.target.checked)}
            className="accent-saffron-600"
          />
          Remove attached {post.mediaType}
        </label>
      )}

      <div className="flex items-center gap-3">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*,.pdf"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="text-xs text-maroon-700"
        />
        {file && <span className="text-xs text-maroon-700/50">{file.name}</span>}
      </div>

      {error && <p className="text-xs text-rose-600">{error}</p>}

      <div className="flex gap-3">
        <button
          onClick={handleSave}
          disabled={loading}
          className="rounded-lg bg-gradient-to-r from-saffron-600 to-gold-500 px-4 py-2 text-xs font-bold text-white shadow-md hover:brightness-110 disabled:opacity-50 transition"
        >
          {loading ? "Saving..." : "Save"}
        </button>
        <button
          onClick={onCancel}
          className="rounded-lg border-2 border-gold-300 bg-white px-4 py-2 text-xs font-bold text-maroon-800 hover:bg-cream-100 hover:text-maroon-950 shadow-sm transition"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

function CommentModeration({
  post,
  onCommentDeleted,
}: {
  post: PostDTO;
  onCommentDeleted: (commentId: string) => void;
}) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(commentId: string) {
    setDeletingId(commentId);
    try {
      const res = await fetch(`/api/admin/posts/${post._id}/comments/${commentId}`, {
        method: "DELETE",
      });
      if (res.ok) onCommentDeleted(commentId);
    } finally {
      setDeletingId(null);
    }
  }

  if (post.comments.length === 0) {
    return <p className="text-xs text-maroon-700/50">No comments yet.</p>;
  }

  return (
    <ul className="space-y-3 mt-3">
      {post.comments.map((c) => (
        <li
          key={c._id}
          className="flex items-start justify-between gap-3 rounded-lg border border-gold-200 bg-white px-4 py-3 text-xs shadow-sm"
        >
          <div className="min-w-0">
            <span className="font-bold text-maroon-950">{c.name}</span>{" "}
            <span className="text-maroon-900/50 font-medium">· {formatDate(c.createdAt)}</span>
            <p className="mt-1 font-medium text-maroon-900/90">{c.text}</p>
          </div>
          <button
            onClick={() => handleDelete(c._id)}
            disabled={deletingId === c._id}
            className="shrink-0 font-bold text-rose-600 hover:text-rose-500 disabled:opacity-50 transition bg-rose-50 px-3 py-1.5 rounded-md hover:bg-rose-100 border border-rose-100"
          >
            {deletingId === c._id ? "..." : "Remove"}
          </button>
        </li>
      ))}
    </ul>
  );
}

export default function ManagePosts({
  posts,
  onDeleted,
  onUpdated,
}: {
  posts: PostDTO[];
  onDeleted: (id: string) => void;
  onUpdated: (post: PostDTO) => void;
}) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  async function handleDelete(id: string) {
    if (!confirm("Delete this post? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/posts/${id}`, { method: "DELETE" });
      if (res.ok) onDeleted(id);
    } finally {
      setDeletingId(null);
    }
  }

  function handleCommentDeleted(post: PostDTO, commentId: string) {
    onUpdated({ ...post, comments: post.comments.filter((c) => c._id !== commentId) });
  }

  if (posts.length === 0) {
    return (
      <p className="rounded-xl border-2 border-dashed border-gold-300 bg-white p-8 text-center text-sm font-medium text-maroon-800 shadow-sm">
        No posts yet.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {posts.map((post) => (
        <div
          key={post._id}
          className="rounded-xl border-2 border-gold-200 bg-white p-5 shadow-md transition hover:shadow-lg"
        >
          {editingId === post._id ? (
            <EditPostForm
              post={post}
              onSaved={(updated) => {
                onUpdated(updated);
                setEditingId(null);
              }}
              onCancel={() => setEditingId(null)}
            />
          ) : (
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="mt-1 text-xs font-bold text-maroon-700/60">{mounted ? formatDate(post.createdAt) : ""}</p>
                {post.text && <p className="mt-2 text-sm font-medium text-maroon-950">{post.text}</p>}
                <p className="mt-2 text-xs font-bold text-maroon-800">
                  {post.mediaType !== "none" && `${post.mediaType} attached · `}
                  {post.likes.length} likes ·{" "}
                  <button
                    onClick={() => setExpandedId(expandedId === post._id ? null : post._id)}
                    className="underline decoration-dotted hover:text-saffron-700"
                  >
                    {post.comments.length} comments
                  </button>
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  onClick={() => setEditingId(post._id)}
                  className="rounded-md bg-cream-100 px-3 py-1.5 text-xs font-bold text-maroon-900 border border-gold-200 hover:bg-white hover:border-gold-300 shadow-sm transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(post._id)}
                  disabled={deletingId === post._id}
                  className="rounded-md bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-700 border border-rose-200 hover:bg-rose-100 hover:border-rose-300 shadow-sm disabled:opacity-50 transition"
                >
                  {deletingId === post._id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          )}

          {expandedId === post._id && editingId !== post._id && (
            <div className="mt-4 border-t border-gold-200 pt-3">
              <CommentModeration
                post={post}
                onCommentDeleted={(commentId) => handleCommentDeleted(post, commentId)}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
