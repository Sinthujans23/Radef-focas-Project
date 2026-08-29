import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { checkRateLimit, clientIp } from "@/lib/rateLimit";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { viewerId } = await request.json();

  if (!viewerId || typeof viewerId !== "string") {
    return NextResponse.json({ error: "viewerId is required" }, { status: 400 });
  }

  if (!checkRateLimit(`like:${clientIp(request)}:${viewerId}`, 30, 60_000)) {
    return NextResponse.json({ error: "Too many requests. Please slow down." }, { status: 429 });
  }

  const { data: post, error: fetchError } = await supabase
    .from("posts")
    .select("id")
    .eq("id", id)
    .single();

  if (fetchError || !post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  const { data: existingLike } = await supabase
    .from("post_likes")
    .select("*")
    .eq("post_id", id)
    .eq("viewer_id", viewerId)
    .single();

  let liked = false;
  if (existingLike) {
    await supabase.from("post_likes").delete().eq("post_id", id).eq("viewer_id", viewerId);
  } else {
    await supabase.from("post_likes").insert([{ post_id: id, viewer_id: viewerId }]);
    liked = true;
  }

  const { count } = await supabase
    .from("post_likes")
    .select("*", { count: "exact", head: true })
    .eq("post_id", id);

  return NextResponse.json({ liked, likeCount: count || 0 });
}
