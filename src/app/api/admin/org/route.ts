import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { saveUploadedFile } from "@/lib/upload";

const TEXT_FIELDS = {
  name: "name",
  tagline: "tagline",
  description: "description",
  contactEmail: "contact_email",
  contactPhone: "contact_phone",
  address: "address",
  facebookUrl: "facebook_url",
  twitterUrl: "twitter_url",
  instagramUrl: "instagram_url",
};

export async function PUT(request: NextRequest) {
  const formData = await request.formData();
  const update: Record<string, unknown> = {};

  for (const [key, column] of Object.entries(TEXT_FIELDS)) {
    const value = formData.get(key);
    if (typeof value === "string") {
      update[column] = value;
    }
  }

  const logo = formData.get("logo");
  if (logo instanceof File && logo.size > 0) {
    try {
      const saved = await saveUploadedFile(logo);
      update.logo_url = saved.url;
    } catch (err) {
      return NextResponse.json({ error: (err as Error).message }, { status: 400 });
    }
  }

  update.updated_at = new Date().toISOString();

  const { data: org, error } = await supabase
    .from("organizations")
    .update(update)
    .eq("id", 1)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const dto = {
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
  };

  return NextResponse.json(dto);
}
