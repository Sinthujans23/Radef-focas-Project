import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const { name } = await req.json();

    if (!name || typeof name !== "string") {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const trimmedName = name.trim();

    // Check if name already exists (case-insensitive)
    const { data: existingReqs } = await supabase
      .from("access_requests")
      .select("*")
      .ilike("name", trimmedName)
      .order("created_at", { ascending: false })
      .limit(1);

    const existingReq = existingReqs && existingReqs.length > 0 ? existingReqs[0] : null;

    let viewerToken;
    let requestStatus = "pending";

    if (existingReq) {
      viewerToken = existingReq.viewer_token;
      requestStatus = existingReq.status;
    } else {
      viewerToken = crypto.randomUUID();
      const { error: insertError } = await supabase.from("access_requests").insert([
        {
          name: trimmedName,
          viewer_token: viewerToken,
          status: "pending",
        },
      ]);

      if (insertError) throw insertError;
    }

    const cookieStore = await cookies();
    cookieStore.set("viewer_token", viewerToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365, // 1 year
      path: "/",
    });

    return NextResponse.json({ success: true, status: requestStatus });
  } catch (error) {
    console.error("Access request error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
