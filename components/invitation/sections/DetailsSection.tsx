"use client";
import { motion } from "framer-motion";
import { Calendar, MapPin, Clock, Shirt, Star } from "lucide-react";
import type { InvitationSection, Invitation } from "@/types";

interface Props { section: InvitationSection; invitation: Invitation; isPreview?: boolean; }

function OrnamentDivider({ color }: { color: string }) {
  return (
    <div className="flex items-center justify-center gap-3 my-8">
      <div className="h-px w-16" style={{ background: `linear-gradient(90deg, transparent, ${color})`, opacity: 0.4 }} />
      <span className="text-xs" style={{ color, opacity: 0.6 }}>✦ ◆ ✦</span>
      <div className="h-px w-16" style={{ background: `linear-gradient(90deg, ${color}, transparent)`, opacity: 0.4 }} />
    </div>
  );
}

export function DetailsSection({ section, invitation }: Props) {
  const p = invitation.colorPalette;
  const dressCode = section.content.dressCode as string | undefined;
  const note      = section.content.note as string | undefined;

  const items = [
    { icon: Calendar, label: "Date", value: new Date(invitation.eventDate).toLocaleDateString("en-GB", { weekday:"long", day:"numeric", month:"long", year:"numeric" }) },
    { icon: Clock,    label: "Time", value: new Date(invitation.eventDate).toLocaleTimeString("en-GB", { hour:"2-digit", minute:"2-digit" }) },
    { icon: MapPin,   label: "Venue", value: invitation.venue },
    ...(invitation.venueAddress ? [{ icon: MapPin, label: "Address", value: invitation.venueAddress }] : []),
    ...(dressCode ? [{ icon: Shirt, label: "Dress Code", value: dressCode }] : []),
  ];

  return (
    <section
      className="py-24 px-8 relative overflow-hidden"
      style={{ background: `linear-gradient(180deg, ${p.background} 0%, ${p.secondary} 50%, ${p.background} 100%)` }}
    >
      {/* Decorative corner elements */}
      <div className="absolute top-6 left-6 opacity-15" style={{ color: p.primary }}>
        <svg width="60" height="60" viewBox="0 0 60 60">
          <path d="M0 0 L30 0 Q0 0 0 30 Z" stroke="currentColor" strokeWidth="1" fill="none"/>
          <path d="M0 0 L20 0 Q0 0 0 20 Z" stroke="currentColor" strokeWidth="0.5" fill="none"/>
          <circle cx="4" cy="4" r="2" fill="currentColor" opacity="0.5"/>
        </svg>
      </div>
      <div className="absolute top-6 right-6 opacity-15 scale-x-[-1]" style={{ color: p.primary }}>
        <svg width="60" height="60" viewBox="0 0 60 60">
          <path d="M0 0 L30 0 Q0 0 0 30 Z" stroke="currentColor" strokeWidth="1" fill="none"/>
          <path d="M0 0 L20 0 Q0 0 0 20 Z" stroke="currentColor" strokeWidth="0.5" fill="none"/>
          <circle cx="4" cy="4" r="2" fill="currentColor" opacity="0.5"/>
        </svg>
      </div>

      <div className="max-w-2xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-[10px] uppercase tracking-[0.4em] mb-3" style={{ color: p.primary, opacity: 0.7 }}>
            Event Details
          </p>
          <h2
            className="text-3xl font-light"
            style={{ fontFamily: `'${invitation.fontPrimary}', serif`, color: p.text }}
          >
            The Celebration
          </h2>
          <OrnamentDivider color={p.primary} />
        </motion.div>

        {/* Detail cards */}
        <div className="grid sm:grid-cols-2 gap-4">
          {items.map(({ icon: Icon, label, value }, i) => (
            <motion.div
              key={label}
              className="flex items-start gap-4 p-5 border"
              style={{
                borderColor: `${p.primary}25`,
                background: `${p.primary}06`,
              }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div
                className="w-10 h-10 flex items-center justify-center shrink-0 mt-0.5"
                style={{ border: `1px solid ${p.primary}40`, color: p.primary }}
              >
                <Icon size={15} />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] mb-1" style={{ color: p.primary, opacity: 0.65 }}>
                  {label}
                </p>
                <p
                  className="text-base font-light leading-snug"
                  style={{ fontFamily: `'${invitation.fontPrimary}', serif`, color: p.text, opacity: 0.9 }}
                >
                  {value}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Note */}
        {note && (
          <motion.div
            className="mt-8 text-center p-6 border-t border-b"
            style={{ borderColor: `${p.primary}20` }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <Star size={14} className="mx-auto mb-3" style={{ color: p.primary, opacity: 0.5 }} />
            <p className="text-sm leading-relaxed italic" style={{ color: p.text, opacity: 0.55 }}>{note}</p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
