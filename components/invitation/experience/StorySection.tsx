"use client";
import { motion } from "framer-motion";
import type { Invitation } from "@/types";

interface Props { invitation: Invitation; isPreview?: boolean; }

export function StorySection({ invitation, isPreview }: Props) {
  const p = invitation.colorPalette;

  return (
    <section
      className="py-24 px-8 relative overflow-hidden"
      style={{ background: `linear-gradient(180deg, ${p.background} 0%, ${p.secondary} 50%, ${p.background} 100%)` }}
    >
      {/* Arabesque side decoration */}
      <div className="absolute left-0 top-0 bottom-0 w-1 opacity-30" style={{ background: `linear-gradient(180deg, transparent, ${p.primary}, transparent)` }} />
      <div className="absolute right-0 top-0 bottom-0 w-1 opacity-30" style={{ background: `linear-gradient(180deg, transparent, ${p.primary}, transparent)` }} />

      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <p className="text-[10px] uppercase tracking-[0.4em] mb-3" style={{ color: p.primary, opacity: 0.7 }}>
            Our Story
          </p>
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-16 opacity-40" style={{ background: `linear-gradient(90deg, transparent, ${p.primary})` }} />
            <span style={{ color: p.primary, opacity: 0.6, fontSize: "1.2rem" }}>✦</span>
            <div className="h-px w-16 opacity-40" style={{ background: `linear-gradient(90deg, ${p.primary}, transparent)` }} />
          </div>
        </motion.div>

        {/* Photo strip — 3 photos or placeholder */}
        <motion.div
          className="flex gap-3 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="flex-1 aspect-[3/4] overflow-hidden"
              style={{ border: `1px solid ${p.primary}25` }}
            >
              {/* Placeholder with ornament */}
              <div
                className="w-full h-full flex items-center justify-center"
                style={{ background: `linear-gradient(145deg, ${p.secondary}, ${p.background})` }}
              >
                <div className="text-center">
                  <div style={{ color: p.primary, opacity: 0.2, fontSize: "2rem" }}>
                    {i === 0 ? "✿" : i === 1 ? "❋" : "✦"}
                  </div>
                  {!isPreview && (
                    <p className="text-[9px] uppercase tracking-widest mt-2" style={{ color: p.primary, opacity: 0.3 }}>
                      Add photo
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Love story text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <p
            className="text-xl font-light leading-relaxed italic"
            style={{
              fontFamily: `'${invitation.fontPrimary}', Georgia, serif`,
              color: p.text,
              opacity: 0.75,
            }}
          >
            {`"Two souls, one destiny. We invite you to witness the beginning of our forever."`}
          </p>

          <div className="mt-6 flex items-center justify-center gap-4">
            <span
              className="text-2xl font-light"
              style={{ fontFamily: `'${invitation.fontPrimary}', serif`, color: p.text, opacity: 0.7 }}
            >
              {invitation.coupleName?.split("&")[0]?.trim() ?? ""}
            </span>
            <span style={{ color: p.primary, fontSize: "1.5rem" }}>♥</span>
            <span
              className="text-2xl font-light"
              style={{ fontFamily: `'${invitation.fontPrimary}', serif`, color: p.text, opacity: 0.7 }}
            >
              {invitation.coupleName?.split("&")[1]?.trim() ?? ""}
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
