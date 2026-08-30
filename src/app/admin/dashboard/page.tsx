import { cookies } from "next/headers";
import { supabase } from "@/lib/supabase";
import { verifyAdminToken, ADMIN_COOKIE_NAME } from "@/lib/auth";
import AdminDashboard from "@/components/admin/AdminDashboard";
import { OrganizationDTO, PostDTO } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  const payload = token ? await verifyAdminToken(token) : null;

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
    _id: "1", name: "Redef & Focas Director Board", tagline: "", description: "", logoUrl: "", contactEmail: "", contactPhone: "", address: "", facebookUrl: "", twitterUrl: "", instagramUrl: "", updatedAt: new Date().toISOString()
  };

  return (
    <AdminDashboard
      initialOrg={orgDto}
      initialPosts={posts}
      username={payload?.username || "admin"}
    />
  );
}
