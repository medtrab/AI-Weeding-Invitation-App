"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Invitation } from "@/types";

interface Props {
  invitation: Invitation;
  guestName?: string;
  imageUrl?: string;       // Pre-generated background image
  imagePrompt?: string;    // Prompt to load from Pollinations
  trackingToken?: string;
}

type Scene = "cover" | "story" | "details" | "message";

// ── Floating petals ────────────────────────────────────────────────────────
function Petals({ emoji = "🌸", count = 20 }: { emoji?: string; count?: number }) {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-10">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div key={i} className="absolute select-none text-xl"
          style={{ left: `${(i * 5.1) % 100}%`, top: "-40px", fontSize: `${0.8 + (i % 3) * 0.4}rem` }}
          animate={{ y: ["0vh", "110vh"], rotate: [0, 360 * (i % 2 === 0 ? 1 : -1)], x: [(i % 3 - 1) * 30, (i % 3 - 1) * -30, (i % 3 - 1) * 30], opacity: [0, 0.9, 0.7, 0] }}
          transition={{ duration: 6 + (i % 5) * 1.5, delay: i * 0.35, repeat: Infinity, ease: "linear" }}>
          {emoji}
        </motion.div>
      ))}
    </div>
  );
}

// ── Particle sparks ────────────────────────────────────────────────────────
function Particles({ color = "#FFD700" }: { color?: string }) {
  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      {Array.from({ length: 40 }).map((_, i) => (
        <motion.div key={i} className="absolute rounded-full"
          style={{ width: i % 5 === 0 ? 3 : 1.5, height: i % 5 === 0 ? 3 : 1.5, background: color,
            left: `${(i * 2.6) % 100}%`, top: `${(i * 3.1) % 100}%` }}
          animate={{ opacity: [0, 0.8, 0], scale: [0, 1.5, 0], y: [0, -40 - (i % 5) * 15] }}
          transition={{ duration: 2 + (i % 4), delay: i * 0.2, repeat: Infinity, repeatDelay: 1 }} />
      ))}
    </div>
  );
}

