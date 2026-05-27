import type { LucideIcon } from "lucide-react";

interface Props { label: string; value: string | number; icon: LucideIcon; delta?: string; }

export function StatCard({ label, value, icon: Icon, delta }: Props) {
  return (
    <div className="bg-[#0D0B08] border border-gold/10 p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] uppercase tracking-[0.2em] text-cream/35">{label}</span>
        <Icon size={14} className="text-gold/40" />
      </div>
      <div className="font-cormorant text-3xl font-light text-cream">{value}</div>
      {delta && <p className="text-[10px] text-emerald-400/70 mt-1">{delta}</p>}
    </div>
  );
}
