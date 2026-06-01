"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EnvelopeOpening }  from "./experience/EnvelopeOpening";
import { CouplePhotoHero }  from "./experience/CouplePhotoHero";
import { StorySection }     from "./experience/StorySection";
import { MusicPlayer }      from "./experience/MusicPlayer";
import { DetailsSection }   from "./sections/DetailsSection";
import { CountdownSection } from "./sections/CountdownSection";
import { GallerySection }   from "./sections/GallerySection";
import { RSVPSection }      from "./sections/RSVPSection";
import { MapSection }       from "./sections/MapSection";
import { MessageSection }   from "./sections/MessageSection";
import { HeroSection }      from "./sections/HeroSection";
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
  trackingToken?: string;
}

export function InvitationRenderer({ invitation, guestName, isPreview = false, trackingToken: _trackingToken }: Props) {
  const [envelopeOpened, setEnvelopeOpened] = useState(isPreview);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const p = invitation.colorPalette;

  // Load Google Fonts dynamically
  useEffect(() => {
    const fonts = [invitation.fontPrimary, invitation.fontSecondary]
      .filter(Boolean)
      .map((f) => encodeURIComponent(f))
      .join("&family=");
    const link = document.createElement("link");
    link.rel  = "stylesheet";
    link.href = `https://fonts.googleapis.com/css2?family=${fonts}:ital,wght@0,300;0,400;1,300;1,400&display=swap`;
    document.head.appendChild(link);
    return () => { document.head.removeChild(link); };
  }, [invitation.fontPrimary, invitation.fontSecondary]);

  // Called when user taps the envelope — THIS is the guaranteed user gesture
  const handleEnvelopeOpen = () => {
    // Create & resume AudioContext immediately inside the user gesture handler
    // This is the ONLY reliable way to unlock audio on iOS/Safari/Chrome
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx && !audioCtxRef.current) {
        const ctx = new AudioCtx();
        ctx.resume(); // unlock on iOS
        audioCtxRef.current = ctx;
      }
    } catch {
      // ignore — MusicPlayer will try again
    }
    setEnvelopeOpened(true);
  };

  const sorted = [...invitation.sections]
    .filter((s) => s.visible)
    .sort((a, b) => a.order - b.order);

  const hasHeroSection = sorted.some((s) => s.type === "hero");

  return (
    <div style={{
      backgroundColor: (p as { background: string }).background,
      color: (p as { text: string }).text,
      fontFamily: `'${invitation.fontSecondary}', system-ui, sans-serif`,
      direction: invitation.language === "ar" ? "rtl" : "ltr",
      minHeight: "100vh",
    }}>

      {/* Envelope — shown first, before any content */}
      <AnimatePresence>
        {!envelopeOpened && !isPreview && (
          <EnvelopeOpening
            invitation={invitation}
            guestName={guestName}
            onOpen={handleEnvelopeOpen}
          />
        )}
      </AnimatePresence>

      {/* Main content + music — rendered after envelope opens */}
      <AnimatePresence>
        {envelopeOpened && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2 }}>

            {(invitation.coverImageUrl || !hasHeroSection) && (
              <CouplePhotoHero invitation={invitation} isPreview={isPreview} />
            )}

            {invitation.coupleName?.includes("&") && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}>
                <StorySection invitation={invitation} isPreview={isPreview} />
              </motion.div>
            )}

            {sorted.map((section, i) => {
              if (section.type === "hero" && invitation.coverImageUrl) return null;
              const Component = SECTION_MAP[section.type];
              if (!Component) return null;
              return (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-5%" }}
                  transition={{ duration: 0.8, delay: 0.05 * i }}>
                  <Component section={section} invitation={invitation} isPreview={isPreview} />
                </motion.div>
              );
            })}

            {/* Pass the pre-unlocked AudioContext to MusicPlayer */}
            <MusicPlayer
              invitation={invitation}
              isPreview={isPreview}
              unlockedCtx={audioCtxRef.current}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
