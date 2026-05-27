"use client";
import { useInvitationStore } from "@/stores/useInvitationStore";

const PRESET_PALETTES = [
  { primary:"#C9A84C", secondary:"#1A0E0A", accent:"#8B2020", background:"#0D0B08", text:"#F5E4B0" },
  { primary:"#7A9ACC", secondary:"#0F1520", accent:"#4A7ACC", background:"#08101A", text:"#E8F0FA" },
  { primary:"#4A9468", secondary:"#060A08", accent:"#80C4A0", background:"#0C1510", text:"#E8F5EE" },
  { primary:"#CC6666", secondary:"#1A0808", accent:"#E8A0A0", background:"#0D0808", text:"#FAE8E8" },
];

export function ColorPaletteEditor() {
  const { invitation, setColorPalette } = useInvitationStore();
  if (!invitation) return null;
  return (
    <div>
      <span className="text-[10px] uppercase tracking-[0.2em] text-cream/40 block mb-3">Color Palette</span>
      <div className="flex gap-2 mb-4">
        {PRESET_PALETTES.map((palette, i) => (
          <button key={i} onClick={() => setColorPalette(palette)}
            className="w-8 h-8 rounded-full transition-all hover:scale-110 hover:ring-2 hover:ring-gold/50 ring-offset-2 ring-offset-deep"
            style={{ background: `linear-gradient(135deg, ${palette.primary}, ${palette.background})` }}
          />
        ))}
      </div>
      <div className="space-y-2">
        {Object.entries(invitation.colorPalette).map(([key, value]) => (
          <div key={key} className="flex items-center gap-3">
            <input type="color" value={value}
              onChange={(e) => setColorPalette({ ...invitation.colorPalette, [key]: e.target.value })}
              className="w-8 h-8 cursor-pointer border border-gold/20 bg-transparent p-0.5"
            />
            <span className="text-xs text-cream/50 capitalize tracking-wide flex-1">{key}</span>
            <span className="text-[10px] text-cream/25 font-mono">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
