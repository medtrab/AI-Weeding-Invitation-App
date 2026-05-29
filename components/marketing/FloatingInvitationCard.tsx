"use client";
import { motion } from "framer-motion";
import { GoldDivider } from "@/components/ui/GoldDivider";
export function FloatingInvitationCard() {
  return (
    <motion.div className="absolute right-[8%] top-1/2 -translate-y-1/2 w-[240px] hidden xl:block" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, delay: 0.6 }}>
      <motion.div animate={{ y: [0, -12, 0], rotate: [-2, -1, -2] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}>
        <div className="relative bg-gradient-to-br from-[#1A160E] to-[#2A2218] border border-gold/25 p-8 text-center">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
          <div className="absolute inset-[10px] border border-gold/10 pointer-events-none" />
          <p className="font-cormorant text-2xl text-gold/70 mb-2">✦</p>
          <p className="font-cormorant text-xl font-light text-cream leading-tight">Sofia<span className="block italic text-gold text-2xl">&</span>Élias</p>
          <GoldDivider className="my-3" showDiamond={false} />
          <p className="text-[10px] uppercase tracking-[0.2em] text-cream/45">September 12 · 2025</p>
          <p className="text-[10px] uppercase tracking-[0.15em] text-cream/30 mt-1">Villa Majestic, Paris</p>
        </div>
      </motion.div>
    </motion.div>
  );
}
