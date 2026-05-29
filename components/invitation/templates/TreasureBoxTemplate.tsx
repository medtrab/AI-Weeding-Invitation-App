"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Invitation } from "@/types";

// ── Types ──────────────────────────────────────────────────────────────────
interface Props {
  invitation: Invitation;
  guestName?: string;
  songUrl?: string;    // direct audio URL
  songLabel?: string;  // display name
}

type Scene = "box" | "pigeon" | "reveal" | "details" | "message";

// ── Particle system ────────────────────────────────────────────────────────
function Particles({ active, color = "#C9A84C" }: { active: boolean; color?: string }) {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-10">
      {active && Array.from({ length: 40 }).map((_, i) => (
        <motion.div key={i}
          className="absolute w-1.5 h-1.5 rounded-full"
          style={{
            background: i % 3 === 0 ? color : i % 3 === 1 ? "#fff" : "#f0d080",
            left: `${Math.random() * 100}%`,
            top: "60%",
          }}
          initial={{ y: 0, opacity: 1, scale: 1 }}
          animate={{
            y: -(300 + Math.random() * 400),
            x: (Math.random() - 0.5) * 300,
            opacity: 0,
            scale: 0,
            rotate: Math.random() * 720,
          }}
          transition={{ duration: 1.5 + Math.random(), delay: Math.random() * 0.5, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}

// ── Floating petals ────────────────────────────────────────────────────────
function FloatingPetals({ active }: { active: boolean }) {
  if (!active) return null;
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-5">
      {Array.from({ length: 18 }).map((_, i) => (
        <motion.div key={i}
          className="absolute text-lg select-none"
          style={{ left: `${5 + i * 5.3}%`, top: "-40px" }}
          animate={{ y: ["0vh", "110vh"], rotate: [0, 360], opacity: [0, 0.9, 0] }}
          transition={{ duration: 7 + (i % 4) * 2, delay: i * 0.5, repeat: Infinity, ease: "linear" }}>
          {["🌸", "✿", "🌺", "❀"][i % 4]}
        </motion.div>
      ))}
    </div>
  );
}

// ── Music toggle ───────────────────────────────────────────────────────────
function MusicButton({ audioRef, songLabel }: { audioRef: React.RefObject<HTMLAudioElement | null>; songLabel?: string }) {
  const [playing, setPlaying] = useState(false);
  const toggle = () => {
    if (!audioRef.current) return;
    if (playing) { audioRef.current.pause(); setPlaying(false); }
    else { audioRef.current.play().catch(() => {}); setPlaying(true); }
  };
  return (
    <button onClick={toggle}
      className="fixed top-4 right-4 z-50 flex items-center gap-2 px-3 py-2 rounded-full bg-black/40 border border-gold/30 text-xs text-gold/80 backdrop-blur-sm hover:bg-gold/10 transition-all">
      <span className={playing ? "animate-pulse" : ""}>♪</span>
      <span className="hidden sm:inline max-w-[120px] truncate">{songLabel || (playing ? "Pause" : "Play Music")}</span>
    </button>
  );
}

// ── Scene: Treasure Box ────────────────────────────────────────────────────
function BoxScene({ onOpen }: { onOpen: () => void }) {
  const [tapped, setTapped] = useState(false);

  const handleTap = () => {
    if (tapped) return;
    setTapped(true);
    setTimeout(onOpen, 1800);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
      {/* Background glow */}
      <div className="absolute inset-0 bg-radial-gradient pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 70%, rgba(201,168,76,0.08) 0%, transparent 70%)" }} />

      <motion.p className="text-[11px] uppercase tracking-[0.4em] text-gold/60 mb-8"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        ✦ A Gift Awaits You ✦
      </motion.p>

      {/* The treasure box */}
      <motion.div className="cursor-pointer relative select-none" onClick={handleTap}
        initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}>

        {/* Glow ring */}
        <motion.div className="absolute inset-0 rounded-lg -m-4"
          animate={{ boxShadow: tapped ? "0 0 80px 30px rgba(201,168,76,0.5)" : "0 0 30px 10px rgba(201,168,76,0.15)" }}
          transition={{ duration: 0.6 }} />

        <svg width="220" height="200" viewBox="0 0 220 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Box lid */}
          <motion.g
            animate={tapped ? { rotateX: -110, y: -20, opacity: 0 } : { rotateX: 0, y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            style={{ transformOrigin: "110px 70px", transformStyle: "preserve-3d" }}>
            {/* Lid body */}
            <rect x="15" y="55" width="190" height="50" rx="4" fill="url(#lidGrad)" stroke="#C9A84C" strokeWidth="1.5"/>
            {/* Lid arabesque pattern */}
            <rect x="25" y="63" width="170" height="34" rx="2" fill="none" stroke="#C9A84C" strokeWidth="0.5" strokeOpacity="0.4"/>
            <text x="110" y="85" textAnchor="middle" fill="#C9A84C" fontSize="14" fontFamily="serif" opacity="0.7">✦ ◆ ✦</text>
            {/* Hinge */}
            <rect x="95" y="53" width="30" height="6" rx="3" fill="#A8893A"/>
            {/* Clasp on front */}
            <rect x="96" y="100" width="28" height="12" rx="6" fill="#C9A84C"/>
            <circle cx="110" cy="106" r="4" fill="#8B6914"/>
          </motion.g>

          {/* Box body */}
          <rect x="15" y="100" width="190" height="85" rx="4" fill="url(#boxGrad)" stroke="#C9A84C" strokeWidth="1.5"/>
          <rect x="25" y="108" width="170" height="69" rx="2" fill="none" stroke="#C9A84C" strokeWidth="0.5" strokeOpacity="0.3"/>
          {/* Side ornaments */}
          <text x="50" y="150" textAnchor="middle" fill="#C9A84C" fontSize="10" opacity="0.4">❋</text>
          <text x="170" y="150" textAnchor="middle" fill="#C9A84C" fontSize="10" opacity="0.4">❋</text>
          {/* Bottom shadow */}
          <ellipse cx="110" cy="190" rx="85" ry="8" fill="black" opacity="0.3"/>

          {/* Golden light burst when opened */}
          {tapped && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1.2 }}>
              {Array.from({ length: 12 }).map((_, i) => (
                <motion.line key={i}
                  x1="110" y1="100"
                  x2={110 + Math.cos((i / 12) * Math.PI * 2) * 100}
                  y2={100 + Math.sin((i / 12) * Math.PI * 2) * 80}
                  stroke="#FFD700" strokeWidth="1.5" opacity="0.6"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5, delay: i * 0.04 }} />
              ))}
            </motion.g>
          )}

          <defs>
            <linearGradient id="lidGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2A1F0A"/>
              <stop offset="100%" stopColor="#1A1305"/>
            </linearGradient>
            <linearGradient id="boxGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1A1305"/>
              <stop offset="100%" stopColor="#0D0B08"/>
            </linearGradient>
          </defs>
        </svg>
      </motion.div>

      <motion.div className="mt-8 flex flex-col items-center gap-3"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
        {!tapped ? (
          <>
            <p className="font-cormorant text-lg text-cream/70 italic">Tap to open your gift</p>
            <motion.div className="w-10 h-10 border border-gold/40 rounded-full flex items-center justify-center"
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}>
              <span className="text-gold text-sm">✦</span>
            </motion.div>
          </>
        ) : (
          <motion.p className="font-cormorant text-xl text-gold italic"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            Opening…
          </motion.p>
        )}
      </motion.div>

      <Particles active={tapped} />
    </div>
  );
}

