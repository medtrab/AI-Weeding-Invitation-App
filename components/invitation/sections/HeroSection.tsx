"use client";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import type { InvitationSection, Invitation } from "@/types";

interface Props { section: InvitationSection; invitation: Invitation; isPreview?: boolean; }

// ── Animation style renderers ──────────────────────────────────────────────

function FloatingPetals({ color }: { color: string }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: 18 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-2xl"
          style={{ left: `${5 + (i * 5.5) % 90}%`, top: "-40px" }}
          animate={{ y: ["0vh", "110vh"], rotate: [0, 360], opacity: [0, 0.8, 0] }}
          transition={{ duration: 6 + (i % 4) * 2, delay: i * 0.4, repeat: Infinity, ease: "linear" }}
        >
          {i % 3 === 0 ? "✿" : i % 3 === 1 ? "❋" : "✦"}
        </motion.div>
      ))}
    </div>
  );
}

function GoldParticles({ color }: { color: string }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: 40 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: i % 4 === 0 ? 3 : 1.5,
            height: i % 4 === 0 ? 3 : 1.5,
            background: color,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{ opacity: [0, 0.9, 0], scale: [0, 1.5, 0], y: [0, -30 - i * 2] }}
          transition={{ duration: 3 + (i % 5), delay: i * 0.15, repeat: Infinity }}
        />
      ))}
    </div>
  );
}

function ArabesquePattern({ color }: { color: string }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="arabesque" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
            <path d="M40 0 L80 20 L80 60 L40 80 L0 60 L0 20 Z" fill="none" stroke={color} strokeWidth="0.5"/>
            <circle cx="40" cy="40" r="15" fill="none" stroke={color} strokeWidth="0.5"/>
            <path d="M40 10 L55 25 L55 55 L40 70 L25 55 L25 25 Z" fill="none" stroke={color} strokeWidth="0.3"/>
            <circle cx="40" cy="40" r="5" fill={color} opacity="0.5"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#arabesque)"/>
      </svg>
    </div>
  );
}

function GeometricMosaic({ color }: { color: string }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-8">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="mosaic" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
            <polygon points="30,0 60,30 30,60 0,30" fill="none" stroke={color} strokeWidth="0.4"/>
            <polygon points="30,10 50,30 30,50 10,30" fill="none" stroke={color} strokeWidth="0.3"/>
            <polygon points="30,20 40,30 30,40 20,30" fill={color} opacity="0.15"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#mosaic)"/>
      </svg>
    </div>
  );
}

function BottomOrnament({ color }: { color: string }) {
  return (
    <div className="absolute bottom-0 left-0 right-0 overflow-hidden">
      <svg viewBox="0 0 1440 120" preserveAspectRatio="none" width="100%" height="80">
        <path
          d="M0,60 C180,0 360,120 540,60 C720,0 900,120 1080,60 C1260,0 1380,80 1440,60 L1440,120 L0,120 Z"
          fill={color} opacity="0.08"
        />
        <path
          d="M0,80 C240,20 480,120 720,80 C960,40 1200,120 1440,80 L1440,120 L0,120 Z"
          fill={color} opacity="0.05"
        />
      </svg>
    </div>
  );
}

function TopArchOrnament({ color }: { color: string }) {
  return (
    <div className="absolute top-0 left-0 right-0 flex justify-center pt-4">
      <svg viewBox="0 0 400 60" width="400" height="60">
        <path d="M200 55 Q100 0 0 10 L0 0 L400 0 L400 10 Q300 0 200 55Z" fill={color} opacity="0.15"/>
        <path d="M200 45 Q130 10 60 15 M200 45 Q270 10 340 15" stroke={color} strokeWidth="0.5" fill="none" opacity="0.4"/>
        <circle cx="200" cy="8" r="3" fill={color} opacity="0.5"/>
        <circle cx="100" cy="12" r="1.5" fill={color} opacity="0.3"/>
        <circle cx="300" cy="12" r="1.5" fill={color} opacity="0.3"/>
      </svg>
    </div>
  );
}

