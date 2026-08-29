import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { supabase } from "@/lib/supabase";
import { signAdminToken, ADMIN_COOKIE_NAME } from "@/lib/auth";
import { checkRateLimit, clientIp } from "@/lib/rateLimit";

export async function POST(request: NextRequest) {
  const { username, password } = await request.json();

  if (!username || !password) {
    return NextResponse.json({ error: "Username and password are required" }, { status: 400 });
  }

  if (!checkRateLimit(`login:${clientIp(request)}`, 8, 5 * 60_000)) {
    return NextResponse.json(
      { error: "Too many login attempts. Please try again in a few minutes." },
      { status: 429 }
    );
  }

  const { data: admin } = await supabase
    .from("admins")
    .select("*")
    .eq("username", username.trim().toLowerCase())
    .single();

  if (!admin) {
    return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
  }

  const isValid = await bcrypt.compare(password, admin.password_hash);
  if (!isValid) {
    return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
  }

  const token = await signAdminToken({ adminId: String(admin.id), username: admin.username });

  const response = NextResponse.json({ success: true, username: admin.username });
  response.cookies.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}