// ── Scene: Pigeon ──────────────────────────────────────────────────────────
function PigeonScene({ onDone }: { onDone: () => void }) {
  useEffect(() => { const t = setTimeout(onDone, 3500); return () => clearTimeout(t); }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen overflow-hidden">
      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse at 50% 60%, #1a2a4a 0%, #0a0e1a 100%)"
      }}/>

      {/* Pigeon flying out */}
      <motion.div className="relative z-10 text-center"
        initial={{ scale: 0.2, y: 80, opacity: 0 }}
        animate={{ scale: [0.2, 1.2, 1], y: [80, -20, 0], opacity: [0, 1, 1] }}
        transition={{ duration: 1.2, ease: "easeOut" }}>

        {/* White pigeon SVG */}
        <svg width="160" height="120" viewBox="0 0 160 120" fill="none">
          <motion.g
            animate={{ y: [-8, 8, -8], rotate: [-3, 3, -3] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
            {/* Body */}
            <ellipse cx="80" cy="65" rx="38" ry="22" fill="white" opacity="0.95"/>
            {/* Head */}
            <circle cx="112" cy="52" r="14" fill="white" opacity="0.95"/>
            {/* Beak */}
            <path d="M124 52 L134 50 L124 56 Z" fill="#F5C842"/>
            {/* Eye */}
            <circle cx="117" cy="49" r="3" fill="#333"/>
            <circle cx="118" cy="48" r="1" fill="white"/>
            {/* Wings */}
            <motion.path d="M60 60 Q30 30 15 50 Q30 65 60 68 Z" fill="white" opacity="0.9"
              animate={{ d: ["M60 60 Q30 30 15 50 Q30 65 60 68 Z", "M60 60 Q30 45 15 60 Q30 70 60 68 Z", "M60 60 Q30 30 15 50 Q30 65 60 68 Z"] }}
              transition={{ duration: 0.5, repeat: Infinity }}/>
            <motion.path d="M65 58 Q50 25 40 40 Q50 58 65 62 Z" fill="white" opacity="0.85"
              animate={{ d: ["M65 58 Q50 25 40 40 Q50 58 65 62 Z", "M65 58 Q50 38 40 48 Q50 60 65 62 Z", "M65 58 Q50 25 40 40 Q50 58 65 62 Z"] }}
              transition={{ duration: 0.5, repeat: Infinity }}/>
            {/* Tail */}
            <path d="M42 70 Q20 75 18 85 Q35 78 45 73 Z" fill="white" opacity="0.8"/>
            {/* Envelope in beak */}
            <motion.g
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}>
              <rect x="127" y="52" width="22" height="15" rx="1" fill="#F5E4B0" stroke="#C9A84C" strokeWidth="0.8"/>
              <path d="M127 52 L138 60 L149 52" stroke="#C9A84C" strokeWidth="0.8" fill="none"/>
            </motion.g>
          </motion.g>
        </svg>

        <motion.p className="font-cormorant text-2xl text-white/90 italic mt-4"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
          A message arrives for you…
        </motion.p>

        {/* Stars / sparkles around pigeon */}
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div key={i} className="absolute text-yellow-300"
            style={{ left: `${20 + i * 6}%`, top: `${20 + (i % 3) * 20}%`, fontSize: "10px" }}
            animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
            transition={{ duration: 1.5, delay: i * 0.15, repeat: Infinity, repeatDelay: 1 }}>
            ✦
          </motion.div>
        ))}
      </motion.div>

      <FloatingPetals active />
    </div>
  );
}

