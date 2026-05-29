"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import type { AIGenerationResult } from "@/types";
interface AIResultCardProps { result: AIGenerationResult; }
function ResultCell({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-gold/[0.04] border border-gold/20 p-4 ${className}`}>
      <span className="text-[10px] uppercase tracking-[0.2em] text-gold block mb-2">{label}</span>
      {children}
    </div>
  );
}
export function AIResultCard({ result }: AIResultCardProps) {
  return (
    <motion.div className="mt-6 grid grid-cols-2 gap-3" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
      <ResultCell label="Theme Name"><p className="font-cormorant text-xl font-light text-cream">{result.themeName}</p></ResultCell>
      <ResultCell label="Color Palette"><div className="flex gap-2 mt-1">{Object.values(result.colorPalette).map((color, i) => (<div key={i} className="w-6 h-6 rounded-full border border-gold/20" style={{ backgroundColor: color as string }} />))}</div></ResultCell>
      <ResultCell label="Invitation Text" className="col-span-2"><p className="font-cormorant text-base italic text-cream/70 leading-relaxed">{result.invitationText}</p></ResultCell>
      <ResultCell label="Suggested Music"><p className="text-sm text-cream/80">{result.musicSuggestion}</p></ResultCell>
      <ResultCell label="Animation Style"><p className="text-sm text-cream/80">{result.decorativeStyle}</p></ResultCell>
      <div className="col-span-2 flex gap-3 pt-2">
        <Button size="md" className="flex-1">Edit &amp; Customize</Button>
        <Button variant="ghost" size="md" className="flex-1">Use This Theme</Button>
      </div>
    </motion.div>
  );
}
