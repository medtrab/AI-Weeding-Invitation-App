"use client";

interface DataPoint { label: string; attending: number; declined: number; }

export function AnalyticsChart({ data }: { data: DataPoint[] }) {
  if (!data.length) return <p className="text-sm text-cream/30 text-center py-8">No data yet</p>;
  const max = Math.max(...data.flatMap((d) => [d.attending, d.declined]), 1);

  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.2em] text-cream/35 mb-4">RSVP Trend</p>
      <div className="flex items-end gap-3 h-32">
        {data.map((d) => (
          <div key={d.label} className="flex-1 flex flex-col items-center gap-1">
            <div className="w-full flex items-end gap-0.5 h-24">
              <div className="flex-1 bg-emerald-500/30 hover:bg-emerald-500/50 transition-colors"
                style={{ height: `${(d.attending / max) * 100}%` }} title={`Attending: ${d.attending}`} />
              <div className="flex-1 bg-red-500/25 hover:bg-red-500/40 transition-colors"
                style={{ height: `${(d.declined / max) * 100}%` }} title={`Declined: ${d.declined}`} />
            </div>
            <span className="text-[9px] text-cream/25">{d.label}</span>
          </div>
        ))}
      </div>
      <div className="flex gap-4 mt-3">
        <div className="flex items-center gap-1.5"><div className="w-3 h-2 bg-emerald-500/40" /><span className="text-[10px] text-cream/30">Attending</span></div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-2 bg-red-500/30" /><span className="text-[10px] text-cream/30">Declined</span></div>
      </div>
    </div>
  );
}
