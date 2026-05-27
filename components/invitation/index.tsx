// components/invitation/InvitationRenderer.tsx
// Renders the full interactive invitation experience

"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useBackgroundMusic } from "@/hooks/useBackgroundMusic";
import { HeroSection } from "./sections/HeroSection";
import { DetailsSection } from "./sections/DetailsSection";
import { CountdownSection } from "./sections/CountdownSection";
import { GallerySection } from "./sections/GallerySection";
import { RSVPSection } from "./sections/RSVPSection";
import { MapSection } from "./sections/MapSection";
import { MessageSection } from "./sections/MessageSection";
import { MusicToggle } from "./MusicToggle";
import type { Invitation, InvitationSection } from "@/types";

interface InvitationRendererProps {
  invitation: Invitation;
  guestName?: string;
  isPreview?: boolean;
}

const SECTION_COMPONENTS: Record<
  InvitationSection["type"],
  React.ComponentType<{ section: InvitationSection; invitation: Invitation; isPreview?: boolean }>
> = {
  hero: HeroSection,
  details: DetailsSection,
  countdown: CountdownSection,
  gallery: GallerySection,
  rsvp: RSVPSection,
  map: MapSection,
  message: MessageSection,
};

export function InvitationRenderer({
  invitation,
  guestName,
  isPreview = false,
}: InvitationRendererProps) {
  const { init, toggle, isPlaying } = useBackgroundMusic(
    isPreview ? undefined : invitation.musicUrl
  );

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isPreview) {
      // First user interaction triggers music
      const handleFirstInteraction = () => {
        init();
        document.removeEventListener("click", handleFirstInteraction);
      };
      document.addEventListener("click", handleFirstInteraction, { once: true });
    }
  }, [init, isPreview]);

  const visibleSections = invitation.sections
    .filter((s) => s.visible)
    .sort((a, b) => a.order - b.order);

  const cssVars = {
    "--inv-primary": invitation.colorPalette.primary,
    "--inv-secondary": invitation.colorPalette.secondary,
    "--inv-accent": invitation.colorPalette.accent,
    "--inv-bg": invitation.colorPalette.background,
    "--inv-text": invitation.colorPalette.text,
    "--inv-font-primary": `'${invitation.fontPrimary}', serif`,
    "--inv-font-secondary": `'${invitation.fontSecondary}', sans-serif`,
  } as React.CSSProperties;

  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-screen overflow-hidden"
      style={{
        ...cssVars,
        backgroundColor: invitation.colorPalette.background,
        color: invitation.colorPalette.text,
        fontFamily: `var(--inv-font-secondary)`,
        direction: invitation.language === "ar" ? "rtl" : "ltr",
      }}
    >
      {/* Personalized greeting overlay */}
      {guestName && !isPreview && (
        <PersonalizedGreeting guestName={guestName} />
      )}

      {/* Sections */}
      {visibleSections.map((section, i) => {
        const Component = SECTION_COMPONENTS[section.type];
        if (!Component) return null;

        return (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.8, delay: i * 0.05 }}
          >
            <Component
              section={section}
              invitation={invitation}
              isPreview={isPreview}
            />
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


// components/invitation/PersonalizedGreeting.tsx

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PersonalizedGreetingProps {
  guestName: string;
}

function PersonalizedGreeting({ guestName }: PersonalizedGreetingProps) {
  const [dismissed, setDismissed] = useState(false);

  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: "var(--inv-bg)" }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
        >
          <motion.div
            className="text-center px-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.9 }}
          >
            <p
              className="text-sm uppercase tracking-[0.3em] mb-4"
              style={{ color: "var(--inv-primary)", opacity: 0.7 }}
            >
              An invitation for
            </p>
            <h1
              className="text-5xl font-light"
              style={{ fontFamily: "var(--inv-font-primary)", color: "var(--inv-text)" }}
            >
              {guestName}
            </h1>
            <button
              onClick={() => setDismissed(true)}
              className="mt-10 text-xs uppercase tracking-[0.25em] px-8 py-3 border"
              style={{
                borderColor: "var(--inv-primary)",
                color: "var(--inv-primary)",
              }}
            >
              Open Invitation
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}


// components/invitation/sections/HeroSection.tsx

"use client";

import { motion } from "framer-motion";
import { GoldDivider } from "@/components/ui/GoldDivider";
import type { InvitationSection, Invitation } from "@/types";

interface HeroSectionProps {
  section: InvitationSection;
  invitation: Invitation;
  isPreview?: boolean;
}

export function HeroSection({ invitation }: HeroSectionProps) {
  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center text-center px-8 py-16"
      style={{
        backgroundImage: invitation.backgroundImageUrl
          ? `url(${invitation.backgroundImageUrl})`
          : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {invitation.backgroundImageUrl && (
        <div
          className="absolute inset-0"
          style={{ backgroundColor: "var(--inv-bg)", opacity: 0.7 }}
        />
      )}

      <div className="relative z-10">
        <motion.p
          className="text-[10px] uppercase tracking-[0.4em] mb-8"
          style={{ color: "var(--inv-primary)", opacity: 0.7 }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 0.7, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          ✦ — You&apos;re Invited — ✦
        </motion.p>

        <motion.h1
          className="text-5xl sm:text-7xl font-light leading-tight mb-6"
          style={{ fontFamily: "var(--inv-font-primary)" }}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          {invitation.coupleName?.split("&").map((name, i, arr) => (
            <span key={i}>
              {name.trim()}
              {i < arr.length - 1 && (
                <em
                  className="block italic text-[1.15em]"
                  style={{ color: "var(--inv-primary)" }}
                >
                  &
                </em>
              )}
            </span>
          )) ?? invitation.title}
        </motion.h1>

        <motion.div
          className="flex items-center justify-center mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.7 }}
        >
          <GoldDivider className="w-48" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.9 }}
        >
          <p
            className="text-sm uppercase tracking-[0.2em] mb-1"
            style={{ opacity: 0.5 }}
          >
            {new Date(invitation.eventDate).toLocaleDateString("en-GB", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
          <p
            className="text-sm tracking-wide"
            style={{ opacity: 0.6 }}
          >
            {invitation.venue}
          </p>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{ color: "var(--inv-primary)", opacity: 0.4 }}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M10 4v12M6 12l4 4 4-4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </motion.div>
    </section>
  );
}


// components/invitation/sections/CountdownSection.tsx

"use client";

import { motion } from "framer-motion";
import { useCountdown } from "@/hooks/useCountdown";
import type { InvitationSection, Invitation } from "@/types";

interface CountdownSectionProps {
  section: InvitationSection;
  invitation: Invitation;
}

export function CountdownSection({ invitation }: CountdownSectionProps) {
  const { days, hours, minutes, seconds, isExpired } = useCountdown(
    invitation.eventDate
  );

  if (isExpired) return null;

  const units = [
    { value: days, label: "Days" },
    { value: hours, label: "Hours" },
    { value: minutes, label: "Minutes" },
    { value: seconds, label: "Seconds" },
  ];

  return (
    <section className="py-20 px-8 text-center">
      <p
        className="text-[10px] uppercase tracking-[0.3em] mb-10"
        style={{ color: "var(--inv-primary)", opacity: 0.6 }}
      >
        Counting down to forever
      </p>
      <div className="flex justify-center gap-8">
        {units.map(({ value, label }) => (
          <motion.div
            key={label}
            className="text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <div
              className="text-5xl sm:text-6xl font-light tabular-nums"
              style={{
                fontFamily: "var(--inv-font-primary)",
                color: "var(--inv-primary)",
              }}
            >
              {String(value).padStart(2, "0")}
            </div>
            <div
              className="text-[10px] uppercase tracking-[0.2em] mt-2"
              style={{ opacity: 0.4 }}
            >
              {label}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}


// components/invitation/sections/RSVPSection.tsx

"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { useSubmitRSVP } from "@/hooks/useRSVP";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import type { InvitationSection, Invitation, RSVPStatus, MealPreference } from "@/types";

const rsvpSchema = z.object({
  guestName: z.string().min(2, "Please enter your name"),
  guestEmail: z.string().email("Invalid email").optional().or(z.literal("")),
  status: z.enum(["attending", "declined"] as const),
  guestCount: z.coerce.number().min(1).max(10),
  mealPreference: z.enum(["standard", "vegetarian", "vegan", "halal", "kosher"] as const).optional(),
  notes: z.string().optional(),
});

type RSVPFormValues = z.infer<typeof rsvpSchema>;

interface RSVPSectionProps {
  section: InvitationSection;
  invitation: Invitation;
  isPreview?: boolean;
}

export function RSVPSection({ invitation, isPreview = false }: RSVPSectionProps) {
  const [submitted, setSubmitted] = useState(false);
  const [submittedStatus, setSubmittedStatus] = useState<RSVPStatus | null>(null);
  const { mutateAsync: submit, isPending } = useSubmitRSVP();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RSVPFormValues>({
    resolver: zodResolver(rsvpSchema),
    defaultValues: { guestCount: 1, status: "attending" },
  });

  const status = watch("status");

  const onSubmit = async (values: RSVPFormValues) => {
    if (isPreview) return;
    await submit({
      invitationId: invitation.id,
      ...values,
      guestEmail: values.guestEmail || undefined,
    });
    setSubmittedStatus(values.status);
    setSubmitted(true);
  };

  return (
    <section className="py-20 px-8 max-w-lg mx-auto">
      <div className="text-center mb-10">
        <p className="text-[10px] uppercase tracking-[0.3em] mb-4" style={{ color: "var(--inv-primary)", opacity: 0.6 }}>
          Kindly respond by {invitation.rsvpDeadline
            ? new Date(invitation.rsvpDeadline).toLocaleDateString()
            : "the event date"}
        </p>
        <h2 className="text-4xl font-light" style={{ fontFamily: "var(--inv-font-primary)" }}>
          Will you join us?
        </h2>
      </div>

      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div
            key="confirmed"
            className="text-center py-12"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div
              className="text-4xl mb-4"
              style={{ color: "var(--inv-primary)" }}
            >
              {submittedStatus === "attending" ? "✦" : "✧"}
            </div>
            <h3 className="text-3xl font-light mb-3" style={{ fontFamily: "var(--inv-font-primary)" }}>
              {submittedStatus === "attending" ? "We'll see you there" : "Thank you for letting us know"}
            </h3>
            <p className="text-sm" style={{ opacity: 0.5 }}>
              {submittedStatus === "attending"
                ? "Your attendance has been confirmed."
                : "We're sorry you can't make it."}
            </p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {/* Attend / Decline toggle */}
            <div className="grid grid-cols-2 gap-px" style={{ background: "var(--inv-primary)", opacity: 0.3 }}>
              {(["attending", "declined"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setValue("status", s)}
                  className="py-3 text-xs uppercase tracking-[0.15em] transition-colors"
                  style={{
                    background: status === s ? "var(--inv-primary)" : "var(--inv-bg)",
                    color: status === s ? "var(--inv-bg)" : "var(--inv-text)",
                    opacity: 1,
                  }}
                >
                  {s === "attending" ? "Joyfully Accept" : "Regretfully Decline"}
                </button>
              ))}
            </div>

            <Input
              label="Your Full Name"
              placeholder="Sofia Leclair"
              {...register("guestName")}
              error={errors.guestName?.message}
            />

            <Input
              label="Email (optional)"
              type="email"
              placeholder="sofia@example.com"
              {...register("guestEmail")}
              error={errors.guestEmail?.message}
            />

            {status === "attending" && (
              <>
                <div>
                  <label className="text-[10px] uppercase tracking-[0.2em] block mb-2" style={{ color: "var(--inv-primary)" }}>
                    Number of Guests
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    {...register("guestCount")}
                    className="w-full bg-transparent border py-3 px-4 text-sm outline-none"
                    style={{ borderColor: "var(--inv-primary)", opacity: 0.4, color: "var(--inv-text)" }}
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-[0.2em] block mb-2" style={{ color: "var(--inv-primary)" }}>
                    Meal Preference
                  </label>
                  <select
                    {...register("mealPreference")}
                    className="w-full bg-transparent border py-3 px-4 text-sm outline-none cursor-pointer"
                    style={{ borderColor: "var(--inv-primary)", opacity: 0.4, color: "var(--inv-text)", background: "var(--inv-bg)" }}
                  >
                    <option value="standard">Standard</option>
                    <option value="vegetarian">Vegetarian</option>
                    <option value="vegan">Vegan</option>
                    <option value="halal">Halal</option>
                    <option value="kosher">Kosher</option>
                  </select>
                </div>
              </>
            )}

            <textarea
              placeholder="Notes or special requests..."
              rows={3}
              {...register("notes")}
              className="w-full bg-transparent border py-3 px-4 text-sm outline-none resize-none placeholder:opacity-30"
              style={{ borderColor: "var(--inv-primary)", opacity: 0.4, color: "var(--inv-text)" }}
            />

            <button
              type="submit"
              disabled={isPending || isPreview}
              className="w-full py-4 text-xs uppercase tracking-[0.25em] transition-all disabled:opacity-50"
              style={{
                background: "var(--inv-primary)",
                color: "var(--inv-bg)",
              }}
            >
              {isPending ? "Sending..." : "Confirm Response"}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </section>
  );
}


// components/invitation/MusicToggle.tsx

"use client";

import { motion } from "framer-motion";
import { Music, VolumeX } from "lucide-react";

interface MusicToggleProps {
  isPlaying: boolean;
  onToggle: () => void;
}

export function MusicToggle({ isPlaying, onToggle }: MusicToggleProps) {
  return (
    <motion.button
      className="fixed bottom-6 right-6 z-40 w-10 h-10 flex items-center justify-center border"
      style={{
        borderColor: "var(--inv-primary)",
        color: "var(--inv-primary)",
        background: "var(--inv-bg)",
        opacity: 0.8,
      }}
      onClick={onToggle}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 0.8, y: 0 }}
      transition={{ delay: 2 }}
      aria-label={isPlaying ? "Mute music" : "Play music"}
    >
      {isPlaying ? <Music size={15} /> : <VolumeX size={15} />}
    </motion.button>
  );
}
