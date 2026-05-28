"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Invitation } from "@/types";

interface Props {
  invitation: Invitation;
  guestName?: string;
  onOpen: () => void;
}

export function EnvelopeOpening({ invitation, guestName, onOpen }: Props) {
  const [phase, setPhase] = useState<"idle" | "hover" | "opening" | "open">("idle");
  const p = invitation.colorPalette;

  const handleClick = () => {
    if (phase !== "idle" && phase !== "hover") return;
    setPhase("opening");
    setTimeout(() => {
      setPhase("open");
      setTimeout(onOpen, 800);
    }, 1800);
  };

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
      style={{ background: `radial-gradient(ellipse at center, ${p.secondary} 0%, ${p.background} 70%)` }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 1.2 }}
    >
      {/* Ambient particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 25 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: i % 5 === 0 ? 3 : 1.5,
              height: i % 5 === 0 ? 3 : 1.5,
              background: p.primary,
              left: `${(i * 4.1) % 100}%`,
              top: `${(i * 3.7) % 100}%`,
              opacity: 0,
            }}
            animate={{ opacity: [0, 0.6, 0], y: [-20, -60], scale: [0, 1, 0] }}
            transition={{ duration: 4 + (i % 3), delay: i * 0.3, repeat: Infinity }}
          />
        ))}
      </div>

      {/* Guest greeting */}
      {guestName && (
        <motion.p
          className="text-[11px] uppercase tracking-[0.4em] mb-10"
          style={{ color: p.primary, opacity: 0.7 }}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 0.7, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          A personal invitation for {guestName}
        </motion.p>
      )}

      {/* Envelope */}
      <motion.div
        className="relative cursor-pointer select-none"
        style={{ width: 320, height: 220 }}
        onHoverStart={() => phase === "idle" && setPhase("hover")}
        onHoverEnd={() => phase === "hover" && setPhase("idle")}
        onClick={handleClick}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Envelope body */}
        <div
          className="absolute inset-0 rounded-sm overflow-hidden"
          style={{ background: `linear-gradient(145deg, ${p.secondary}, ${p.background})`, border: `1px solid ${p.primary}40` }}
        >
          {/* Bottom fold lines */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 320 220" preserveAspectRatio="none">
            {/* Bottom triangle */}
            <path d="M0 220 L160 130 L320 220 Z" fill={p.primary} opacity="0.08"/>
            {/* Left triangle */}
            <path d="M0 0 L0 220 L160 130 Z" fill={p.primary} opacity="0.05"/>
            {/* Right triangle */}
            <path d="M320 0 L320 220 L160 130 Z" fill={p.primary} opacity="0.05"/>
            {/* Fold lines */}
            <line x1="0" y1="0" x2="160" y2="130" stroke={p.primary} strokeWidth="0.5" opacity="0.3"/>
            <line x1="320" y1="0" x2="160" y2="130" stroke={p.primary} strokeWidth="0.5" opacity="0.3"/>
            <line x1="0" y1="220" x2="160" y2="130" stroke={p.primary} strokeWidth="0.5" opacity="0.3"/>
            <line x1="320" y1="220" x2="160" y2="130" stroke={p.primary} strokeWidth="0.5" opacity="0.3"/>
          </svg>

          {/* Wax seal center */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className="flex items-center justify-center"
              style={{
                width: 64, height: 64,
                borderRadius: "50%",
                background: `radial-gradient(circle, ${p.primary}, ${p.accent})`,
                boxShadow: `0 4px 20px ${p.primary}60`,
              }}
              animate={phase === "hover" ? { scale: [1, 1.08, 1] } : {}}
              transition={{ duration: 0.6, repeat: Infinity }}
            >
              <span
                className="text-2xl font-light"
                style={{
                  fontFamily: `'${invitation.fontPrimary}', serif`,
                  color: p.background,
                  textShadow: `0 1px 4px rgba(0,0,0,0.5)`,
                }}
              >
                {(invitation.coupleName ?? invitation.title).charAt(0)}
              </span>
            </motion.div>
          </div>

          {/* Decorative border lines */}
          <div className="absolute inset-2 pointer-events-none" style={{ border: `0.5px solid ${p.primary}20` }} />
          <div className="absolute inset-4 pointer-events-none" style={{ border: `0.5px solid ${p.primary}10` }} />
        </div>

        {/* Envelope flap — animated opening */}
        <motion.div
          className="absolute top-0 left-0 right-0 origin-top overflow-hidden"
          style={{ height: 110 }}
          animate={
            phase === "opening" ? { rotateX: -180, opacity: [1, 1, 0] } :
            phase === "hover"   ? { rotateX: -15 } :
            { rotateX: 0 }
          }
          transition={{ duration: phase === "opening" ? 1.2 : 0.4, ease: "easeInOut" }}
        >
          <svg viewBox="0 0 320 110" width="320" height="110">
            <path
              d="M0 0 L160 100 L320 0 Z"
              fill={p.secondary}
              stroke={p.primary}
              strokeWidth="0.8"
              opacity="0.95"
            />
            {/* Flap pattern */}
            <path d="M40 10 L160 90 L280 10" fill="none" stroke={p.primary} strokeWidth="0.3" opacity="0.3"/>
            <circle cx="160" cy="95" r="6" fill={p.primary} opacity="0.4"/>
          </svg>
        </motion.div>

        {/* Letter peeking out when opening */}
        <AnimatePresence>
          {(phase === "opening" || phase === "open") && (
            <motion.div
              className="absolute left-4 right-4 bottom-4 rounded-sm flex items-center justify-center"
              style={{
                background: `linear-gradient(145deg, #FAF7F2, #F0EBE0)`,
                border: `1px solid ${p.primary}30`,
              }}
              initial={{ y: 0, height: 160 }}
              animate={{ y: -60, height: 160 }}
              transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
            >
              <div className="text-center px-6">
                <p
                  className="font-light leading-tight"
                  style={{
                    fontFamily: `'${invitation.fontPrimary}', serif`,
                    fontSize: "1.3rem",
                    color: p.secondary,
                  }}
                >
                  {invitation.coupleName ?? invitation.title}
                </p>
                <div className="w-12 h-px mx-auto my-2" style={{ background: p.primary, opacity: 0.5 }} />
                <p style={{ fontSize: "0.6rem", color: p.secondary, opacity: 0.6, letterSpacing: "0.2em", textTransform: "uppercase" }}>
                  You are invited
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* CTA */}
      <motion.div
        className="mt-10 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        {phase === "opening" ? (
          <p className="text-xs uppercase tracking-[0.3em]" style={{ color: p.primary, opacity: 0.6 }}>
            Opening…
          </p>
        ) : (
          <>
            <motion.p
              className="text-xs uppercase tracking-[0.3em] mb-2"
              style={{ color: p.primary, opacity: 0.6 }}
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {phase === "hover" ? "Click to open" : "Tap to open your invitation"}
            </motion.p>
            <div className="flex justify-center gap-1">
              {[0,1,2].map((i) => (
                <motion.div
                  key={i}
                  className="w-1 h-1 rounded-full"
                  style={{ background: p.primary }}
                  animate={{ opacity: [0.2, 1, 0.2] }}
                  transition={{ duration: 1.2, delay: i * 0.2, repeat: Infinity }}
                />
              ))}
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}
