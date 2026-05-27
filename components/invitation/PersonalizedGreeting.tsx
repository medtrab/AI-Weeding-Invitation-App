"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Invitation } from "@/types";

interface Props { guestName: string; invitation: Invitation; }

export function PersonalizedGreeting({ guestName, invitation }: Props) {
  const [dismissed, setDismissed] = useState(false);
  const palette = invitation.colorPalette;

  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center px-8"
          style={{ backgroundColor: palette.background }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
        >
          {/* Top accent */}
          <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${palette.primary}, transparent)` }} />

          <motion.div
            className="text-center"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.9 }}
          >
            <p className="text-[10px] uppercase tracking-[0.4em] mb-6" style={{ color: palette.primary, opacity: 0.7 }}>
              A special invitation for
            </p>
            <h1
              className="text-5xl sm:text-6xl font-light mb-10"
              style={{ fontFamily: `'${invitation.fontPrimary}', serif`, color: palette.text }}
            >
              {guestName}
            </h1>

            <motion.button
              onClick={() => setDismissed(true)}
              className="text-xs uppercase tracking-[0.25em] px-10 py-3.5 border transition-all hover:opacity-80"
              style={{ borderColor: palette.primary, color: palette.primary }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              Open Invitation
            </motion.button>
          </motion.div>

          <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${palette.primary}, transparent)` }} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
