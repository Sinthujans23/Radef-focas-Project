import Feed from "@/components/Feed";
import { supabase } from "@/lib/supabase";
import { PostDTO, OrganizationDTO } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function UpdatesPage() {
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

  const { data: org } = await supabase.from("organizations").select("*").eq("id", 1).single();
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
    <div className="space-y-6">
      <div className="flex items-center justify-center gap-3 mb-8 px-4 text-center">
        <span className="h-0.5 w-8 sm:w-12 bg-gradient-to-r from-transparent to-gold-400" />
        <h2 className="font-heading text-2xl sm:text-3xl font-bold tracking-wide text-maroon-950">
          Latest Updates
        </h2>
        <span className="h-0.5 w-8 sm:w-12 bg-gradient-to-l from-transparent to-gold-400" />
      </div>
      <Feed initialPosts={posts} org={orgDto} />
    </div>
  );
}
