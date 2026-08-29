import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
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
