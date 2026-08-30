"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { OrganizationDTO, PostDTO } from "@/lib/types";
import PostComposer from "./PostComposer";
import ManagePosts from "./ManagePosts";
import OrgSettingsForm from "./OrgSettingsForm";
import ManageRequests from "./ManageRequests";
import ManageMembers from "./ManageMembers";

type Tab = "posts" | "members" | "requests" | "settings";

export default function AdminDashboard({
  initialOrg,
  initialPosts,
  username,
}: {
  initialOrg: OrganizationDTO;
  initialPosts: PostDTO[];
  username: string;
}) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("posts");
  const [org, setOrg] = useState(initialOrg);
  const [posts, setPosts] = useState(initialPosts);

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen relative text-maroon-950 bg-[#fdfaf6] bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]">
      <header className="bg-gradient-to-b from-maroon-950 to-maroon-900 border-b-4 border-gold-500 shadow-xl">
        <div className="h-2 bg-gradient-to-r from-saffron-600 via-gold-500 to-saffron-600" />
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
          <div>
            <p className="font-heading text-lg font-bold tracking-wide text-gold-100 drop-shadow-md">
              Admin Dashboard
            </p>
            <p className="text-xs font-medium text-gold-300">Signed in as {username}</p>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm font-bold text-gold-100/70 hover:text-gold-100 transition">
              View site
            </Link>
            <button
              onClick={handleLogout}
              className="rounded-md bg-gradient-to-r from-saffron-600 to-maroon-700 px-4 py-2 text-sm font-bold text-white shadow-md hover:brightness-110 transition border border-gold-500/50"
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8 relative z-10">
        <div className="mb-6 flex gap-2 overflow-x-auto">
          {(["posts", "members", "requests", "settings"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`whitespace-nowrap rounded-lg px-5 py-2.5 text-sm font-bold shadow-sm transition ${
                tab === t
                  ? "bg-white border-2 border-gold-300 text-maroon-950"
                  : "bg-cream-100 border-2 border-transparent text-maroon-900/60 hover:bg-white hover:text-maroon-950"
              }`}
            >
              {t === "posts" ? "Posts" : t === "members" ? "Members" : t === "requests" ? "Access Requests" : "Organization Settings"}
            </button>
          ))}
        </div>

        {tab === "posts" && (
          <div className="space-y-6">
            <PostComposer
              orgName={org.name}
              orgLogo={org.logoUrl}
              onPosted={(post) => setPosts((prev) => [post, ...prev])}
            />
            <div>
              <div className="flex items-center gap-2 mb-4">
                 <span className="h-0.5 w-8 bg-gradient-to-r from-transparent to-gold-400" />
                 <h2 className="font-heading text-xl font-bold text-maroon-950">
                   Manage Posts
                 </h2>
                 <span className="h-0.5 w-8 bg-gradient-to-l from-transparent to-gold-400" />
              </div>
              <ManagePosts
                posts={posts}
                onDeleted={(id) => setPosts((prev) => prev.filter((p) => p._id !== id))}
                onUpdated={(updated) =>
                  setPosts((prev) => prev.map((p) => (p._id === updated._id ? updated : p)))
                }
              />
            </div>
          </div>
        )}

        {tab === "requests" && (
          <div>
            <div className="flex items-center gap-2 mb-4">
               <span className="h-0.5 w-8 bg-gradient-to-r from-transparent to-gold-400" />
               <h2 className="font-heading text-xl font-bold text-maroon-950">
                 Manage Access Requests
               </h2>
               <span className="h-0.5 w-8 bg-gradient-to-l from-transparent to-gold-400" />
            </div>
            <ManageRequests />
          </div>
        )}

        {tab === "members" && (
          <div>
            <div className="flex items-center gap-2 mb-4">
               <span className="h-0.5 w-8 bg-gradient-to-r from-transparent to-gold-400" />
               <h2 className="font-heading text-xl font-bold text-maroon-950">
                 Manage Board Members
               </h2>
               <span className="h-0.5 w-8 bg-gradient-to-l from-transparent to-gold-400" />
            </div>
            <ManageMembers />
          </div>
        )}

        {tab === "settings" && <OrgSettingsForm org={org} onSaved={setOrg} />}
      </main>
    </div>
  );
}
