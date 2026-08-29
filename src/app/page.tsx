import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import TempleDivider from "@/components/TempleDivider";
import Greeting from "@/components/Greeting";
import Feed from "@/components/Feed";
import { cookies } from "next/headers";
import { OrganizationDTO, PostDTO, CommentDTO } from "@/lib/types";
import { verifyAdminToken, ADMIN_COOKIE_NAME } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

async function getData() {
  // Fetch Organization
  const { data: orgData, error: orgError } = await supabase
    .from("organizations")
    .select("*")
    .eq("id", 1)
    .single();

  let org = orgData;
  if (orgError || !org) {
    const { data: newOrg } = await supabase
      .from("organizations")
      .insert([{ id: 1 }])
      .select()
      .single();
    org = newOrg;
  }

  // Fetch Posts with likes and comments
  const { data: postsData } = await supabase
    .from("posts")
    .select(`
      *,
      post_likes ( viewer_id ),
      post_comments ( * )
    `)
    .order("created_at", { ascending: false })
    .limit(100);

  const posts: PostDTO[] = (postsData || []).map((p: Record<string, unknown>) => ({
    _id: p.id as string,
    text: (p.text as string) || "",
    textEnglish: (p.text_english as string) || "",
    textTamil: (p.text_tamil as string) || "",
    mediaUrl: (p.media_url as string) || "",
    mediaType: (p.media_type as PostDTO["mediaType"]) || "none",
    likes: ((p.post_likes as Record<string, unknown>[]) || []).map((l) => l.viewer_id as string),
    comments: ((p.post_comments as Record<string, unknown>[]) || []).map((c) => ({
      _id: c.id as string,
      viewerId: c.viewer_id as string,
      name: c.name as string,
      text: c.text as string,
      createdAt: c.created_at as string,
    })),
    createdAt: p.created_at as string,
  }));

  const orgDto: OrganizationDTO = org ? {
    _id: String(org.id),
    name: org.name,
    tagline: org.tagline || "",
    description: org.description || "",
    logoUrl: org.logo_url || "",
    contactEmail: org.contact_email || "",
    contactPhone: org.contact_phone || "",
    address: org.address || "",
    facebookUrl: org.facebook_url || "",
    twitterUrl: org.twitter_url || "",
    instagramUrl: org.instagram_url || "",
    updatedAt: org.updated_at,
  } : {
    _id: "1", name: "Radef & Focas Director Board", tagline: "", description: "", logoUrl: "", contactEmail: "", contactPhone: "", address: "", facebookUrl: "", twitterUrl: "", instagramUrl: "", updatedAt: new Date().toISOString()
  };

  return { org: orgDto, posts };
}

