import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const { name } = await req.json();

    if (!name || typeof name !== "string") {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const viewerToken = crypto.randomUUID();

    const { error: insertError } = await supabase.from("access_requests").insert([
      {
        name: name.trim(),
        viewer_token: viewerToken,
        status: "pending",
      },
    ]);

    if (insertError) {
      throw insertError;
    }

    const cookieStore = await cookies();
    cookieStore.set("viewer_token", viewerToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365, // 1 year
      path: "/",
    });

    return NextResponse.json({ success: true, status: "pending" });
  } catch (error) {
    console.error("Access request error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
