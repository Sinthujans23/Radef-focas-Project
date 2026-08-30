import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { saveUploadedFile } from "@/lib/upload";
import translate from "translate";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const { data: post, error: fetchError } = await supabaseAdmin
    .from("posts")
    .select("*")
    .eq("id", id)
    .single();

  if (fetchError || !post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  const formData = await request.formData();
  const text = formData.get("text");
  
  const updates: Record<string, unknown> = {};
  if (typeof text === "string") {
    updates.text = text.trim();
    if (updates.text) {
      try {
        updates.text_english = await translate(updates.text as string, "en");
        updates.text_tamil = await translate(updates.text as string, "ta");
      } catch (e) {
        console.error("Translation error", e);
      }
    } else {
      updates.text_english = "";
      updates.text_tamil = "";
    }
  }

  const removeMedia = formData.get("removeMedia") === "true";
  const file = formData.get("media");

  if (file instanceof File && file.size > 0) {
    try {
      const saved = await saveUploadedFile(file);
      updates.media_url = saved.url;
      updates.media_type = saved.mediaType;
    } catch (err) {
      return NextResponse.json({ error: (err as Error).message }, { status: 400 });
    }
  } else if (removeMedia) {
    updates.media_url = "";
    updates.media_type = "none";
  }

  const final_text = updates.text !== undefined ? updates.text : post.text;
  const final_media_url = updates.media_url !== undefined ? updates.media_url : post.media_url;

  if (!final_text && !final_media_url) {
    return NextResponse.json({ error: "Post must include text or media." }, { status: 400 });
  }

  const { data: updatedPost, error: updateError } = await supabaseAdmin
    .from("posts")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json(updatedPost);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const { error } = await supabaseAdmin.from("posts").delete().eq("id", id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
