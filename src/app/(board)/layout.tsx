import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { verifyAdminToken, ADMIN_COOKIE_NAME } from "@/lib/auth";
import SiteHeader from "@/components/SiteHeader";
import NavigationBar from "@/components/NavigationBar";
import SiteFooter from "@/components/SiteFooter";
import AutoRefresh from "@/components/AutoRefresh";

export const dynamic = "force-dynamic";

async function getOrgData() {
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

  return org ? {
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
  } : {
    _id: "1", name: "Redef & Focas Director Board", tagline: "", description: "", logoUrl: "", contactEmail: "", contactPhone: "", address: "", facebookUrl: "", twitterUrl: "", instagramUrl: "", updatedAt: new Date().toISOString()
  };
}

export default async function BoardLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const adminToken = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  const adminPayload = adminToken ? await verifyAdminToken(adminToken) : null;

  if (!adminPayload) {
    const token = cookieStore.get("viewer_token")?.value;
    
    if (!token) {
      redirect("/request-access");
    }

    const { data: req } = await supabase
      .from("access_requests")
      .select("*")
      .eq("viewer_token", token)
      .single();

    if (!req) {
      redirect("/request-access");
    }

    if (req.status === "pending") {
      return (
        <div className="flex min-h-screen items-center justify-center p-4 text-center relative overflow-hidden bg-[#fdfaf6] bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]">
          <AutoRefresh interval={3000} />
          <div className="w-full max-w-md rounded-2xl border-4 border-gold-400 bg-white p-8 shadow-2xl relative overflow-hidden text-maroon-950">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-saffron-600 via-gold-500 to-saffron-600" />
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-cream-50 text-3xl shadow-inner border border-gold-300 ring-4 ring-gold-100 mb-6">
              ⏳
            </div>
            <h1 className="font-heading text-2xl font-bold text-maroon-950">Request Pending</h1>
            <p className="mt-4 text-maroon-900/70 font-medium">
              Your request for access is currently pending approval by the admin. Please check back later.
            </p>
            <div className="mt-8 text-center pt-6 border-t border-gold-200">
              <a href="/admin/login" className="text-sm font-bold text-maroon-800 hover:text-saffron-700 transition">
                Admin Login
              </a>
            </div>
          </div>
        </div>
      );
    } else if (req.status === "rejected") {
      return (
        <div className="flex min-h-screen items-center justify-center p-4 text-center relative overflow-hidden bg-[#fdfaf6] bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]">
          <div className="w-full max-w-md rounded-2xl border-4 border-gold-400 bg-white p-8 shadow-2xl relative overflow-hidden text-maroon-950">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-rose-600 via-rose-500 to-rose-600" />
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-50 text-3xl shadow-inner border border-rose-300 ring-4 ring-rose-100 mb-6">
              ❌
            </div>
            <h1 className="font-heading text-2xl font-bold text-rose-600">Access Denied</h1>
            <p className="mt-4 text-maroon-900/70 font-medium">
              Your request for access has been declined.
            </p>
            <div className="mt-8 text-center pt-6 border-t border-gold-200">
              <a href="/admin/login" className="text-sm font-bold text-maroon-800 hover:text-saffron-700 transition">
                Admin Login
              </a>
            </div>
          </div>
        </div>
      );
    }
  }

  const org = await getOrgData();

  return (
    <div className="flex min-h-screen flex-col relative text-maroon-950">
      <SiteHeader org={org} />
      <NavigationBar />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 relative z-10">
        {children}
      </main>
      <SiteFooter org={org} />
    </div>
  );
}