// ── Scene: Invitation Reveal ───────────────────────────────────────────────
function RevealScene({ invitation, guestName, onNext }: { invitation: Invitation; guestName?: string; onNext: () => void }) {
  const p = invitation.colorPalette as { primary: string; secondary: string; accent: string; background: string; text: string };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-16"
      style={{ background: `linear-gradient(135deg, ${p.background} 0%, #0a0e1a 100%)` }}>

      <motion.div className="w-full max-w-sm text-center"
        initial={{ opacity: 0, scale: 0.85, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}>

        {/* Card */}
        <div className="relative border p-8 sm:p-10"
          style={{ borderColor: p.primary + "40", background: p.background + "ee" }}>
          {/* Corner ornaments */}
          {["tl","tr","bl","br"].map((pos) => (
            <div key={pos} className={`absolute text-lg ${
              pos==="tl" ? "top-3 left-3" : pos==="tr" ? "top-3 right-3" : pos==="bl" ? "bottom-3 left-3" : "bottom-3 right-3"
            }`} style={{ color: p.primary, opacity: 0.5 }}>❋</div>
          ))}
          {/* Top line */}
          <div className="absolute top-0 left-0 right-0 h-px"
            style={{ background: `linear-gradient(90deg, transparent, ${p.primary}, transparent)` }} />

          {/* Dear guest */}
          {guestName && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <p className="text-[10px] uppercase tracking-[0.35em] mb-1" style={{ color: p.primary, opacity: 0.7 }}>Dear</p>
              <p className="font-cormorant text-3xl font-light mb-6" style={{ color: p.text }}>{guestName}</p>
            </motion.div>
          )}

          {/* Names */}
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <p className="font-cormorant text-4xl sm:text-5xl font-light leading-tight"
              style={{ color: p.primary }}>
              {invitation.coupleName || invitation.title}
            </p>
          </motion.div>

          <motion.div className="flex items-center gap-3 my-5 justify-center"
            initial={{ opacity: 0, scaleX: 0 }} animate={{ opacity: 1, scaleX: 1 }} transition={{ delay: 0.7, duration: 0.8 }}>
            <div className="h-px w-20" style={{ background: `linear-gradient(90deg, transparent, ${p.primary})` }}/>
            <span style={{ color: p.primary }}>◆</span>
            <div className="h-px w-20" style={{ background: `linear-gradient(90deg, ${p.primary}, transparent)` }}/>
          </motion.div>

          <motion.p className="font-cormorant text-base italic leading-relaxed mb-6"
            style={{ color: p.text, opacity: 0.75 }}
            initial={{ opacity: 0 }} animate={{ opacity: 0.75 }} transition={{ delay: 0.9 }}>
            We are deeply honoured to invite you to celebrate this beautiful moment with us.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }}>
            <p className="text-[10px] uppercase tracking-[0.25em]" style={{ color: p.primary, opacity: 0.6 }}>
              {new Date(invitation.eventDate).toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            </p>
            <p className="font-cormorant text-lg mt-1" style={{ color: p.text, opacity: 0.7 }}>{invitation.venue}</p>
          </motion.div>

          <div className="absolute bottom-0 left-0 right-0 h-px"
            style={{ background: `linear-gradient(90deg, transparent, ${p.primary}, transparent)` }} />
        </div>

        <motion.button onClick={onNext}
          className="mt-8 px-8 py-3 border text-xs uppercase tracking-[0.25em] transition-all hover:opacity-80 active:scale-[0.97]"
          style={{ borderColor: p.primary + "50", color: p.primary }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}>
          View Full Details ✦
        </motion.button>
      </motion.div>

      <FloatingPetals active />
    </div>
  );
}

