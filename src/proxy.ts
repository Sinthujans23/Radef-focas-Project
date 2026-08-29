import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken, ADMIN_COOKIE_NAME } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminPage = pathname.startsWith("/admin") && pathname !== "/admin/login";
  const isAdminApi = pathname.startsWith("/api/admin") && pathname !== "/api/admin/login";
  const isRootPage = pathname === "/";

  if (!isAdminPage && !isAdminApi && !isRootPage) {
    return NextResponse.next();
  }

  if (isRootPage) {
    const adminToken = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
    const adminPayload = adminToken ? await verifyAdminToken(adminToken) : null;
    if (adminPayload) {
      return NextResponse.next();
    }

    const viewerToken = request.cookies.get("viewer_token")?.value;
    if (!viewerToken) {
      return NextResponse.redirect(new URL("/request-access", request.url));
    }
    return NextResponse.next();
  }

  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const payload = token ? await verifyAdminToken(token) : null;

  if (!payload) {
    if (isAdminApi) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const loginUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/admin/:path*", "/api/admin/:path*"],
};
