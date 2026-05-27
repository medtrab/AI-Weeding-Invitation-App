"use client";
import { useState } from "react";
import { useRSVPList, useRSVPStats } from "@/hooks/useRSVP";
import { formatDate } from "@/lib/utils/format";
import type { RSVP } from "@/types";

const STATUS_PILL = {
  attending: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  declined:  "bg-red-500/10 text-red-400 border-red-500/20",
  maybe:     "bg-gold/10 text-gold border-gold/20",
};

export function RSVPTable({ invitationId }: { invitationId: string }) {
  const { data: rsvps = [], isLoading } = useRSVPList(invitationId);
  const { data: stats } = useRSVPStats(invitationId);
  const [filter, setFilter] = useState<"all"|"attending"|"declined"|"maybe">("all");
  const [search, setSearch] = useState("");

  const filtered = rsvps.filter((r) => {
    const mf = filter === "all" || r.status === filter;
    const ms = !search || r.guestName.toLowerCase().includes(search.toLowerCase()) || r.guestEmail?.toLowerCase().includes(search.toLowerCase());
    return mf && ms;
  });

  return (
    <div>
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label:"Total Responses", value: stats.total },
            { label:"Attending",       value: stats.attending },
            { label:"Declined",        value: stats.declined },
            { label:"Total Guests",    value: stats.totalGuests },
          ].map((s) => (
            <div key={s.label} className="bg-[#0D0B08] border border-gold/10 p-4">
              <p className="text-[10px] uppercase tracking-[0.15em] text-cream/35 mb-1">{s.label}</p>
              <p className="font-cormorant text-2xl font-light text-cream">{s.value}</p>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <input type="text" placeholder="Search guests..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="bg-[#0D0B08] border border-gold/15 text-cream text-sm px-3 py-2 outline-none placeholder:text-cream/20 flex-1 min-w-[180px]"
        />
        {(["all","attending","declined","maybe"] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 text-xs uppercase tracking-[0.12em] border transition-all ${f === filter ? "border-gold text-gold" : "border-cream/10 text-cream/35 hover:border-cream/30"}`}>
            {f}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-12 bg-cream/5 animate-pulse" />)}</div>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-cream/30 text-center py-12">No responses yet</p>
      ) : (
        <div className="border border-gold/10 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gold/10">
                {["Guest","Email","Status","Guests","Meal","Responded"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-[10px] uppercase tracking-[0.15em] text-cream/30 font-normal">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((rsvp, i) => (
                <tr key={rsvp.id} className={`border-b border-gold/5 hover:bg-gold/[0.02] transition-colors ${i % 2 === 0 ? "" : "bg-cream/[0.01]"}`}>
                  <td className="px-4 py-3 text-cream/80 font-medium">{rsvp.guestName}</td>
                  <td className="px-4 py-3 text-cream/40">{rsvp.guestEmail ?? "—"}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] uppercase tracking-[0.12em] px-2 py-0.5 border ${STATUS_PILL[rsvp.status]}`}>{rsvp.status}</span>
                  </td>
                  <td className="px-4 py-3 text-cream/50">{rsvp.guestCount}</td>
                  <td className="px-4 py-3 text-cream/40 capitalize">{rsvp.mealPreference ?? "—"}</td>
                  <td className="px-4 py-3 text-cream/30 text-xs">
                    {formatDate(rsvp.respondedAt, "en-GB", { day:"numeric", month:"short", hour:"2-digit", minute:"2-digit" })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
