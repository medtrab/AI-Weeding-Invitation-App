"use client";
import { motion } from "framer-motion";
import { useCountdown } from "@/hooks/useCountdown";
import type { InvitationSection, Invitation } from "@/types";

interface Props { section: InvitationSection; invitation: Invitation; isPreview?: boolean; }

export function CountdownSection({ invitation, isPreview }: Props) {
  const { days, hours, minutes, seconds, isExpired } = useCountdown(invitation.eventDate);
  const palette = invitation.colorPalette;

  if (isExpired) return null;

  const units = [
    { value: isPreview ? 47 : days,    label: "Days"    },
    { value: isPreview ? 14 : hours,   label: "Hours"   },
    { value: isPreview ? 32 : minutes, label: "Minutes" },
    { value: isPreview ? 9  : seconds, label: "Seconds" },
  ];

  return (
    <section className="py-20 px-8 text-center" style={{ background: palette.background }}>
      <motion.p
        className="text-[10px] uppercase tracking-[0.3em] mb-12"
        style={{ color: palette.primary, opacity: 0.65 }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.65 }}
        viewport={{ once: true }}
      >
        Counting down to forever
      </motion.p>

      <div className="flex justify-center gap-6 sm:gap-12">
        {units.map(({ value, label }, i) => (
          <motion.div
            key={label}
            className="text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, type: "spring", stiffness: 200 }}
          >
            <div
              className="text-5xl sm:text-6xl font-light tabular-nums leading-none"
              style={{ fontFamily: `'${invitation.fontPrimary}', Georgia, serif`, color: palette.primary }}
            >
              {String(value).padStart(2, "0")}
            </div>
            <div className="text-[10px] uppercase tracking-[0.2em] mt-2" style={{ color: palette.text, opacity: 0.4 }}>
              {label}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
