"use client";
import { motion } from "framer-motion";
import type { InvitationSection, Invitation } from "@/types";

interface Props { section: InvitationSection; invitation: Invitation; isPreview?: boolean; }

export function HeroSection({ section, invitation }: Props) {
  const eyebrow = (section.content.eyebrow as string) || "✦ — You're Invited — ✦";
  const names   = invitation.coupleName ?? invitation.title;
  const palette = invitation.colorPalette;

  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center text-center px-8 py-16"
      style={{
        background: invitation.backgroundImageUrl
          ? `linear-gradient(rgba(${hexToRgb(palette.background)},0.75), rgba(${hexToRgb(palette.background)},0.85)), url(${invitation.backgroundImageUrl}) center/cover no-repeat`
          : palette.background,
      }}
    >
      {/* Top gold accent line */}
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${palette.primary}, transparent)` }} />

      <motion.p
        className="text-[10px] uppercase tracking-[0.4em] mb-8"
        style={{ color: palette.primary, opacity: 0.75 }}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 0.75, y: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
      >
        {eyebrow}
      </motion.p>

      <motion.h1
        className="text-5xl sm:text-7xl font-light leading-tight mb-6"
        style={{ fontFamily: `'${invitation.fontPrimary}', Georgia, serif`, color: palette.text }}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.4 }}
      >
        {names.includes("&")
          ? names.split("&").map((n, i, arr) => (
              <span key={i}>
                {n.trim()}
                {i < arr.length - 1 && (
                  <em className="block italic" style={{ color: palette.primary, fontSize: "1.1em" }}>&</em>
                )}
              </span>
            ))
          : names}
      </motion.h1>

      <motion.div
        className="flex items-center gap-3 mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.7 }}
      >
        <div className="h-px w-16" style={{ background: palette.primary, opacity: 0.4 }} />
        <div className="w-1.5 h-1.5 rotate-45" style={{ background: palette.primary, opacity: 0.6 }} />
        <div className="h-px w-16" style={{ background: palette.primary, opacity: 0.4 }} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.9 }}
      >
        <p className="text-sm uppercase tracking-[0.2em] mb-1" style={{ color: palette.text, opacity: 0.5 }}>
          {new Date(invitation.eventDate).toLocaleDateString("en-GB", {
            weekday: "long", day: "numeric", month: "long", year: "numeric",
          })}
        </p>
        <p className="text-sm tracking-wide" style={{ color: palette.text, opacity: 0.55 }}>
          {invitation.venue}
        </p>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        style={{ color: palette.primary, opacity: 0.45 }}
      >
        <svg width="20" height="28" viewBox="0 0 20 28" fill="none">
          <rect x="1" y="1" width="18" height="26" rx="9" stroke="currentColor" strokeWidth="1"/>
          <motion.div
            style={{ width: 4, height: 6, borderRadius: 2, background: "currentColor", margin: "6px auto 0" }}
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </svg>
      </motion.div>
    </section>
  );
}

function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}
