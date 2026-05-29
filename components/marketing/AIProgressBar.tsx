"use client";
import { motion } from "framer-motion";
const STATUS_LABELS: Record<string, string> = { analyzing: "Analyzing your style...", generating_palette: "Choosing color palette...", crafting_text: "Crafting invitation text...", selecting_animations: "Selecting animations...", finalizing: "Finalizing your design..." };
interface AIProgressBarProps { progress: number; status: string; }
export function AIProgressBar({ progress, status }: AIProgressBarProps) {
  return (
    <motion.div className="mt-6" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <p className="text-[11px] uppercase tracking-[0.2em] text-gold text-center mb-3 animate-pulse">{STATUS_LABELS[status] || "Processing..."}</p>
      <div className="h-px bg-cream/10 relative overflow-hidden">
        <motion.div className="absolute inset-y-0 left-0 bg-gold" initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.5, ease: "easeOut" }} />
      </div>
    </motion.div>
  );
}
