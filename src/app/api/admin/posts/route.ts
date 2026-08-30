import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { saveUploadedFile } from "@/lib/upload";
import translate from "translate";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const text = (formData.get("text") as string | null)?.trim() || "";
  const file = formData.get("media");

  let mediaUrl = "";
  let mediaType: "none" | "image" | "video" | "document" = "none";

  if (file instanceof File && file.size > 0) {
    try {
      const saved = await saveUploadedFile(file);
      mediaUrl = saved.url;
      mediaType = saved.mediaType;
    } catch (err) {
      return NextResponse.json({ error: (err as Error).message }, { status: 400 });
    }
  }

  if (!text && !mediaUrl) {
    return NextResponse.json({ error: "Post must include text or media." }, { status: 400 });
  }

  let textEnglish = "";
  let textTamil = "";
  if (text) {
    try {
      textEnglish = await translate(text, "en");
      textTamil = await translate(text, "ta");
    } catch (e) {
      console.error("Translation error", e);
    }
  }

  const { data: post, error } = await supabaseAdmin
    .from("posts")
    .insert([
      {
        text,
        text_english: textEnglish,
        text_tamil: textTamil,
        media_url: mediaUrl,
        media_type: mediaType,
      },
    ])
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Format back to DTO
  const dto = {
    _id: post.id,
    text: post.text,
    textEnglish: post.text_english,
    textTamil: post.text_tamil,
    mediaUrl: post.media_url,
    mediaType: post.media_type,
    likes: [],
    comments: [],
    createdAt: post.created_at,
  };

  return NextResponse.json(dto, { status: 201 });
}
