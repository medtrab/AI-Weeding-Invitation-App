"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import type { InvitationSection, Invitation } from "@/types";

interface Props { section: InvitationSection; invitation: Invitation; isPreview?: boolean; }

export function GallerySection({ section, invitation }: Props) {
  const palette = invitation.colorPalette;
  const images  = (section.content.images as string[]) ?? [];
  const [lightbox, setLightbox] = useState<string | null>(null);

  if (!images.length) {
    if (!section.visible) return null;
    return (
      <section className="py-20 px-8 text-center" style={{ background: palette.secondary }}>
        <p className="text-sm" style={{ color: palette.text, opacity: 0.3 }}>
          Gallery photos will appear here once added.
        </p>
      </section>
    );
  }

  return (
    <section className="py-20 px-8" style={{ background: palette.secondary }}>
      <motion.p
        className="text-[10px] uppercase tracking-[0.35em] text-center mb-10"
        style={{ color: palette.primary, opacity: 0.7 }}
        initial={{ opacity: 0 }} whileInView={{ opacity: 0.7 }} viewport={{ once: true }}
      >
        Our Moments
      </motion.p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-w-3xl mx-auto">
        {images.map((src, i) => (
          <motion.button
            key={i}
            className="aspect-square overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06 }}
            onClick={() => setLightbox(src)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {lightbox && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.92)" }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
          >
            <button
              className="absolute top-4 right-4 text-white/60 hover:text-white"
              onClick={() => setLightbox(null)}
            >
              <X size={24} />
            </button>
            <motion.img
              src={lightbox} alt="Full view"
              className="max-w-full max-h-[90vh] object-contain"
              initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
