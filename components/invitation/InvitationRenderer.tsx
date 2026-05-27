"use client";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { useBackgroundMusic } from "@/hooks/useBackgroundMusic";
import { MusicToggle } from "./MusicToggle";
import { PersonalizedGreeting } from "./PersonalizedGreeting";
import { HeroSection }      from "./sections/HeroSection";
import { DetailsSection }   from "./sections/DetailsSection";
import { CountdownSection } from "./sections/CountdownSection";
import { GallerySection }   from "./sections/GallerySection";
import { RSVPSection }      from "./sections/RSVPSection";
import { MapSection }       from "./sections/MapSection";
import { MessageSection }   from "./sections/MessageSection";
import type { Invitation, InvitationSection } from "@/types";

const SECTION_MAP: Record<
  InvitationSection["type"],
  React.ComponentType<{ section: InvitationSection; invitation: Invitation; isPreview?: boolean }>
> = {
  hero:      HeroSection,
  details:   DetailsSection,
  countdown: CountdownSection,
  gallery:   GallerySection,
  rsvp:      RSVPSection,
  map:       MapSection,
  message:   MessageSection,
};

interface Props {
  invitation: Invitation;
  guestName?: string;
  isPreview?: boolean;
}

export function InvitationRenderer({ invitation, guestName, isPreview = false }: Props) {
  const { init, toggle, isPlaying } = useBackgroundMusic(isPreview ? undefined : invitation.musicUrl);

  useEffect(() => {
    if (isPreview) return;
    const handleFirst = () => { init(); document.removeEventListener("click", handleFirst); };
    document.addEventListener("click", handleFirst, { once: true });
  }, [init, isPreview]);

  const sorted = [...invitation.sections]
    .filter((s) => s.visible)
    .sort((a, b) => a.order - b.order);

  const cssVars = {
    "--inv-primary":    invitation.colorPalette.primary,
    "--inv-secondary":  invitation.colorPalette.secondary,
    "--inv-accent":     invitation.colorPalette.accent,
    "--inv-bg":         invitation.colorPalette.background,
    "--inv-text":       invitation.colorPalette.text,
    "--inv-font-h":     `'${invitation.fontPrimary}', Georgia, serif`,
    "--inv-font-b":     `'${invitation.fontSecondary}', system-ui, sans-serif`,
  } as React.CSSProperties;

  return (
    <div
      style={{
        ...cssVars,
        backgroundColor: invitation.colorPalette.background,
        color: invitation.colorPalette.text,
        fontFamily: `'${invitation.fontSecondary}', system-ui, sans-serif`,
        direction: invitation.language === "ar" ? "rtl" : "ltr",
        minHeight: "100vh",
      }}
    >
      {/* Google Fonts dynamic load */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=${encodeURIComponent(invitation.fontPrimary)}:ital,wght@0,300;0,400;1,300;1,400&family=${encodeURIComponent(invitation.fontSecondary)}:wght@300;400&display=swap');
      `}</style>

      {/* Personalized guest greeting overlay */}
      {guestName && !isPreview && <PersonalizedGreeting guestName={guestName} invitation={invitation} />}

      {/* Sections */}
      {sorted.map((section, i) => {
        const Component = SECTION_MAP[section.type];
        if (!Component) return null;
        return (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-5%" }}
            transition={{ duration: 0.8, delay: i * 0.04 }}
          >
            <Component section={section} invitation={invitation} isPreview={isPreview} />
          </motion.div>
        );
      })}

      {/* Music toggle */}
      {invitation.musicUrl && !isPreview && (
        <MusicToggle isPlaying={isPlaying} onToggle={toggle} />
      )}
    </div>
  );
}