// ── Cover scene ────────────────────────────────────────────────────────────
function CoverScene({ invitation, guestName, bgImage, onOpen, spec }: {
  invitation: Invitation; guestName?: string; bgImage: string | null;
  onOpen: () => void; spec: InvitationSpec;
}) {
  const [tapped, setTapped] = useState(false);
  const p = spec.palette;

  const handleTap = () => {
    if (tapped) return;
    setTapped(true);
    setTimeout(onOpen, 1200);
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden cursor-pointer"
      onClick={handleTap}
      style={{ background: bgImage ? "transparent" : `linear-gradient(135deg, ${p.bg} 0%, #050402 100%)` }}>

      {/* Background image */}
      {bgImage && (
        <div className="absolute inset-0">
          <img src={bgImage} alt="" className="w-full h-full object-cover" style={{ filter: "brightness(0.55) saturate(1.3)" }} />
          <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, transparent 30%, ${p.bg}99 70%, ${p.bg} 100%)` }} />
        </div>
      )}

      <Petals emoji={spec.petalEmoji} count={24} />
      <Particles color={p.primary} />

      {/* Content overlay */}
      <motion.div className="relative z-20 text-center px-8 max-w-sm w-full"
        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, delay: 0.3 }}>

        {/* Top ornament */}
        {spec.topSymbol && (
          <motion.div className="text-5xl mb-4" style={{ filter: "drop-shadow(0 0 12px rgba(255,215,0,0.6))" }}
            animate={{ scale: [1, 1.08, 1], rotate: tapped ? [0, 360] : [0, 0] }}
            transition={{ duration: tapped ? 0.8 : 3, repeat: tapped ? 0 : Infinity, ease: "easeInOut" }}>
            {spec.topSymbol}
          </motion.div>
        )}

        {/* Guest greeting */}
        {guestName && (
          <motion.p className="text-xs uppercase tracking-[0.35em] mb-3"
            style={{ color: p.primary, opacity: 0.8 }}
            initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} transition={{ delay: 0.6 }}>
            Dear {guestName}
          </motion.p>
        )}

        {/* Couple names */}
        <motion.h1
          style={{ fontFamily: `'${spec.fontHeading}', Georgia, serif`, fontSize: "clamp(2.8rem,9vw,4.5rem)", fontWeight: 300, color: p.text, lineHeight: 1.1, textShadow: `0 2px 20px ${p.primary}60` }}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
          {invitation.coupleName?.includes("&") ? (
            <>
              {invitation.coupleName.split("&")[0].trim()}
              <em style={{ display: "block", color: p.primary, fontSize: "0.55em", margin: "0.2em 0", fontStyle: "normal" }}>✦ & ✦</em>
              {invitation.coupleName.split("&")[1].trim()}
            </>
          ) : invitation.coupleName || invitation.title}
        </motion.h1>

        {/* Tagline */}
        {spec.tagline && (
          <motion.p className="mt-4 text-sm leading-relaxed italic"
            style={{ color: p.text, opacity: 0.7, fontFamily: `'${spec.fontHeading}', serif` }}
            initial={{ opacity: 0 }} animate={{ opacity: 0.7 }} transition={{ delay: 1.2 }}>
            {spec.tagline}
          </motion.p>
        )}

        {/* Tap hint */}
        <motion.div className="mt-10 flex flex-col items-center gap-2"
          animate={{ y: [0, -8, 0], opacity: tapped ? 0 : [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}>
          <div className="w-8 h-8 border rounded-full flex items-center justify-center"
            style={{ borderColor: p.primary, color: p.primary }}>✦</div>
          <p className="text-xs uppercase tracking-[0.25em]" style={{ color: p.primary, opacity: 0.6 }}>
            {tapped ? "Opening…" : "Tap to open"}
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}

// ── Story scene ────────────────────────────────────────────────────────────
function StoryScene({ invitation, spec, onNext }: { invitation: Invitation; spec: InvitationSpec; onNext: () => void }) {
  const p = spec.palette;
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16"
      style={{ background: `linear-gradient(180deg, ${p.bg} 0%, ${p.surface} 50%, ${p.bg} 100%)` }}>
      <motion.div className="max-w-sm w-full text-center space-y-6"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <motion.p className="text-xs uppercase tracking-[0.4em]" style={{ color: p.primary, opacity: 0.7 }}
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 0.7, y: 0 }} transition={{ delay: 0.2 }}>
          {spec.storyLabel || "Our Story"}
        </motion.p>
        <motion.div className="text-5xl" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3, type: "spring" }}>
          {spec.storyEmoji || "♥"}
        </motion.div>
        <motion.p className="text-lg leading-relaxed italic"
          style={{ fontFamily: `'${spec.fontHeading}', serif`, color: p.text, opacity: 0.85, lineHeight: 1.9 }}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 0.85, y: 0 }} transition={{ delay: 0.5 }}>
          {spec.storyText || "Their journey brought them together in the most beautiful way…"}
        </motion.p>
        <motion.button onClick={onNext}
          className="mt-8 px-8 py-3 border text-xs uppercase tracking-[0.25em] transition-all hover:opacity-80"
          style={{ borderColor: `${p.primary}50`, color: p.primary }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
          View Invitation ✦
        </motion.button>
      </motion.div>
    </div>
  );
}

// ── Details scene ──────────────────────────────────────────────────────────
function DetailsScene({ invitation, spec, onNext }: { invitation: Invitation; spec: InvitationSpec; onNext: () => void }) {
  const p = spec.palette;
  const date = new Date(invitation.eventDate);
  const dateStr = date.toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const timeStr = date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

  // Live countdown
  const [cd, setCd] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    const tick = () => {
      const diff = date.getTime() - Date.now();
      if (diff > 0) setCd({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const iv = setInterval(tick, 1000);
    return () => clearInterval(iv);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16"
      style={{ background: `radial-gradient(ellipse at 50% 30%, ${p.surface} 0%, ${p.bg} 70%)` }}>
      <motion.div className="max-w-sm w-full space-y-4"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

        <p className="text-center text-xs uppercase tracking-[0.4em] mb-6" style={{ color: p.primary, opacity: 0.7 }}>
          ✦ {spec.detailsLabel || "The Celebration"} ✦
        </p>

        {[
          { label: "Date", value: dateStr, icon: "📅" },
          { label: "Time", value: timeStr, icon: "🕐" },
          { label: "Venue", value: invitation.venue, icon: spec.venueIcon || "📍" },
          invitation.venueAddress ? { label: "Address", value: invitation.venueAddress, icon: "🗺" } : null,
        ].filter(Boolean).map((row, i) => row && (
          <motion.div key={row.label} className="border px-5 py-4 flex gap-4 items-center"
            style={{ borderColor: `${p.primary}25`, background: `${p.surface}88` }}
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 * i + 0.2 }}>
            <span className="text-2xl">{row.icon}</span>
            <div>
              <p className="text-xs uppercase tracking-[0.15em] mb-0.5" style={{ color: p.primary, opacity: 0.6 }}>{row.label}</p>
              <p style={{ fontFamily: `'${spec.fontHeading}', serif`, fontSize: "1.05rem", color: p.text }}>{row.value}</p>
            </div>
          </motion.div>
        ))}

        {/* Countdown */}
        {cd.d > 0 && (
          <motion.div className="border px-5 py-5 text-center"
            style={{ borderColor: `${p.primary}30`, background: `${p.primary}08` }}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
            <p className="text-xs uppercase tracking-[0.3em] mb-4" style={{ color: p.primary, opacity: 0.6 }}>Counting Down</p>
            <div className="flex justify-center gap-5">
              {[{ v: cd.d, l: "Days" }, { v: cd.h, l: "Hours" }, { v: cd.m, l: "Min" }, { v: cd.s, l: "Sec" }].map(({ v, l }) => (
                <div key={l} className="text-center">
                  <p style={{ fontFamily: `'${spec.fontHeading}', serif`, fontSize: "2.2rem", fontWeight: 300, color: p.primary, lineHeight: 1 }}>{String(v).padStart(2, "0")}</p>
                  <p className="text-xs mt-1" style={{ color: p.text, opacity: 0.4 }}>{l}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        <motion.button onClick={onNext}
          className="w-full py-4 text-xs uppercase tracking-[0.25em] transition-all hover:opacity-80"
          style={{ background: p.primary, color: p.bg }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
          Leave a Wish ♡
        </motion.button>
      </motion.div>
    </div>
  );
}

// ── Message scene ──────────────────────────────────────────────────────────
function MessageScene({ invitation, spec }: { invitation: Invitation; spec: InvitationSpec }) {
  const p = spec.palette;
  const [msg, setMsg] = useState("");
  const [sent, setSent] = useState(false);

  const send = async () => {
    if (!msg.trim()) return;
    await fetch(`/api/rsvp/${invitation.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ guestName: "Guest", message: msg, status: "attending" }),
    }).catch(() => {});
    setSent(true);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16"
      style={{ background: `radial-gradient(ellipse at 50% 60%, ${p.surface} 0%, ${p.bg} 100%)` }}>
      <motion.div className="max-w-sm w-full text-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="text-4xl mb-4">{spec.messageEmoji || "💌"}</div>
        <p style={{ fontFamily: `'${spec.fontHeading}', serif`, fontSize: "1.8rem", fontWeight: 300, color: p.text, marginBottom: "0.5rem" }}>
          {spec.messageTitle || "Leave a Wish"}
        </p>
        <p className="text-sm mb-8" style={{ color: p.text, opacity: 0.5 }}>Your words will mean everything to us ♡</p>
        <AnimatePresence mode="wait">
          {!sent ? (
            <motion.div key="form" exit={{ opacity: 0, y: -10 }}>
              <textarea value={msg} onChange={e => setMsg(e.target.value)} rows={5}
                placeholder="Write your wishes here…"
                className="w-full p-4 text-sm leading-relaxed outline-none resize-none"
                style={{ background: `${p.primary}08`, border: `1px solid ${p.primary}30`, color: p.text, borderRadius: 4 }} />
              <button onClick={send}
                className="mt-4 w-full py-4 text-xs uppercase tracking-[0.25em] transition-all hover:opacity-80"
                style={{ background: p.primary, color: p.bg }}>
                Send with Love ♡
              </button>
            </motion.div>
          ) : (
            <motion.div key="thanks" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="py-10">
              <div className="text-5xl mb-4">{spec.thankEmoji || "🕊️"}</div>
              <p style={{ fontFamily: `'${spec.fontHeading}', serif`, fontSize: "1.5rem", fontStyle: "italic", color: p.primary }}>
                Thank you, received with love ✦
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      <Petals emoji={spec.petalEmoji} count={15} />
    </div>
  );
}

