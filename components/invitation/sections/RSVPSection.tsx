"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSubmitRSVP } from "@/hooks/useRSVP";
import type { InvitationSection, Invitation, RSVPStatus } from "@/types";

interface Props { section: InvitationSection; invitation: Invitation; isPreview?: boolean; }

export function RSVPSection({ invitation, isPreview }: Props) {
  const p = invitation.colorPalette;
  const [status, setStatus]         = useState<RSVPStatus>("attending");
  const [name, setName]             = useState("");
  const [email, setEmail]           = useState("");
  const [guestCount, setGuestCount] = useState(1);
  const [meal, setMeal]             = useState("standard");
  const [notes, setNotes]           = useState("");
  const [submitted, setSubmitted]   = useState(false);
  const [submittedStatus, setSubmittedStatus] = useState<RSVPStatus>("attending");
  const { mutateAsync: submit, isPending }    = useSubmitRSVP();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isPreview) return;
    await submit({
      invitationId: invitation.id, guestName: name, guestEmail: email || undefined,
      status, guestCount, mealPreference: meal as never, notes: notes || undefined,
    });
    setSubmittedStatus(status);
    setSubmitted(true);
  };

  const inputStyle: React.CSSProperties = {
    borderColor: `${p.primary}30`,
    color: p.text,
    background: `${p.primary}06`,
  };

  return (
    <section
      className="py-24 px-8 relative overflow-hidden"
      style={{ background: `linear-gradient(180deg, ${p.background}, ${p.secondary} 50%, ${p.background})` }}
    >
      {/* Decorative top arch */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2">
        <svg width="300" height="40" viewBox="0 0 300 40">
          <path d="M150 38 Q75 0 0 8 L0 0 L300 0 L300 8 Q225 0 150 38Z" fill={p.primary} opacity="0.1"/>
          <path d="M150 30 Q100 8 50 12 M150 30 Q200 8 250 12" stroke={p.primary} strokeWidth="0.5" fill="none" opacity="0.3"/>
        </svg>
      </div>

      <div className="max-w-md mx-auto relative z-10">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p
            className="text-[10px] uppercase tracking-[0.4em] mb-3"
            style={{ color: p.primary, opacity: 0.7 }}
          >
            {invitation.rsvpDeadline
              ? `Kindly respond by ${new Date(invitation.rsvpDeadline).toLocaleDateString()}`
              : "Kindly confirm your attendance"}
          </p>
          <h2
            className="text-3xl font-light mb-1"
            style={{ fontFamily: `'${invitation.fontPrimary}', serif`, color: p.text }}
          >
            Will you join us?
          </h2>
          <div className="flex items-center justify-center gap-3 mt-4">
            <div className="h-px w-16" style={{ background: `linear-gradient(90deg, transparent, ${p.primary})`, opacity: 0.4 }} />
            <span style={{ color: p.primary, opacity: 0.5 }}>✦</span>
            <div className="h-px w-16" style={{ background: `linear-gradient(90deg, ${p.primary}, transparent)`, opacity: 0.4 }} />
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="confirmed"
              className="text-center py-16 px-8 border"
              style={{ borderColor: `${p.primary}25` }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="text-5xl mb-6" style={{ color: p.primary }}>
                {submittedStatus === "attending" ? "✦" : "✧"}
              </div>
              <h3
                className="text-2xl font-light mb-3"
                style={{ fontFamily: `'${invitation.fontPrimary}', serif`, color: p.text }}
              >
                {submittedStatus === "attending" ? "We'll see you there" : "Thank you for letting us know"}
              </h3>
              <p className="text-sm" style={{ color: p.text, opacity: 0.5 }}>
                {submittedStatus === "attending"
                  ? "Your attendance has been confirmed with joy."
                  : "You will be dearly missed."}
              </p>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              className="space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {/* Accept/Decline */}
              <div className="grid grid-cols-2 gap-2">
                {(["attending", "declined"] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStatus(s)}
                    className="py-3 text-xs uppercase tracking-[0.15em] transition-all border"
                    style={{
                      background: status === s ? p.primary : "transparent",
                      color: status === s ? p.background : p.text,
                      borderColor: status === s ? p.primary : `${p.primary}30`,
                      opacity: status === s ? 1 : 0.6,
                    }}
                  >
                    {s === "attending" ? "✦ Joyfully Accept" : "✧ Regretfully Decline"}
                  </button>
                ))}
              </div>

              {/* Name */}
              <div>
                <label className="text-[10px] uppercase tracking-[0.2em] block mb-1.5" style={{ color: p.primary, opacity: 0.7 }}>
                  Full Name *
                </label>
                <input
                  required value={name} onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full border py-3 px-4 text-sm outline-none placeholder:opacity-25"
                  style={inputStyle}
                />
              </div>

              {/* Email */}
              <div>
                <label className="text-[10px] uppercase tracking-[0.2em] block mb-1.5" style={{ color: p.primary, opacity: 0.7 }}>
                  Email (optional)
                </label>
                <input
                  type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full border py-3 px-4 text-sm outline-none placeholder:opacity-25"
                  style={inputStyle}
                />
              </div>

              {status === "attending" && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] uppercase tracking-[0.2em] block mb-1.5" style={{ color: p.primary, opacity: 0.7 }}>Guests</label>
                      <input
                        type="number" min={1} max={10} value={guestCount}
                        onChange={(e) => setGuestCount(Number(e.target.value))}
                        className="w-full border py-3 px-4 text-sm outline-none"
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase tracking-[0.2em] block mb-1.5" style={{ color: p.primary, opacity: 0.7 }}>Meal</label>
                      <select
                        value={meal} onChange={(e) => setMeal(e.target.value)}
                        className="w-full border py-3 px-4 text-sm outline-none cursor-pointer"
                        style={{ ...inputStyle, background: p.secondary }}
                      >
                        {["standard","vegetarian","vegan","halal","kosher"].map((m) => (
                          <option key={m} value={m} style={{ background: p.background, color: p.text }}>
                            {m.charAt(0).toUpperCase() + m.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </>
              )}

              <textarea
                value={notes} onChange={(e) => setNotes(e.target.value)}
                placeholder="Special requests or notes…"
                rows={3}
                className="w-full border py-3 px-4 text-sm outline-none resize-none placeholder:opacity-25"
                style={inputStyle}
              />

              <button
                type="submit"
                disabled={isPending || !name.trim() || isPreview}
                className="w-full py-4 text-xs uppercase tracking-[0.25em] transition-all disabled:opacity-40 relative overflow-hidden"
                style={{ background: p.primary, color: p.background }}
              >
                {isPending ? "Sending…" : "Confirm Response"}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>

      {/* Decorative bottom arch */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 rotate-180">
        <svg width="300" height="40" viewBox="0 0 300 40">
          <path d="M150 38 Q75 0 0 8 L0 0 L300 0 L300 8 Q225 0 150 38Z" fill={p.primary} opacity="0.08"/>
        </svg>
      </div>
    </section>
  );
}