// ── Scene: Details ─────────────────────────────────────────────────────────
function DetailsScene({ invitation, onNext }: { invitation: Invitation; onNext: () => void }) {
  const p = invitation.colorPalette as { primary: string; secondary: string; accent: string; background: string; text: string };
  const eventDate = new Date(invitation.eventDate);

  const countdown = () => {
    const diff = eventDate.getTime() - Date.now();
    if (diff <= 0) return null;
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    return { d, h };
  };
  const cd = countdown();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16"
      style={{ background: `linear-gradient(180deg, #0a0e1a 0%, ${p.background} 100%)` }}>

      <motion.div className="w-full max-w-sm space-y-4"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>

        <motion.p className="text-center text-[10px] uppercase tracking-[0.4em]"
          style={{ color: p.primary }} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          ✦ Event Details ✦
        </motion.p>

        {/* Venue */}
        {[
          { label: "Venue",    value: invitation.venue       },
          { label: "Address",  value: invitation.venueAddress },
          { label: "Date",     value: eventDate.toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "long", year: "numeric" }) },
          { label: "Time",     value: eventDate.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) },
        ].filter(row => row.value).map((row, i) => (
          <motion.div key={row.label} className="border px-5 py-4"
            style={{ borderColor: p.primary + "25", background: p.background + "aa" }}
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 * i + 0.2 }}>
            <p className="text-[10px] uppercase tracking-[0.2em] mb-1" style={{ color: p.primary, opacity: 0.6 }}>{row.label}</p>
            <p className="font-cormorant text-lg" style={{ color: p.text }}>{row.value}</p>
          </motion.div>
        ))}

        {/* Countdown */}
        {cd && (
          <motion.div className="border px-5 py-5 text-center"
            style={{ borderColor: p.primary + "35", background: p.primary + "08" }}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
            <p className="text-[10px] uppercase tracking-[0.3em] mb-4" style={{ color: p.primary, opacity: 0.6 }}>Counting Down</p>
            <div className="flex justify-center gap-4">
              {[{ v: cd.d, l: "Days" }, { v: cd.h, l: "Hours" }].map(({ v, l }) => (
                <div key={l} className="text-center">
                  <p className="font-cormorant text-4xl font-light" style={{ color: p.primary }}>{String(v).padStart(2, "0")}</p>
                  <p className="text-[9px] uppercase tracking-[0.2em] mt-1" style={{ color: p.text, opacity: 0.4 }}>{l}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        <motion.button onClick={onNext}
          className="w-full py-4 text-xs uppercase tracking-[0.25em] transition-all hover:opacity-80 active:scale-[0.98]"
          style={{ background: p.primary, color: "#0D0B08" }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
          Leave a Wish ♡
        </motion.button>
      </motion.div>
    </div>
  );
}

// ── Scene: Message ─────────────────────────────────────────────────────────
function MessageScene({ invitation }: { invitation: Invitation }) {
  const p = invitation.colorPalette as { primary: string; secondary: string; accent: string; background: string; text: string };
  const [msg, setMsg] = useState("");
  const [sent, setSent] = useState(false);

  const send = async () => {
    if (!msg.trim()) return;
    // Post RSVP/message
    await fetch(`/api/rsvp/${invitation.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ guestName: "Guest", message: msg, status: "attending" }),
    }).catch(() => {});
    setSent(true);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16"
      style={{ background: `radial-gradient(ellipse at 50% 50%, ${p.background} 0%, #050402 100%)` }}>

      <motion.div className="w-full max-w-sm text-center"
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>

        <div className="text-4xl mb-4">💌</div>
        <p className="font-cormorant text-2xl font-light mb-2" style={{ color: p.text }}>Leave a Wish</p>
        <p className="text-xs mb-8" style={{ color: p.text, opacity: 0.45 }}>Your words will mean the world to us ♡</p>

        <AnimatePresence mode="wait">
          {!sent ? (
            <motion.div key="form" exit={{ opacity: 0, y: -10 }}>
              <textarea value={msg} onChange={(e) => setMsg(e.target.value)} rows={5}
                placeholder="Write your beautiful wishes here…"
                className="w-full p-4 text-sm leading-relaxed outline-none resize-none rounded-sm"
                style={{
                  background: p.primary + "08",
                  border: `1px solid ${p.primary}30`,
                  color: p.text,
                  caretColor: p.primary,
                }} />
              <button onClick={send}
                className="mt-4 w-full py-4 text-xs uppercase tracking-[0.25em] transition-all hover:opacity-80 active:scale-[0.98]"
                style={{ background: p.primary, color: "#0D0B08" }}>
                Send with Love ♡
              </button>
            </motion.div>
          ) : (
            <motion.div key="thanks" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="py-12">
              <div className="text-5xl mb-4">🕊️</div>
              <p className="font-cormorant text-2xl italic mb-2" style={{ color: p.primary }}>
                Thank you, your love has been received ✦
              </p>
              <p className="text-xs" style={{ color: p.text, opacity: 0.4 }}>We can&apos;t wait to celebrate with you.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <FloatingPetals active />
    </div>
  );
}

// ── Main Template ──────────────────────────────────────────────────────────
export function TreasureBoxTemplate({ invitation, guestName, songUrl, songLabel }: Props) {
  const [scene, setScene] = useState<Scene>("box");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Try to use musicUrl from invitation if no explicit songUrl
  const audioSrc = songUrl || invitation.musicUrl;

  const startMusic = () => {
    if (audioRef.current) {
      audioRef.current.volume = 0.4;
      audioRef.current.loop   = true;
      audioRef.current.play().catch(() => {});
    }
  };

  const handleBoxOpen = () => {
    startMusic();
    setScene("pigeon");
  };

  const p = invitation.colorPalette as { primary: string; background: string };

  return (
    <div className="relative bg-[#0a0e1a] text-white overflow-hidden"
      style={{ minHeight: "100dvh" }}>

      {/* Background stars */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {Array.from({ length: 60 }).map((_, i) => (
          <motion.div key={i}
            className="absolute w-px h-px rounded-full bg-white"
            style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
            animate={{ opacity: [0, 0.8, 0] }}
            transition={{ duration: 2 + Math.random() * 3, delay: Math.random() * 5, repeat: Infinity }} />
        ))}
      </div>

      {/* Music */}
      {audioSrc && (
        <>
          <audio ref={audioRef} src={audioSrc} preload="none" />
          <MusicButton audioRef={audioRef} songLabel={songLabel || invitation.musicLabel || undefined} />
        </>
      )}

      {/* Scenes */}
      <AnimatePresence mode="wait">
        {scene === "box" && (
          <motion.div key="box" className="relative z-10"
            exit={{ opacity: 0, scale: 1.1 }} transition={{ duration: 0.5 }}>
            <BoxScene onOpen={handleBoxOpen} />
          </motion.div>
        )}
        {scene === "pigeon" && (
          <motion.div key="pigeon" className="relative z-10"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }}>
            <PigeonScene onDone={() => setScene("reveal")} />
          </motion.div>
        )}
        {scene === "reveal" && (
          <motion.div key="reveal" className="relative z-10"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.6 }}>
            <RevealScene invitation={invitation} guestName={guestName} onNext={() => setScene("details")} />
          </motion.div>
        )}
        {scene === "details" && (
          <motion.div key="details" className="relative z-10"
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }}>
            <DetailsScene invitation={invitation} onNext={() => setScene("message")} />
          </motion.div>
        )}
        {scene === "message" && (
          <motion.div key="message" className="relative z-10"
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <MessageScene invitation={invitation} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
