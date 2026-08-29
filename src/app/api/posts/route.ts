import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const since = request.nextUrl.searchParams.get("since");

  if (since) {
    const { count } = await supabase
      .from("posts")
      .select("*", { count: "exact", head: true })
      .gt("created_at", new Date(since).toISOString());
      
    return NextResponse.json({ newCount: count || 0 });
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

  const posts = (postsData || []).map((p: Record<string, unknown>) => ({
    _id: p.id as string,
    text: (p.text as string) || "",
    textEnglish: (p.text_english as string) || "",
    textTamil: (p.text_tamil as string) || "",
    mediaUrl: (p.media_url as string) || "",
    mediaType: (p.media_type as "none" | "image" | "video" | "document") || "none",
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

  return NextResponse.json(posts);
}
