"use client";
import { motion } from "framer-motion";
import type { Invitation } from "@/types";

interface Props { invitation: Invitation; isPreview?: boolean; }

export function CouplePhotoHero({ invitation, isPreview }: Props) {
  const p = invitation.colorPalette;
  const hasCover = !!invitation.coverImageUrl;
  const hasBackground = !!invitation.backgroundImageUrl;

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden" style={{ background: p.background }}>

      {/* Full bleed photo — top 65% */}
      <div className="relative h-[65vh] overflow-hidden">
        {hasCover ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={invitation.coverImageUrl!}
              alt="Couple"
              className="w-full h-full object-cover object-top"
              style={{ filter: "brightness(0.85)" }}
            />
            {/* Gradient overlay bottom */}
            <div
              className="absolute bottom-0 left-0 right-0 h-1/2"
              style={{ background: `linear-gradient(to bottom, transparent, ${p.background})` }}
            />
          </>
        ) : (
          /* Placeholder when no photo */
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ background: `linear-gradient(145deg, ${p.secondary}, ${p.background})` }}
          >
            {/* Arabesque / pattern placeholder */}
            <div className="text-center opacity-20">
              <svg width="200" height="200" viewBox="0 0 200 200" style={{ color: p.primary }}>
                <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" strokeWidth="0.5"/>
                <circle cx="100" cy="100" r="70" fill="none" stroke="currentColor" strokeWidth="0.3"/>
                <path d="M100 10 L190 100 L100 190 L10 100 Z" fill="none" stroke="currentColor" strokeWidth="0.5"/>
                <path d="M100 30 L170 100 L100 170 L30 100 Z" fill="none" stroke="currentColor" strokeWidth="0.3"/>
                <circle cx="100" cy="100" r="20" fill="none" stroke="currentColor" strokeWidth="0.5"/>
                <circle cx="100" cy="100" r="5" fill="currentColor" opacity="0.5"/>
                {["top","right","bottom","left"].map((pos, i) => {
                  const angle = i * 90;
                  const x = 100 + 50 * Math.cos((angle - 90) * Math.PI / 180);
                  const y = 100 + 50 * Math.sin((angle - 90) * Math.PI / 180);
                  return <circle key={pos} cx={x} cy={y} r="3" fill="currentColor" opacity="0.4"/>;
                })}
              </svg>
              {!isPreview && (
                <p className="text-xs uppercase tracking-widest mt-4" style={{ color: p.primary }}>
                  Add couple photo in builder
                </p>
              )}
            </div>
          </div>
        )}

        {/* Top gradient */}
        <div className="absolute top-0 left-0 right-0 h-1/4" style={{ background: `linear-gradient(to bottom, ${p.background}60, transparent)` }} />

        {/* Decorative top line */}
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${p.primary}, ${p.accent}, ${p.primary}, transparent)` }} />
      </div>

      {/* Names overlay on photo */}
      <div className="absolute inset-0 flex flex-col items-center justify-end pb-16 px-8">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.4 }}
        >
          {/* Ornament */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-12" style={{ background: `linear-gradient(90deg, transparent, ${p.primary})` }} />
            <span style={{ color: p.primary, fontSize: "1rem" }}>✦</span>
            <div className="h-px w-12" style={{ background: `linear-gradient(90deg, ${p.primary}, transparent)` }} />
          </div>

          {/* Names */}
          <h1
            className="font-light leading-none"
            style={{
              fontFamily: `'${invitation.fontPrimary}', Georgia, serif`,
              fontSize: "clamp(3rem, 10vw, 5.5rem)",
              color: p.text,
              textShadow: hasCover ? `0 2px 20px rgba(0,0,0,0.5)` : "none",
            }}
          >
            {invitation.coupleName?.includes("&")
              ? invitation.coupleName.split("&").map((n, i, arr) => (
                  <span key={i}>
                    {n.trim()}
                    {i < arr.length - 1 && (
                      <span className="block italic" style={{ color: p.primary, fontSize: "0.7em" }}>
                        &
                      </span>
                    )}
                  </span>
                ))
              : (invitation.coupleName ?? invitation.title)}
          </h1>

          {/* Date line */}
          <motion.div
            className="mt-4 flex items-center justify-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <div className="h-px w-16" style={{ background: `linear-gradient(90deg, transparent, ${p.primary})`, opacity: 0.5 }} />
            <p
              className="text-xs uppercase tracking-[0.3em]"
              style={{ color: p.text, opacity: 0.7 }}
            >
              {new Date(invitation.eventDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
            </p>
            <div className="h-px w-16" style={{ background: `linear-gradient(90deg, ${p.primary}, transparent)`, opacity: 0.5 }} />
          </motion.div>

          <motion.p
            className="mt-2 text-sm"
            style={{
              fontFamily: `'${invitation.fontPrimary}', serif`,
              color: p.primary,
              opacity: 0.85,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.85 }}
            transition={{ delay: 1 }}
          >
            {invitation.venue}
          </motion.p>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{ color: p.primary, opacity: 0.5 }}
      >
        <div className="flex flex-col items-center gap-1">
          <div className="w-px h-8" style={{ background: `linear-gradient(180deg, transparent, ${p.primary})` }} />
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: p.primary }} />
        </div>
      </motion.div>
    </section>
  );
}
