import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  try {
    const { data: requests, error } = await supabase
      .from("access_requests")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    const dtos = requests.map((req) => ({
      _id: req.id,
      name: req.name,
      viewerToken: req.viewer_token,
      status: req.status,
      createdAt: req.created_at,
    }));

    return NextResponse.json(dtos);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch requests" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, status } = await req.json();
    if (!id || !status) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    
    const { data: updated, error } = await supabase
      .from("access_requests")
      .update({ status })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update request" }, { status: 500 });
  }
}
