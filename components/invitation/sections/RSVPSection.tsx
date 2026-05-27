"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSubmitRSVP } from "@/hooks/useRSVP";
import type { InvitationSection, Invitation, RSVPStatus } from "@/types";

interface Props { section: InvitationSection; invitation: Invitation; isPreview?: boolean; }

export function RSVPSection({ invitation, isPreview }: Props) {
  const palette = invitation.colorPalette;
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

  const inputStyle = {
    borderColor: `${palette.primary}35`,
    color: palette.text,
    background: "transparent",
  };

  return (
    <section className="py-20 px-8" style={{ background: palette.background }}>
      <div className="max-w-md mx-auto">
        <motion.div className="text-center mb-10" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="text-[10px] uppercase tracking-[0.35em] mb-4" style={{ color: palette.primary, opacity: 0.7 }}>
            {invitation.rsvpDeadline
              ? `Kindly respond by ${new Date(invitation.rsvpDeadline).toLocaleDateString()}`
              : "Kindly respond at your earliest convenience"}
          </p>
          <h2 className="text-4xl font-light" style={{ fontFamily: `'${invitation.fontPrimary}', serif`, color: palette.text }}>
            Will you join us?
          </h2>
        </motion.div>

        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="confirmed"
              className="text-center py-12"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="text-5xl mb-6" style={{ color: palette.primary }}>
                {submittedStatus === "attending" ? "✦" : "✧"}
              </div>
              <h3 className="text-3xl font-light mb-3" style={{ fontFamily: `'${invitation.fontPrimary}', serif`, color: palette.text }}>
                {submittedStatus === "attending" ? "We'll see you there" : "Thank you for letting us know"}
              </h3>
              <p className="text-sm" style={{ color: palette.text, opacity: 0.5 }}>
                {submittedStatus === "attending"
                  ? "Your attendance has been confirmed. We look forward to celebrating with you."
                  : "We're sorry you can't make it. You'll be missed."}
              </p>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              className="space-y-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {/* Accept / Decline toggle */}
              <div className="grid grid-cols-2 gap-px" style={{ background: `${palette.primary}30` }}>
                {(["attending", "declined"] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStatus(s)}
                    className="py-3 text-xs uppercase tracking-[0.15em] transition-all"
                    style={{
                      background: status === s ? palette.primary : palette.background,
                      color: status === s ? palette.background : palette.text,
                    }}
                  >
                    {s === "attending" ? "Joyfully Accept" : "Regretfully Decline"}
                  </button>
                ))}
              </div>

              {/* Name */}
              <div>
                <label className="text-[10px] uppercase tracking-[0.2em] block mb-1.5" style={{ color: palette.primary }}>Full Name *</label>
                <input required value={name} onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full border py-3 px-4 text-sm outline-none placeholder:opacity-30"
                  style={inputStyle}
                />
              </div>

              {/* Email */}
              <div>
                <label className="text-[10px] uppercase tracking-[0.2em] block mb-1.5" style={{ color: palette.primary }}>Email (optional)</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full border py-3 px-4 text-sm outline-none placeholder:opacity-30"
                  style={inputStyle}
                />
              </div>

              {status === "attending" && (
                <>
                  {/* Guest count */}
                  <div>
                    <label className="text-[10px] uppercase tracking-[0.2em] block mb-1.5" style={{ color: palette.primary }}>Number of Guests</label>
                    <input type="number" min={1} max={10} value={guestCount}
                      onChange={(e) => setGuestCount(Number(e.target.value))}
                      className="w-full border py-3 px-4 text-sm outline-none"
                      style={inputStyle}
                    />
                  </div>

                  {/* Meal */}
                  <div>
                    <label className="text-[10px] uppercase tracking-[0.2em] block mb-1.5" style={{ color: palette.primary }}>Meal Preference</label>
                    <select value={meal} onChange={(e) => setMeal(e.target.value)}
                      className="w-full border py-3 px-4 text-sm outline-none cursor-pointer"
                      style={{ ...inputStyle, background: palette.secondary }}
                    >
                      {["standard","vegetarian","vegan","halal","kosher"].map((m) => (
                        <option key={m} value={m} style={{ background: palette.background, color: palette.text }}>
                          {m.charAt(0).toUpperCase() + m.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              {/* Notes */}
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)}
                placeholder="Notes or special requests..."
                rows={3}
                className="w-full border py-3 px-4 text-sm outline-none resize-none placeholder:opacity-30"
                style={inputStyle}
              />

              <button
                type="submit"
                disabled={isPending || !name.trim() || isPreview}
                className="w-full py-4 text-xs uppercase tracking-[0.25em] transition-all disabled:opacity-40"
                style={{ background: palette.primary, color: palette.background }}
              >
                {isPending ? "Sending..." : "Confirm Response"}
              </button>

              {isPreview && (
                <p className="text-center text-[10px]" style={{ color: palette.text, opacity: 0.3 }}>
                  RSVP disabled in preview mode
                </p>
              )}
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