// ── Spec type ──────────────────────────────────────────────────────────────
interface InvitationSpec {
  palette: { bg: string; surface: string; primary: string; accent: string; text: string };
  fontHeading: string;
  petalEmoji: string;
  topSymbol: string;
  tagline: string;
  storyLabel: string;
  storyEmoji: string;
  storyText: string;
  detailsLabel: string;
  venueIcon: string;
  messageEmoji: string;
  messageTitle: string;
  thankEmoji: string;
}

const DEFAULT_SPEC: InvitationSpec = {
  palette: { bg: "#0D0B08", surface: "#1A1608", primary: "#C9A84C", accent: "#E8C86A", text: "#FAF7F2" },
  fontHeading: "Cormorant Garamond",
  petalEmoji: "🌸",
  topSymbol: "✦",
  tagline: "You are cordially invited",
  storyLabel: "Our Story",
  storyEmoji: "♥",
  storyText: "Their journey brought them together in the most beautiful way…",
  detailsLabel: "The Celebration",
  venueIcon: "📍",
  messageEmoji: "💌",
  messageTitle: "Leave a Wish",
  thankEmoji: "🕊️",
};

// ── Main template ──────────────────────────────────────────────────────────
export function CinematicTemplate({ invitation, guestName, imageUrl, imagePrompt, trackingToken: _t }: Props) {
  const [scene, setScene] = useState<Scene>("cover");
  const [bgImage, setBgImage] = useState<string | null>(imageUrl || null);
  const [spec, setSpec] = useState<InvitationSpec>(DEFAULT_SPEC);
  const audioRef = useRef<AudioContext | null>(null);

  // Load bg from Pollinations if no direct imageUrl
  useEffect(() => {
    if (!bgImage && imagePrompt) {
      const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(imagePrompt)}?width=1080&height=1920&model=flux&nologo=true&enhance=true`;
      setBgImage(url);
    }
  }, [imagePrompt, bgImage]);

  // Parse invitation color palette into spec
  useEffect(() => {
    const p = invitation.colorPalette as { bg?: string; background?: string; surface?: string; secondary?: string; primary?: string; accent?: string; text?: string };
    setSpec(prev => ({
      ...prev,
      palette: {
        bg:      p.bg      || p.background || prev.palette.bg,
        surface: p.surface || p.secondary  || prev.palette.surface,
        primary: p.primary || prev.palette.primary,
        accent:  p.accent  || prev.palette.accent,
        text:    p.text    || prev.palette.text,
      },
    }));
  }, [invitation.colorPalette]);

  const startMusic = () => {
    if (audioRef.current) return;
    try {
      const ctx = new AudioContext();
      audioRef.current = ctx;
      // Simple ambient tone
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.type = "sine"; osc.frequency.value = 220;
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 2);
      osc.start();
    } catch { /* ignore */ }
  };

  const handleOpen = () => { startMusic(); setScene("story"); };

  return (
    <div className="bg-[#0a0a0a] text-white" style={{ minHeight: "100dvh" }}>
      <AnimatePresence mode="wait">
        {scene === "cover" && (
          <motion.div key="cover" className="fixed inset-0 z-10"
            exit={{ opacity: 0, scale: 1.05 }} transition={{ duration: 0.6 }}>
            <CoverScene invitation={invitation} guestName={guestName} bgImage={bgImage} onOpen={handleOpen} spec={spec} />
          </motion.div>
        )}
        {scene === "story" && (
          <motion.div key="story" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <StoryScene invitation={invitation} spec={spec} onNext={() => setScene("details")} />
          </motion.div>
        )}
        {scene === "details" && (
          <motion.div key="details" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <DetailsScene invitation={invitation} spec={spec} onNext={() => setScene("message")} />
          </motion.div>
        )}
        {scene === "message" && (
          <motion.div key="message" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <MessageScene invitation={invitation} spec={spec} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
