import { supabase } from "@/lib/supabase";
import { OrganizationDTO } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const { data: orgData } = await supabase.from("organizations").select("*").eq("id", 1).single();
  const org: OrganizationDTO = orgData ? {
    _id: String(orgData.id),
    name: orgData.name,
    tagline: orgData.tagline || "",
    description: orgData.description || "",
    logoUrl: orgData.logo_url || "",
    contactEmail: orgData.contact_email || "",
    contactPhone: orgData.contact_phone || "",
    address: orgData.address || "",
    facebookUrl: orgData.facebook_url || "",
    twitterUrl: orgData.twitter_url || "",
    instagramUrl: orgData.instagram_url || "",
    updatedAt: orgData.updated_at,
  } : {
    _id: "1", name: "Redef & Focas Director Board", tagline: "", description: "", logoUrl: "", contactEmail: "", contactPhone: "", address: "", facebookUrl: "", twitterUrl: "", instagramUrl: "", updatedAt: new Date().toISOString()
  };

  return (
    <section className="rounded-3xl border-2 border-gold-300 bg-white shadow-2xl relative overflow-hidden transition hover:shadow-gold-500/10">
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-saffron-600 via-gold-500 to-saffron-600" />
      <div className="px-6 py-10 sm:p-8">
      
        <div className="flex items-center justify-center mb-6">
             <h2 className="mx-4 font-heading text-2xl font-bold uppercase tracking-widest text-maroon-950 text-center">
               About Us
             </h2>
        </div>

        {/* Letterhead Section */}
        <div className="mb-10 rounded-xl border border-gold-300 bg-cream-50 p-6 shadow-inner text-center">
          <div className="space-y-4">
            <div>
              <h3 className="font-tamil text-lg sm:text-xl font-bold text-maroon-900 leading-snug">
                சமூக முன்னேற்றக் கழகங்களின் சமாசத்தினதும்<br />
                புனர்வாழ்வு - கல்வி அபிவிருத்தி நிதியத்தினதும் பணிப்பாளர்கள் சபை
              </h3>
            </div>
            
            <div>
              <h3 className="font-heading text-[13px] sm:text-[15px] font-bold text-maroon-950 uppercase leading-snug tracking-wide">
                Board of Directors of Federation of Community Advancement<br />
                Societies and the Rehabilitation & Education Development Fund
              </h3>
            </div>
            
            <div>
              <h3 className="text-sm sm:text-base font-bold text-maroon-900 leading-snug">
                ප්‍රජා සංවර්ධන සම්මේලනයේ අධ්‍යක්ෂ මණ්ඩලය<br />
                සමාජ සහ පුනරුත්ථාපන සහ අධ්‍යාපන සංවර්ධන අරමුදල
              </h3>
            </div>
          </div>

          <div className="my-5 mx-auto w-3/4 border-t border-gold-400/50 border-dashed"></div>

          <div className="space-y-1 text-xs sm:text-sm font-bold text-maroon-900">
            <p className="font-tamil">M.B.M மன்றக் கட்டடத் தொகுதி, காங்கேசன்துறை வீதி, மாவிட்டபுரம், தெல்லிப்பளை</p>
            <p>M.B.M Mandram - Building Complex, K.K.S Road, Maviddapuram, Tellipalai.</p>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-xs sm:text-sm font-bold text-maroon-950">
            <div className="flex items-center gap-2">
              <span className="text-right leading-tight">
                <span className="font-tamil">ஸ்தாபிதம்</span><br />
                Estd
              </span>
              <span className="text-2xl font-light text-gold-500">{"}"}</span>
              <span>1981-04-15</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-right leading-tight">
                <span className="font-tamil">சட்ட இல.</span><br />
                Act No.
              </span>
              <span className="text-2xl font-light text-gold-500">{"}"}</span>
              <span>52/1999</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-right leading-tight">
                <span className="font-tamil">சட்ட பதிவுத் திகதி</span><br />
                Act Certified Date
              </span>
              <span className="text-2xl font-light text-gold-500">{"}"}</span>
              <span>1999-12-14</span>
            </div>
          </div>
        </div>
        
        {org.description ? (
          <p className="whitespace-pre-wrap leading-relaxed text-maroon-900 font-medium text-center max-w-xl mx-auto">
            {org.description}
          </p>
        ) : (
          <p className="text-maroon-900/60 font-medium text-center italic">
            No description provided yet.
          </p>
        )}

        {(org.address || org.contactEmail || org.contactPhone) && (
          <div className="mt-8 flex flex-col sm:flex-row flex-wrap justify-center gap-3">
            {org.address && (
              <span className="inline-flex items-center justify-center gap-1.5 rounded-full bg-cream-100 border border-gold-200 px-4 py-2 sm:py-1.5 text-sm font-bold text-maroon-900 shadow-sm">
                📍 {org.address}
              </span>
            )}
            {org.contactEmail && (
              <span className="inline-flex items-center justify-center gap-1.5 rounded-full bg-cream-100 border border-gold-200 px-4 py-2 sm:py-1.5 text-sm font-bold text-maroon-900 shadow-sm">
                ✉️ {org.contactEmail}
              </span>
            )}
            {org.contactPhone && (
              <span className="inline-flex items-center justify-center gap-1.5 rounded-full bg-cream-100 border border-gold-200 px-4 py-2 sm:py-1.5 text-sm font-bold text-maroon-900 shadow-sm">
                📞 {org.contactPhone}
              </span>
            )}
          </div>
        )}

        {(org.facebookUrl || org.twitterUrl || org.instagramUrl) && (
          <div className="mt-6 flex justify-center gap-6 border-t border-gold-200 pt-6 text-sm font-bold">
            {org.facebookUrl && (
              <a
                href={org.facebookUrl}
                target="_blank"
                rel="noreferrer"
                className="text-saffron-600 hover:text-saffron-700 transition"
              >
                Facebook
              </a>
            )}
            {org.twitterUrl && (
              <a
                href={org.twitterUrl}
                target="_blank"
                rel="noreferrer"
                className="text-saffron-600 hover:text-saffron-700 transition"
              >
                Twitter / X
              </a>
            )}
            {org.instagramUrl && (
              <a
                href={org.instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="text-saffron-600 hover:text-saffron-700 transition"
              >
                Instagram
              </a>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
