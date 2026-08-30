import { supabase } from "@/lib/supabase";
import { MemberDTO } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function MembersPage() {
  const { data: membersData } = await supabase
    .from("members")
    .select("*")
    .order("created_at", { ascending: true });

  const members: MemberDTO[] = (membersData || []).map((m) => ({
    _id: String(m.id),
    name: m.name,
    role: m.role || "",
    address: m.address || "",
    createdAt: m.created_at,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center gap-3 mb-8 px-4 text-center">
        <span className="h-0.5 w-8 sm:w-12 bg-gradient-to-r from-transparent to-gold-400" />
        <h2 className="font-heading text-2xl sm:text-3xl font-bold tracking-wide text-maroon-950">
          Board Members
        </h2>
        <span className="h-0.5 w-8 sm:w-12 bg-gradient-to-l from-transparent to-gold-400" />
      </div>

      {members.length === 0 ? (
        <div className="rounded-2xl border-2 border-gold-300 bg-white p-12 text-center shadow-md relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-saffron-600 via-gold-500 to-saffron-600" />
          <p className="text-lg font-heading text-maroon-900 font-bold">No members found</p>
          <p className="mt-1 text-sm text-maroon-700/70 font-medium">Check back soon for updates.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map((member) => (
            <div key={member._id} className="group relative flex flex-col items-center text-center p-6 bg-white rounded-2xl shadow-md border-2 border-transparent hover:border-gold-300 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <h3 className="text-xl font-heading font-bold text-maroon-950">{member.name}</h3>
              {member.role && (
                <p className="text-sm font-bold text-saffron-600 mt-1 uppercase tracking-wider">{member.role}</p>
              )}
              {member.address && (
                <p className="text-xs font-medium text-maroon-900/80 mt-2 bg-cream-50 px-2 py-1 rounded-md shadow-sm border border-gold-200">
                  📍 {member.address}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