// ── Main Hero ──────────────────────────────────────────────────────────────
export function HeroSection({ section, invitation }: Props) {
  const eyebrow = (section.content.eyebrow as string) || "✦ — You're Invited — ✦";
  const p = invitation.colorPalette;
  const anim = invitation.animationStyle;

  const bgStyle: React.CSSProperties = invitation.backgroundImageUrl
    ? {
        backgroundImage: `linear-gradient(rgba(${hexToRgb(p.background)},0.78), rgba(${hexToRgb(p.background)},0.88)), url(${invitation.backgroundImageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }
    : { background: `radial-gradient(ellipse at center top, ${p.secondary} 0%, ${p.background} 70%)` };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 py-20 overflow-hidden" style={bgStyle}>

      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: `linear-gradient(90deg, transparent, ${p.primary}, ${p.accent}, ${p.primary}, transparent)` }} />

      {/* Background pattern based on animation style */}
      {(anim === "floating_petals" || anim === "botanical") && <FloatingPetals color={p.primary} />}
      {(anim === "shimmer" || anim === "elegant_fade") && <GoldParticles color={p.primary} />}
      {anim === "parallax" && <ArabesquePattern color={p.primary} />}
      {anim === "confetti" && <GeometricMosaic color={p.primary} />}

      {/* Top arch ornament */}
      <TopArchOrnament color={p.primary} />

      {/* Corner ornaments */}
      <div className="absolute top-8 left-8 text-3xl opacity-20" style={{ color: p.primary }}>❋</div>
      <div className="absolute top-8 right-8 text-3xl opacity-20" style={{ color: p.primary }}>❋</div>

      {/* Content */}
      <div className="relative z-10 max-w-2xl mx-auto">

        {/* Eyebrow */}
        <motion.p
          className="text-[11px] uppercase tracking-[0.45em] mb-8"
          style={{ color: p.primary, opacity: 0.8 }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 0.8, y: 0 }}
          transition={{ duration: 1.2, delay: 0.2 }}
        >
          {eyebrow}
        </motion.p>

        {/* Decorative top ornament */}
        <motion.div
          className="flex items-center justify-center gap-4 mb-6"
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 1.2, delay: 0.3 }}
        >
          <div className="h-px w-24" style={{ background: `linear-gradient(90deg, transparent, ${p.primary})` }} />
          <div className="text-xl" style={{ color: p.primary }}>✦</div>
          <div className="h-px w-24" style={{ background: `linear-gradient(90deg, ${p.primary}, transparent)` }} />
        </motion.div>

        {/* Names */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.5 }}
        >
          {invitation.coupleName?.includes("&") ? (
            <>
              {invitation.coupleName.split("&").map((name, i, arr) => (
                <span key={i}>
                  <span
                    className="block font-light leading-tight"
                    style={{
                      fontFamily: `'${invitation.fontPrimary}', Georgia, serif`,
                      fontSize: "clamp(3.5rem, 8vw, 6rem)",
                      color: p.text,
                    }}
                  >
                    {name.trim()}
                  </span>
                  {i < arr.length - 1 && (
                    <span
                      className="block italic my-1"
                      style={{
                        fontFamily: `'${invitation.fontPrimary}', Georgia, serif`,
                        fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
                        color: p.primary,
                      }}
                    >
                      &
                    </span>
                  )}
                </span>
              ))}
            </>
          ) : (
            <span
              className="block font-light"
              style={{
                fontFamily: `'${invitation.fontPrimary}', Georgia, serif`,
                fontSize: "clamp(3rem, 7vw, 5rem)",
                color: p.text,
              }}
            >
              {invitation.coupleName ?? invitation.title}
            </span>
          )}
        </motion.div>

        {/* Divider */}
        <motion.div
          className="flex items-center justify-center gap-3 my-8"
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 1.2, delay: 0.9 }}
        >
          <div className="h-px flex-1 max-w-[80px]" style={{ background: `linear-gradient(90deg, transparent, ${p.primary})`, opacity: 0.6 }} />
          <div className="flex items-center gap-2" style={{ color: p.primary, opacity: 0.7 }}>
            <span className="text-xs">✦</span>
            <span className="text-lg">◆</span>
            <span className="text-xs">✦</span>
          </div>
          <div className="h-px flex-1 max-w-[80px]" style={{ background: `linear-gradient(90deg, ${p.primary}, transparent)`, opacity: 0.6 }} />
        </motion.div>

        {/* Date & venue */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.1 }}
          className="space-y-2"
        >
          <p
            className="text-sm uppercase tracking-[0.3em]"
            style={{ color: p.text, opacity: 0.65 }}
          >
            {new Date(invitation.eventDate).toLocaleDateString("en-GB", {
              weekday: "long", day: "numeric", month: "long", year: "numeric",
            })}
          </p>
          <p
            className="text-base tracking-wide"
            style={{
              fontFamily: `'${invitation.fontPrimary}', Georgia, serif`,
              color: p.primary,
              opacity: 0.85,
            }}
          >
            {invitation.venue}
          </p>
        </motion.div>

        {/* Invitation message if set */}
        {section.content.message && (
          <motion.p
            className="mt-8 text-sm leading-relaxed italic max-w-md mx-auto"
            style={{ color: p.text, opacity: 0.55 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.55 }}
            transition={{ delay: 1.4 }}
          >
            {section.content.message as string}
          </motion.p>
        )}
      </div>

      {/* Bottom ornament */}
      <BottomOrnament color={p.primary} />

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10"
        animate={{ y: [0, 10, 0], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="flex flex-col items-center gap-1.5" style={{ color: p.primary }}>
          <div className="w-px h-8" style={{ background: `linear-gradient(180deg, transparent, ${p.primary})` }} />
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: p.primary }} />
        </div>
      </motion.div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: `linear-gradient(90deg, transparent, ${p.primary}, ${p.accent}, ${p.primary}, transparent)` }} />
    </section>
  );
}

function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}
