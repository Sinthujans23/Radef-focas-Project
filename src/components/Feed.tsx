"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { OrganizationDTO, PostDTO } from "@/lib/types";
import PostCard from "./PostCard";

export default function Feed({
  initialPosts,
  org,
}: {
  initialPosts: PostDTO[];
  org: OrganizationDTO;
}) {
  const [posts, setPosts] = useState(initialPosts);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/posts", { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();
      setPosts(data);
    } catch {
      // ignore transient network errors
    }
  }, []);

  useEffect(() => {
    window.addEventListener("rf:refresh-feed", refresh);
    return () => window.removeEventListener("rf:refresh-feed", refresh);
  }, [refresh]);

  if (posts.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border-2 border-gold-300 bg-white p-12 text-center shadow-md relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-saffron-600 via-gold-500 to-saffron-600" />
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-saffron-50 text-3xl shadow-inner border border-gold-200">
          🪔
        </div>
        <p className="mt-4 text-lg font-heading text-maroon-900 font-bold">No posts yet</p>
        <p className="mt-1 text-sm text-maroon-700/70 font-medium">Check back soon for updates.</p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map((post, i) => (
        <motion.div
          key={post._id}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <PostCard post={post} org={org} />
        </motion.div>
      ))}
    </div>
  );
}
