"use client";
import { motion } from "framer-motion";
import { MapPin, ExternalLink } from "lucide-react";
import type { InvitationSection, Invitation } from "@/types";

interface Props { section: InvitationSection; invitation: Invitation; isPreview?: boolean; }

export function MapSection({ invitation }: Props) {
  const palette  = invitation.colorPalette;
  const hasCoords = invitation.venueLat && invitation.venueLng;
  const mapsUrl   = hasCoords
    ? `https://www.google.com/maps?q=${invitation.venueLat},${invitation.venueLng}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(invitation.venue)}`;
  const embedUrl  = hasCoords
    ? `https://www.google.com/maps/embed/v1/place?key=AIzaSyD-placeholder&q=${invitation.venueLat},${invitation.venueLng}`
    : `https://www.google.com/maps/embed/v1/place?key=AIzaSyD-placeholder&q=${encodeURIComponent(invitation.venue)}`;

  return (
    <section className="py-20 px-8" style={{ background: palette.background }}>
      <div className="max-w-2xl mx-auto">
        <motion.p
          className="text-[10px] uppercase tracking-[0.35em] text-center mb-8"
          style={{ color: palette.primary, opacity: 0.7 }}
          initial={{ opacity: 0 }} whileInView={{ opacity: 0.7 }} viewport={{ once: true }}
        >
          Find Us
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {/* Venue info */}
          <div className="flex items-start gap-3 mb-6 justify-center text-center flex-col items-center">
            <div className="flex items-center gap-2">
              <MapPin size={14} style={{ color: palette.primary, opacity: 0.7 }} />
              <p className="text-lg font-light" style={{ fontFamily: `'${invitation.fontPrimary}', serif`, color: palette.text }}>
                {invitation.venue}
              </p>
            </div>
            {invitation.venueAddress && (
              <p className="text-sm" style={{ color: palette.text, opacity: 0.45 }}>{invitation.venueAddress}</p>
            )}
          </div>

          {/* Map embed placeholder (replace key with real Google Maps API key) */}
          <div
            className="w-full h-64 flex items-center justify-center border"
            style={{ borderColor: `${palette.primary}30`, background: palette.secondary }}
          >
            <div className="text-center">
              <MapPin size={28} style={{ color: palette.primary, opacity: 0.4, margin: "0 auto 0.75rem" }} />
              <p className="text-xs uppercase tracking-[0.15em] mb-3" style={{ color: palette.text, opacity: 0.4 }}>
                {invitation.venue}
              </p>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.15em] px-4 py-2 border transition-opacity hover:opacity-80"
                style={{ borderColor: palette.primary, color: palette.primary }}
              >
                <ExternalLink size={11} />
                Open in Google Maps
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
