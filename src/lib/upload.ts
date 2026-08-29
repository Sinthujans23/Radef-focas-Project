import { mkdir, writeFile } from "fs/promises";
import path from "path";
import crypto from "crypto";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

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

  await mkdir(UPLOAD_DIR, { recursive: true });

  const ext = path.extname(file.name) || (mediaType === "image" ? ".jpg" : ".mp4");
  const filename = `${Date.now()}-${crypto.randomBytes(8).toString("hex")}${ext}`;
  const filePath = path.join(UPLOAD_DIR, filename);

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(filePath, buffer);

  return { url: `/uploads/${filename}`, mediaType };
}
