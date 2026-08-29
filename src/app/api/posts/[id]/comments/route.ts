import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { checkRateLimit, clientIp } from "@/lib/rateLimit";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { viewerId, name, text } = await request.json();

  if (!viewerId || typeof viewerId !== "string") {
    return NextResponse.json({ error: "viewerId is required" }, { status: 400 });
  }
  const trimmedName = (name || "").toString().trim().slice(0, 60);
  const trimmedText = (text || "").toString().trim().slice(0, 1000);

  if (!trimmedName || !trimmedText) {
    return NextResponse.json({ error: "Name and comment text are required" }, { status: 400 });
  }

  if (!checkRateLimit(`comment:${clientIp(request)}:${viewerId}`, 8, 60_000)) {
    return NextResponse.json(
      { error: "You're commenting too quickly. Please wait a moment." },
      { status: 429 }
    );
  }

  const { data: post, error: fetchError } = await supabase
    .from("posts")
    .select("id")
    .eq("id", id)
    .single();

  if (fetchError || !post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  const { data: comment, error: insertError } = await supabase
    .from("post_comments")
    .insert([
      {
        post_id: id,
        viewer_id: viewerId,
        name: trimmedName,
        text: trimmedText,
      },
    ])
    .select()
    .single();

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  return NextResponse.json(
    {
      _id: comment.id,
      viewerId: comment.viewer_id,
      name: comment.name,
      text: comment.text,
      createdAt: comment.created_at,
    },
    { status: 201 }
  );
}