export default async function Home() {
  const cookieStore = await cookies();
  const adminToken = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  const adminPayload = adminToken ? await verifyAdminToken(adminToken) : null;

  if (!adminPayload) {
    const token = cookieStore.get("viewer_token")?.value;
    if (token) {
      const { data: req } = await supabase
        .from("access_requests")
        .select("*")
        .eq("viewer_token", token)
        .single();

      if (!req || req.status === "pending") {
      return (
        <div className="flex min-h-screen items-center justify-center p-4 text-center">
          <div className="w-full max-w-md rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 p-8 shadow-2xl text-white">
            <h1 className="font-playfair text-2xl font-bold text-white">Request Pending</h1>
            <p className="mt-4 text-white/70">
              Your request for access is currently pending approval by the admin. Please check back later.
            </p>
            <div className="mt-6 text-center">
              <a href="/admin/login" className="text-xs text-white/50 hover:text-white hover:underline">
                Admin Login
              </a>
            </div>
          </div>
        </div>
      );
    } else if (req.status === "rejected") {
      return (
        <div className="flex min-h-screen items-center justify-center p-4 text-center">
          <div className="w-full max-w-md rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 p-8 shadow-2xl text-white">
            <h1 className="font-playfair text-2xl font-bold text-rose-400">Access Denied</h1>
            <p className="mt-4 text-white/70">
              Your request for access has been declined.
            </p>
            <div className="mt-6 text-center">
              <a href="/admin/login" className="text-xs text-white/50 hover:text-white hover:underline">
                Admin Login
              </a>
            </div>
          </div>
        </div>
      );
    }
  }
  }

  const { org, posts } = await getData();

  return (
    <div className="flex min-h-screen flex-col relative text-maroon-950">
      <SiteHeader org={org} />

      <main className="mx-auto w-full max-w-3xl flex-1 space-y-8 px-4 py-8 relative z-10">
        {(org.description || org.address || org.contactEmail || org.contactPhone) && (
          <section className="rounded-3xl border-2 border-gold-300 bg-white shadow-2xl relative overflow-hidden transition hover:shadow-gold-500/10">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-saffron-600 via-gold-500 to-saffron-600" />
            <div className="px-6 py-10 sm:p-8">
              <Greeting />
            
            <div className="flex items-center justify-center mb-6">
                 <span className="text-gold-400 text-2xl">🪷</span>
                 <h2 className="mx-4 font-heading text-2xl font-bold uppercase tracking-widest text-maroon-950 text-center">
                   About Us
                 </h2>
                 <span className="text-gold-400 text-2xl">🪷</span>
              </div>
              
              {org.description && (
                <p className="whitespace-pre-wrap leading-relaxed text-maroon-900 font-medium text-center max-w-xl mx-auto">
                  {org.description}
                </p>
              )}

              {(org.address || org.contactEmail || org.contactPhone) && (
                <div className="mt-8 flex flex-col sm:flex-row flex-wrap justify-center gap-3">
                  {org.address && (
                    <span className="inline-flex items-center justify-center gap-1.5 rounded-full bg-cream-100 border border-gold-200 px-4 py-2 sm:py-1.5 text-sm font-bold text-maroon-900 shadow-sm">
                      📍 {org.address}
                    </span>
                  )}
                  {org.contactEmail && (
                    <span className="inline-flex items-center justify-center gap-1.5 rounded-full bg-cream-100 border border-gold-200 px-4 py-2 sm:py-1.5 text-sm font-bold text-maroon-900 shadow-sm">
                      ✉️ {org.contactEmail}
                    </span>
                  )}
                  {org.contactPhone && (
                    <span className="inline-flex items-center justify-center gap-1.5 rounded-full bg-cream-100 border border-gold-200 px-4 py-2 sm:py-1.5 text-sm font-bold text-maroon-900 shadow-sm">
                      📞 {org.contactPhone}
                    </span>
                  )}
                </div>
              )}

              {(org.facebookUrl || org.twitterUrl || org.instagramUrl) && (
                <div className="mt-6 flex justify-center gap-6 border-t border-gold-200 pt-6 text-sm font-bold">
                  {org.facebookUrl && (
                    <a
                      href={org.facebookUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-saffron-600 hover:text-saffron-700 transition"
                    >
                      Facebook
                    </a>
                  )}
                  {org.twitterUrl && (
                    <a
                      href={org.twitterUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-saffron-600 hover:text-saffron-700 transition"
                    >
                      Twitter / X
                    </a>
                  )}
                  {org.instagramUrl && (
                    <a
                      href={org.instagramUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-saffron-600 hover:text-saffron-700 transition"
                    >
                      Instagram
                    </a>
                  )}
                </div>
              )}
            </div>
          </section>
        )}

        <div className="mt-12">
          <div className="flex items-center justify-center gap-3 mb-8 px-4 text-center">
            <span className="h-0.5 w-8 sm:w-12 bg-gradient-to-r from-transparent to-gold-400" />
            <h2 className="font-heading text-2xl sm:text-3xl font-bold tracking-wide text-maroon-950">
              Latest Updates
            </h2>
            <span className="h-0.5 w-8 sm:w-12 bg-gradient-to-l from-transparent to-gold-400" />
          </div>
          <Feed initialPosts={posts} org={org} />
        </div>
      </main>

      <SiteFooter org={org} />
    </div>
  );
}
