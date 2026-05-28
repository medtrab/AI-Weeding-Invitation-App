"use client";
import { motion } from "framer-motion";
import { useCountdown } from "@/hooks/useCountdown";
import type { InvitationSection, Invitation } from "@/types";

interface Props { section: InvitationSection; invitation: Invitation; isPreview?: boolean; }

export function CountdownSection({ invitation, isPreview }: Props) {
  const { days, hours, minutes, seconds, isExpired } = useCountdown(invitation.eventDate);
  const p = invitation.colorPalette;
  if (isExpired) return null;

  const units = [
    { value: isPreview ? 47 : days,    label: "Days"    },
    { value: isPreview ? 14 : hours,   label: "Hours"   },
    { value: isPreview ? 32 : minutes, label: "Min"     },
    { value: isPreview ? 9  : seconds, label: "Sec"     },
  ];

  return (
    <section
      className="py-20 px-8 relative overflow-hidden"
      style={{ background: p.secondary }}
    >
      {/* Background arabesque */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="cdown-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <circle cx="50" cy="50" r="30" fill="none" stroke={p.primary} strokeWidth="0.5"/>
              <circle cx="50" cy="50" r="20" fill="none" stroke={p.primary} strokeWidth="0.3"/>
              <path d="M50 20 L80 50 L50 80 L20 50 Z" fill="none" stroke={p.primary} strokeWidth="0.3"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#cdown-pattern)"/>
        </svg>
      </div>

      <div className="relative z-10 text-center">
        <motion.p
          className="text-[10px] uppercase tracking-[0.4em] mb-2"
          style={{ color: p.primary, opacity: 0.7 }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.7 }}
          viewport={{ once: true }}
        >
          The moment approaches
        </motion.p>
        <motion.h2
          className="text-2xl font-light mb-12"
          style={{ fontFamily: `'${invitation.fontPrimary}', serif`, color: p.text, opacity: 0.8 }}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 0.8, y: 0 }}
          viewport={{ once: true }}
        >
          Counting down to forever
        </motion.h2>

        <div className="flex justify-center gap-4 sm:gap-8">
          {units.map(({ value, label }, i) => (
            <motion.div
              key={label}
              className="relative text-center"
              initial={{ opacity: 0, scale: 0.7 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, type: "spring", stiffness: 200 }}
            >
              {/* Ornamental frame */}
              <div
                className="relative w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center"
                style={{ border: `1px solid ${p.primary}35` }}
              >
                {/* Corner dots */}
                {[[-3,-3],[3,-3],[-3,3],[3,3]].map(([x,y], ci) => (
                  <div
                    key={ci}
                    className="absolute w-1.5 h-1.5 rounded-full"
                    style={{
                      background: p.primary,
                      opacity: 0.6,
                      top: y < 0 ? -3 : "auto",
                      bottom: y > 0 ? -3 : "auto",
                      left: x < 0 ? -3 : "auto",
                      right: x > 0 ? -3 : "auto",
                    }}
                  />
                ))}
                <span
                  className="text-4xl sm:text-5xl font-light tabular-nums"
                  style={{ fontFamily: `'${invitation.fontPrimary}', serif`, color: p.primary }}
                >
                  {String(value).padStart(2, "0")}
                </span>
              </div>
              <p
                className="text-[10px] uppercase tracking-[0.2em] mt-2"
                style={{ color: p.text, opacity: 0.45 }}
              >
                {label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
