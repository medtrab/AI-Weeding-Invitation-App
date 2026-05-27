"use client";
import { motion } from "framer-motion";
import { Calendar, MapPin, Clock, Shirt } from "lucide-react";
import type { InvitationSection, Invitation } from "@/types";

interface Props { section: InvitationSection; invitation: Invitation; isPreview?: boolean; }

export function DetailsSection({ section, invitation }: Props) {
  const palette  = invitation.colorPalette;
  const dressCode = section.content.dressCode as string | undefined;
  const note      = section.content.note as string | undefined;

  const items = [
    {
      icon: Calendar,
      label: "Date",
      value: new Date(invitation.eventDate).toLocaleDateString("en-GB", {
        weekday: "long", day: "numeric", month: "long", year: "numeric",
      }),
    },
    {
      icon: Clock,
      label: "Time",
      value: new Date(invitation.eventDate).toLocaleTimeString("en-GB", {
        hour: "2-digit", minute: "2-digit",
      }),
    },
    { icon: MapPin, label: "Venue", value: invitation.venue },
    ...(invitation.venueAddress ? [{ icon: MapPin, label: "Address", value: invitation.venueAddress }] : []),
    ...(dressCode ? [{ icon: Shirt, label: "Dress Code", value: dressCode }] : []),
  ];

  return (
    <section className="py-24 px-8" style={{ background: palette.secondary }}>
      <div className="max-w-xl mx-auto text-center">
        <motion.p
          className="text-[10px] uppercase tracking-[0.35em] mb-10"
          style={{ color: palette.primary, opacity: 0.7 }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.7 }}
          viewport={{ once: true }}
        >
          Event Details
        </motion.p>

        <div className="space-y-6">
          {items.map(({ icon: Icon, label, value }, i) => (
            <motion.div
              key={label}
              className="flex flex-col items-center gap-1"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="flex items-center gap-2 mb-0.5">
                <Icon size={12} style={{ color: palette.primary, opacity: 0.6 }} />
                <span className="text-[10px] uppercase tracking-[0.2em]" style={{ color: palette.text, opacity: 0.4 }}>
                  {label}
                </span>
              </div>
              <p
                className="text-lg font-light"
                style={{ fontFamily: `'${invitation.fontPrimary}', Georgia, serif`, color: palette.text, opacity: 0.85 }}
              >
                {value}
              </p>
            </motion.div>
          ))}
        </div>

        {note && (
          <motion.p
            className="mt-10 text-sm leading-relaxed"
            style={{ color: palette.text, opacity: 0.45 }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.45 }}
            viewport={{ once: true }}
          >
            {note}
          </motion.p>
        )}
      </div>
    </section>
  );
}
