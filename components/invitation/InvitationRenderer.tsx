"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EnvelopeOpening } from "./experience/EnvelopeOpening";
import { CouplePhotoHero } from "./experience/CouplePhotoHero";
import { StorySection }    from "./experience/StorySection";
import { MusicPlayer }     from "./experience/MusicPlayer";
import { DetailsSection }  from "./sections/DetailsSection";
import { CountdownSection } from "./sections/CountdownSection";
import { GallerySection }  from "./sections/GallerySection";
import { RSVPSection }     from "./sections/RSVPSection";
import { MapSection }      from "./sections/MapSection";
import { MessageSection }  from "./sections/MessageSection";
import { HeroSection }     from "./sections/HeroSection";
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
  const [envelopeOpened, setEnvelopeOpened] = useState(isPreview);
  const p = invitation.colorPalette;

  // Load Google Fonts dynamically
  useEffect(() => {
    const fonts = [invitation.fontPrimary, invitation.fontSecondary]
      .filter(Boolean)
      .map((f) => encodeURIComponent(f))
      .join("&family=");
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = `https://fonts.googleapis.com/css2?family=${fonts}:ital,wght@0,300;0,400;1,300;1,400&display=swap`;
    document.head.appendChild(link);
    return () => { document.head.removeChild(link); };
  }, [invitation.fontPrimary, invitation.fontSecondary]);

  const sorted = [...invitation.sections]
    .filter((s) => s.visible)
    .sort((a, b) => a.order - b.order);

  const hasHeroSection = sorted.some((s) => s.type === "hero");

  return (
    <div
      style={{
        backgroundColor: p.background,
        color: p.text,
        fontFamily: `'${invitation.fontSecondary}', system-ui, sans-serif`,
        direction: invitation.language === "ar" ? "rtl" : "ltr",
        minHeight: "100vh",
      }}
    >
      {/* Envelope opening — only on live view, not preview */}
      <AnimatePresence>
        {!envelopeOpened && !isPreview && (
          <EnvelopeOpening
            invitation={invitation}
            guestName={guestName}
            onOpen={() => setEnvelopeOpened(true)}
          />
        )}
      </AnimatePresence>

      {/* Main content — revealed after envelope */}
      <AnimatePresence>
        {envelopeOpened && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2 }}
          >
            {/* Couple photo hero — always first if cover image exists */}
            {(invitation.coverImageUrl || !hasHeroSection) && (
              <CouplePhotoHero invitation={invitation} isPreview={isPreview} />
            )}

            {/* Story section — shown if couple name has & */}
            {invitation.coupleName?.includes("&") && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <StorySection invitation={invitation} isPreview={isPreview} />
              </motion.div>
            )}

            {/* Remaining sections */}
            {sorted.map((section, i) => {
              // Skip hero if we already showed photo hero
              if (section.type === "hero" && invitation.coverImageUrl) return null;

              const Component = SECTION_MAP[section.type];
              if (!Component) return null;
              return (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-5%" }}
                  transition={{ duration: 0.8, delay: 0.05 * i }}
                >
                  <Component
                    section={section}
                    invitation={invitation}
                    isPreview={isPreview}
                  />
                </motion.div>
              );
            })}

            {/* Music player */}
            <MusicPlayer invitation={invitation} isPreview={isPreview} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
