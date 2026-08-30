import path from "path";
import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabase";

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const VIDEO_TYPES = ["video/mp4", "video/webm", "video/ogg", "video/quicktime"];
const DOC_TYPES = ["application/pdf"];
const MAX_SIZE_BYTES = 100 * 1024 * 1024; // 100MB

export type SavedMedia = {
  url: string;
  mediaType: "image" | "video" | "document";
};

export async function saveUploadedFile(file: File): Promise<SavedMedia> {
  if (file.size > MAX_SIZE_BYTES) {
    throw new Error("File is too large. Maximum size is 100MB.");
  }

  let mediaType: "image" | "video" | "document";
  if (IMAGE_TYPES.includes(file.type)) {
    mediaType = "image";
  } else if (VIDEO_TYPES.includes(file.type)) {
    mediaType = "video";
  } else if (DOC_TYPES.includes(file.type) || file.name.toLowerCase().endsWith(".pdf")) {
    mediaType = "document";
  } else {
    throw new Error("Unsupported file type. Allowed: images, videos, and PDFs.");
  }

  const ext = path.extname(file.name) || (mediaType === "image" ? ".jpg" : mediaType === "video" ? ".mp4" : ".pdf");
  const filename = `${Date.now()}-${crypto.randomBytes(8).toString("hex")}${ext}`;

  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await supabaseAdmin.storage
    .from("uploads")
    .upload(filename, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    throw new Error(`Supabase storage error: ${error.message}`);
  }

  const { data: { publicUrl } } = supabaseAdmin.storage
    .from("uploads")
    .getPublicUrl(filename);

  return { url: publicUrl, mediaType };
}
