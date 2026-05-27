"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { InvitationSection, Invitation } from "@/types";

interface Props { section: InvitationSection; invitation: Invitation; isPreview?: boolean; }

interface GuestMessage { name: string; message: string; createdAt: string; }

export function MessageSection({ section, invitation, isPreview }: Props) {
  const palette  = invitation.colorPalette;
  const [name, setName]       = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<GuestMessage[]>(
    (section.content.messages as GuestMessage[]) ?? []
  );
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim() || isPreview) return;
    const newMsg: GuestMessage = { name, message, createdAt: new Date().toISOString() };
    setMessages((prev) => [newMsg, ...prev]);
    setName(""); setMessage(""); setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <section className="py-20 px-8" style={{ background: palette.secondary }}>
      <div className="max-w-xl mx-auto">
        <motion.p
          className="text-[10px] uppercase tracking-[0.35em] text-center mb-10"
          style={{ color: palette.primary, opacity: 0.7 }}
          initial={{ opacity: 0 }} whileInView={{ opacity: 0.7 }} viewport={{ once: true }}
        >
          Leave a Message
        </motion.p>

        {/* Form */}
        <motion.form
          onSubmit={handleSubmit}
          className="space-y-4 mb-10"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="w-full bg-transparent border py-3 px-4 text-sm outline-none placeholder:opacity-30"
            style={{ borderColor: `${palette.primary}40`, color: palette.text }}
          />
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write a heartfelt message for the couple..."
            rows={4}
            className="w-full bg-transparent border py-3 px-4 text-sm outline-none resize-none placeholder:opacity-30"
            style={{ borderColor: `${palette.primary}40`, color: palette.text }}
          />
          <button
            type="submit"
            disabled={!name.trim() || !message.trim()}
            className="w-full py-3 text-xs uppercase tracking-[0.2em] transition-opacity disabled:opacity-40"
            style={{ background: palette.primary, color: palette.background }}
          >
            {submitted ? "Message Sent ✦" : "Send Message"}
          </button>
        </motion.form>

        {/* Messages wall */}
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                className="border p-4"
                style={{ borderColor: `${palette.primary}20` }}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <p
                  className="text-base italic mb-3 leading-relaxed"
                  style={{ fontFamily: `'${invitation.fontPrimary}', serif`, color: palette.text, opacity: 0.8 }}
                >
                  "{msg.message}"
                </p>
                <p className="text-[10px] uppercase tracking-[0.15em]" style={{ color: palette.primary, opacity: 0.65 }}>
                  — {msg.name}
                </p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
