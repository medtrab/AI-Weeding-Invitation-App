"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ── Types ─────────────────────────────────────────────────────────────────
interface Palette { bg: string; surface: string; primary: string; accent: string; text: string; textMuted: string; }
interface DesignSpec {
  theme: { name: string; palette: Palette; fontHeading: string; fontBody: string; direction: string; patternStyle: string; };
  envelope: { sealSymbol: string; sealColor: string; openingEffect: string; };
  sections: Array<Record<string, string>>;
  decorations: { floatingElements: string[]; borderStyle: string; dividerStyle: string; };
  music: { genre: string; mood: string; };
  openingEffect: { particleEmoji: string; particleColors: string[]; particleCount: number; };
}

interface Props {
  spec: DesignSpec; coupleName: string; eventDate: string; venue: string;
  guestName?: string; photos?: string[]; isPreview?: boolean;
}

// ── Arabesque SVG border ──────────────────────────────────────────────────
function ArabesqueBorder({ color }: { color: string }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.07]">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="arab" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
            <path d="M40 0 L80 20 L80 60 L40 80 L0 60 L0 20 Z" fill="none" stroke={color} strokeWidth="0.5"/>
            <circle cx="40" cy="40" r="15" fill="none" stroke={color} strokeWidth="0.4"/>
            <path d="M40 10 L55 25 L55 55 L40 70 L25 55 L25 25 Z" fill="none" stroke={color} strokeWidth="0.3"/>
            <circle cx="40" cy="40" r="4" fill={color} opacity="0.6"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#arab)"/>
      </svg>
    </div>
  );
}

// ── Floating jasmine / petals ─────────────────────────────────────────────
function FloatingParticles({ emoji, colors, count = 25, active }: { emoji: string; colors: string[]; count?: number; active: boolean; }) {
  if (!active) return null;
  return (
    <div className="fixed inset-0 pointer-events-none z-[95] overflow-hidden">
      {Array.from({ length: count }).map((_, i) => (
        <motion.span key={i}
          className="absolute select-none"
          style={{ left: `${(i * 2.6 + 5) % 95}%`, top: "-50px", color: colors[i % colors.length], fontSize: `${1 + (i % 3) * 0.5}rem` }}
          initial={{ y: 0, opacity: 1, rotate: 0 }}
          animate={{ y: "115vh", opacity: [1, 0.8, 0.3, 0], rotate: (i % 2 === 0 ? 1 : -1) * 360, x: [(i % 3 - 1) * 40] }}
          transition={{ duration: 4 + (i % 5), delay: i * 0.1, ease: "easeIn" }}>
          {emoji}
        </motion.span>
      ))}
    </div>
  );
}

// ── Wax seal pulse animation ──────────────────────────────────────────────
function WaxSeal({ symbol, color, bg }: { symbol: string; color: string; bg: string }) {
  return (
    <motion.div className="relative flex items-center justify-center"
      style={{ width: 80, height: 80, borderRadius: "50%", background: `radial-gradient(circle at 35% 35%, ${color}, ${bg})`, boxShadow: `0 0 30px ${color}60, 0 6px 20px rgba(0,0,0,0.4)` }}
      animate={{ scale: [1, 1.05, 1], boxShadow: [`0 0 20px ${color}40`, `0 0 40px ${color}70`, `0 0 20px ${color}40`] }}
      transition={{ duration: 2.5, repeat: Infinity }}>
      {/* Decorative ring */}
      <div className="absolute inset-1 rounded-full opacity-30" style={{ border: `1px solid ${bg}` }} />
      <div className="absolute inset-3 rounded-full opacity-20" style={{ border: `1px dashed ${bg}` }} />
      <span className="relative z-10 text-3xl" style={{ color: bg }}>{symbol}</span>
    </motion.div>
  );
}

// ── Ornamental divider ────────────────────────────────────────────────────
function Ornament({ color, style = "ornate" }: { color: string; style?: string }) {
  return (
    <div className="flex items-center justify-center gap-3 py-4 px-8">
      <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, transparent, ${color}50)` }} />
      <span style={{ color, opacity: 0.7, fontSize: "1.1rem", letterSpacing: "0.5rem" }}>
        {style === "floral" ? "✿ ❋ ✿" : "✦ ◆ ✦"}
      </span>
      <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, ${color}50, transparent)` }} />
    </div>
  );
}

// ── Envelope screen ───────────────────────────────────────────────────────
function EnvelopeScreen({ spec, coupleName, guestName, photos, onOpen }: {
  spec: DesignSpec; coupleName: string; guestName?: string; photos?: string[]; onOpen: () => void;
}) {
  const [phase, setPhase] = useState<"idle"|"opening"|"done">("idle");
  const p = spec.theme.palette;
  const seal = spec.envelope?.sealSymbol || "✦";
  const bgPhoto = photos?.[0];

  const handleOpen = () => {
    if (phase !== "idle") return;
    setPhase("opening");
    setTimeout(() => { setPhase("done"); setTimeout(onOpen, 800); }, 2000);
  };

  return (
    <motion.div className="fixed inset-0 z-[100] flex flex-col items-center justify-center px-4 overflow-hidden"
      exit={{ opacity: 0 }} transition={{ duration: 1.2 }}>

      {/* Background — Sidi Bou Said photo or rich gradient */}
      {bgPhoto ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={bgPhoto} alt="" className="absolute inset-0 w-full h-full object-cover" style={{ filter: "brightness(0.35) saturate(1.2)" }} />
          <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${p.bg}cc 0%, ${p.surface}99 100%)` }} />
        </>
      ) : (
        <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 30% 40%, ${p.surface} 0%, ${p.bg} 65%)` }} />
      )}

      {/* Arabesque background pattern */}
      <ArabesqueBorder color={p.primary} />

      {/* Ambient particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.span key={i} className="absolute text-sm"
            style={{ left: `${(i * 7) % 100}%`, top: `${(i * 13) % 100}%`, color: p.primary, opacity: 0.15, fontSize: `${0.6 + (i%3) * 0.3}rem` }}
            animate={{ opacity: [0.05, 0.25, 0.05], y: [-10, -30, -10] }}
            transition={{ duration: 4 + i % 3, delay: i * 0.6, repeat: Infinity }}>
            {spec.openingEffect?.particleEmoji || "✿"}
          </motion.span>
        ))}
      </div>

      {/* Guest greeting */}
      {guestName && (
        <motion.div className="relative z-10 text-center mb-8"
          initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <p className="text-xs uppercase tracking-[0.4em] mb-2" style={{ color: p.primary, opacity: 0.7 }}>
            A personal invitation for
          </p>
          <p style={{ fontFamily: `'${spec.theme.fontHeading}', serif`, fontSize: "1.8rem", fontWeight: 300, color: p.text }}>
            {guestName}
          </p>
        </motion.div>
      )}

      {/* THE ENVELOPE */}
      <motion.div className="relative z-10 cursor-pointer" style={{ width: 300, height: 200 }}
        onClick={handleOpen} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>

        {/* Envelope body */}
        <div className="absolute inset-0 rounded overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${p.surface}ee, ${p.bg}ee)`, border: `1px solid ${p.primary}50`, boxShadow: `0 20px 60px rgba(0,0,0,0.5), 0 0 40px ${p.primary}15` }}>
          {/* Arabesque lining */}
          <div className="absolute inset-0 opacity-10">
            <svg width="100%" height="100%" viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="env-arab" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M20 0 L40 10 L40 30 L20 40 L0 30 L0 10 Z" fill="none" stroke={p.primary} strokeWidth="0.5"/>
                  <circle cx="20" cy="20" r="6" fill="none" stroke={p.primary} strokeWidth="0.3"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill={`url(#env-arab)`}/>
              {/* Fold lines */}
              <path d="M0 200 L150 115 L300 200 Z" fill={p.primary} opacity="0.06"/>
              <line x1="0" y1="0" x2="150" y2="115" stroke={p.primary} strokeWidth="0.6" opacity="0.2"/>
              <line x1="300" y1="0" x2="150" y2="115" stroke={p.primary} strokeWidth="0.6" opacity="0.2"/>
              <line x1="0" y1="200" x2="150" y2="115" stroke={p.primary} strokeWidth="0.6" opacity="0.2"/>
              <line x1="300" y1="200" x2="150" y2="115" stroke={p.primary} strokeWidth="0.6" opacity="0.2"/>
              {/* Gold border */}
              <rect x="4" y="4" width="292" height="192" fill="none" stroke={p.primary} strokeWidth="0.8" opacity="0.3"/>
              <rect x="8" y="8" width="284" height="184" fill="none" stroke={p.primary} strokeWidth="0.3" opacity="0.2"/>
            </svg>
          </div>
        </div>

        {/* Wax seal */}
        <div className="absolute inset-0 flex items-center justify-center">
          <WaxSeal symbol={seal} color={p.primary} bg={p.bg} />
        </div>

        {/* Flap — 3D fold open */}
        <motion.div className="absolute top-0 left-0 right-0 origin-top" style={{ height: 100 }}
          animate={phase === "opening" ? { rotateX: -180, opacity: [1, 1, 0] } : { rotateX: 0 }}
          transition={{ duration: 1.4, ease: "easeInOut" }}>
          <svg viewBox="0 0 300 100" width="300" height="100">
            <defs>
              <pattern id="flap-arab" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
                <path d="M15 0 L30 8 L30 22 L15 30 L0 22 L0 8 Z" fill="none" stroke={p.primary} strokeWidth="0.4" opacity="0.4"/>
              </pattern>
            </defs>
            <path d="M0 0 L150 95 L300 0 Z" fill={p.surface} stroke={p.primary} strokeWidth="1" opacity="0.95"/>
            <path d="M0 0 L150 95 L300 0 Z" fill="url(#flap-arab)" opacity="0.2"/>
            <circle cx="150" cy="90" r="6" fill={p.primary} opacity="0.35"/>
            {/* Corner ornaments */}
            <circle cx="8" cy="8" r="3" fill={p.primary} opacity="0.4"/>
            <circle cx="292" cy="8" r="3" fill={p.primary} opacity="0.4"/>
          </svg>
        </motion.div>

        {/* Letter rising */}
        <AnimatePresence>
          {phase === "opening" && (
            <motion.div className="absolute left-3 right-3 bottom-3 rounded-sm flex items-center justify-center overflow-hidden"
              style={{ background: "linear-gradient(145deg, #FAF7F0, #F0E8D8)", border: `1px solid ${p.primary}25`, height: 140 }}
              initial={{ y: 0 }} animate={{ y: -60 }} transition={{ duration: 1.1, delay: 0.6, ease: "easeOut" }}>
              <div className="text-center px-6">
                <p style={{ fontFamily: `'${spec.theme.fontHeading}', serif`, fontSize: "1.2rem", color: p.bg, opacity: 0.9, fontWeight: 400 }}>
                  {coupleName}
                </p>
                <div className="w-12 h-px mx-auto my-2" style={{ background: p.primary, opacity: 0.5 }} />
                <p style={{ fontSize: "0.6rem", color: p.bg, opacity: 0.5, letterSpacing: "0.3em", textTransform: "uppercase" }}>
                  You are cordially invited
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* CTA */}
      <motion.div className="relative z-10 mt-8 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
        {phase === "opening" ? (
          <p className="text-xs uppercase tracking-[0.3em]" style={{ color: p.primary, opacity: 0.6 }}>Opening…</p>
        ) : (
          <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }}>
            <p className="text-xs uppercase tracking-[0.3em] mb-3" style={{ color: p.primary }}>
              {phase === "idle" ? "Tap to open your invitation" : ""}
            </p>
            <div className="flex justify-center gap-1.5">
              {[0,1,2].map(i => (
                <motion.div key={i} className="w-1 h-1 rounded-full" style={{ background: p.primary }}
                  animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.2, 0.8] }}
                  transition={{ duration: 1.2, delay: i * 0.2, repeat: Infinity }} />
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}

// ── Hourglass countdown ───────────────────────────────────────────────────
function Hourglass({ value, label, color, fontHeading }: { value: number; label: string; color: string; fontHeading: string }) {
  return (
    <motion.div className="flex flex-col items-center"
      initial={{ opacity: 0, scale: 0.7 }} whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }} transition={{ type: "spring", stiffness: 200 }}>
      <div className="relative">
        <svg width="80" height="100" viewBox="0 0 80 100">
          {/* Hourglass outer */}
          <path d="M5 5 L75 5 L40 50 L75 95 L5 95 L40 50 Z" fill="none" stroke={color} strokeWidth="1.5" opacity="0.4"/>
          {/* Top sand */}
          <motion.path d={`M12 12 L68 12 L40 46 Z`} fill={color} opacity="0.5"
            animate={{ opacity: [0.4, 0.7, 0.4] }} transition={{ duration: 1.5, repeat: Infinity }}/>
          {/* Bottom sand - fills based on nothing, just decorative */}
          <path d="M40 54 L65 88 L15 88 Z" fill={color} opacity="0.2"/>
          {/* Sand flow */}
          <motion.line x1="40" y1="48" x2="40" y2="54" stroke={color} strokeWidth="1.5" opacity="0.8"
            animate={{ opacity: [0, 1, 0] }} transition={{ duration: 0.5, repeat: Infinity }}/>
          {/* Corner gems */}
          <circle cx="5" cy="5" r="3" fill={color} opacity="0.6"/>
          <circle cx="75" cy="5" r="3" fill={color} opacity="0.6"/>
          <circle cx="5" cy="95" r="3" fill={color} opacity="0.6"/>
          <circle cx="75" cy="95" r="3" fill={color} opacity="0.6"/>
          {/* Number */}
          <text x="40" y="82" textAnchor="middle"
            style={{ fontFamily: `'${fontHeading}', serif`, fontSize: "22px", fill: color, fontWeight: 400 }}>
            {String(value).padStart(2, "0")}
          </text>
        </svg>
      </div>
      <p className="text-[10px] uppercase tracking-[0.25em] mt-1" style={{ color, opacity: 0.55 }}>{label}</p>
    </motion.div>
  );
}

// ── Photo mosaic ──────────────────────────────────────────────────────────
function PhotoMosaic({ photos, palette }: { photos: string[]; palette: Palette }) {
  if (!photos.length) return null;

  if (photos.length === 1) return (
    <motion.div className="w-full overflow-hidden" style={{ height: "60vw", maxHeight: 400, border: `1px solid ${palette.primary}25` }}
      initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={photos[0]} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
    </motion.div>
  );

  if (photos.length === 2) return (
    <div className="grid grid-cols-2 gap-1">
      {photos.map((src, i) => (
        <motion.div key={i} className="overflow-hidden aspect-[3/4]" style={{ border: `1px solid ${palette.primary}20` }}
          initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
        </motion.div>
      ))}
    </div>
  );

  // 3-5 photos — Polaroid-style mosaic
  return (
    <div className="grid grid-cols-2 gap-1">
      {photos.slice(0, 2).map((src, i) => (
        <motion.div key={i} className="overflow-hidden aspect-square" style={{ border: `1px solid ${palette.primary}20` }}
          initial={{ opacity: 0, rotate: i === 0 ? -2 : 2 }} whileInView={{ opacity: 1, rotate: 0 }}
          viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt="" className="w-full h-full object-cover" />
        </motion.div>
      ))}
      {photos[2] && (
        <motion.div className="col-span-2 overflow-hidden" style={{ height: 200, border: `1px solid ${palette.primary}20` }}
          initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photos[2]} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
        </motion.div>
      )}
      {photos.slice(3, 5).map((src, i) => (
        <motion.div key={i + 3} className="overflow-hidden aspect-square" style={{ border: `1px solid ${palette.primary}20` }}
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 + i * 0.1 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt="" className="w-full h-full object-cover" />
        </motion.div>
      ))}
    </div>
  );
}

// ── Message form ──────────────────────────────────────────────────────────
function MessageForm({ section, p, fh }: { section: Record<string, string>; p: Palette; fh: string }) {
  const [name, setName] = useState(""); const [msg, setMsg] = useState(""); const [sent, setSent] = useState(false);
  if (sent) return (
    <motion.div className="text-center py-12" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
      <div className="text-5xl mb-4" style={{ color: p.primary }}>✦</div>
      <p style={{ fontFamily: `'${fh}', serif`, fontSize: "1.6rem", fontWeight: 300, color: p.text }}>
        Thank you, {name}
      </p>
      <p className="text-sm mt-2" style={{ color: p.textMuted ?? p.text, opacity: 0.5 }}>Your message has been received with love ♡</p>
    </motion.div>
  );
  return (
    <div className="space-y-3 max-w-md mx-auto">
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name"
        className="w-full border py-3 px-4 text-sm outline-none bg-transparent"
        style={{ borderColor: `${p.primary}30`, color: p.text }} />
      <textarea value={msg} onChange={e => setMsg(e.target.value)}
        placeholder={section.placeholder || "Leave your beautiful wishes here…"} rows={4}
        className="w-full border py-3 px-4 text-sm outline-none resize-none bg-transparent"
        style={{ borderColor: `${p.primary}30`, color: p.text }} />
      <motion.button onClick={() => { if (name && msg) setSent(true); }}
        className="w-full py-3.5 text-xs uppercase tracking-[0.25em] font-medium transition-all"
        style={{ background: p.primary, color: p.bg }}
        whileHover={{ filter: "brightness(1.1)" }} whileTap={{ scale: 0.98 }}>
        {section.submitLabel || "Send with Love ♥"}
      </motion.button>
    </div>
  );
}

// ── Main SpecRenderer ─────────────────────────────────────────────────────
export function SpecRenderer({ spec, coupleName, eventDate, venue, guestName, photos = [], isPreview = false }: Props) {
  const [opened, setOpened] = useState(isPreview);
  const [burst, setBurst]   = useState(false);
  const p  = spec.theme.palette;
  const fh = spec.theme.fontHeading;
  const fb = spec.theme.fontBody;

  // Load Google Fonts
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    const fonts = [fh, fb].filter(Boolean).map(f => `family=${encodeURIComponent(f)}:ital,wght@0,300;0,400;1,400`).join("&");
    link.href = `https://fonts.googleapis.com/css2?${fonts}&display=swap`;
    document.head.appendChild(link);
    return () => { try { document.head.removeChild(link); } catch {} };
  }, [fh, fb]);

  // Countdown
  const [time, setTime] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    const calc = () => {
      const diff = new Date(eventDate).getTime() - Date.now();
      if (diff > 0) setTime({ d: Math.floor(diff/86400000), h: Math.floor((diff%86400000)/3600000), m: Math.floor((diff%3600000)/60000), s: Math.floor((diff%60000)/1000) });
    };
    calc(); const iv = setInterval(calc, 1000); return () => clearInterval(iv);
  }, [eventDate]);

  const handleOpen = () => { setBurst(true); setTimeout(() => { setBurst(false); setOpened(true); }, 3500); };

  const sectionBg = (i: number) => i % 2 === 0 ? p.bg : p.surface;

  return (
    <div style={{ background: p.bg, color: p.text, fontFamily: `'${fb}', system-ui, sans-serif`, direction: spec.theme.direction as "ltr"|"rtl", minHeight: "100vh", overflowX: "hidden" }}>

      {/* Envelope */}
      <AnimatePresence>
        {!opened && !isPreview && (
          <EnvelopeScreen spec={spec} coupleName={coupleName} guestName={guestName} photos={photos} onOpen={handleOpen} />
        )}
      </AnimatePresence>

      {/* Burst */}
      <FloatingParticles
        emoji={spec.openingEffect?.particleEmoji || "✿"}
        colors={spec.openingEffect?.particleColors || [p.primary]}
        count={spec.openingEffect?.particleCount || 30}
        active={burst}
      />

      {/* Invitation content */}
      <AnimatePresence>
        {(opened || isPreview) && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2 }}>

            {/* ── HERO ─────────────────────────────── */}
            <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 py-20 overflow-hidden"
              style={{ background: `radial-gradient(ellipse at 40% 50%, ${p.surface} 0%, ${p.bg} 65%)` }}>
              <ArabesqueBorder color={p.primary} />
              {/* Top accent */}
              <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: `linear-gradient(90deg, transparent, ${p.primary}, ${p.accent ?? p.primary}, ${p.primary}, transparent)` }} />

              {/* Photos as background layer if available */}
              {photos.length > 0 && (
                <div className="absolute inset-0 opacity-15 pointer-events-none">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={photos[0]} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, ${p.bg}aa, ${p.bg})` }} />
                </div>
              )}

              {/* Floating particles */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {Array.from({ length: 20 }).map((_, i) => (
                  <motion.span key={i} className="absolute" style={{ left: `${(i * 5.3) % 100}%`, color: p.primary, fontSize: "0.8rem", opacity: 0.15 }}
                    animate={{ y: [0, -600], opacity: [0, 0.4, 0] }}
                    transition={{ duration: 8 + i % 5, delay: i * 0.5, repeat: Infinity }}>
                    {spec.openingEffect?.particleEmoji || "✿"}
                  </motion.span>
                ))}
              </div>

              <div className="relative z-10 max-w-2xl mx-auto">
                <motion.p className="text-[11px] uppercase tracking-[0.45em] mb-8"
                  style={{ color: p.primary, opacity: 0.8 }}
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 0.8, y: 0 }} transition={{ duration: 1.2, delay: 0.2 }}>
                  ✦ — You&apos;re Invited — ✦
                </motion.p>

                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, delay: 0.5 }}>
                  <h1 style={{ fontFamily: `'${fh}', Georgia, serif`, fontSize: "clamp(3rem, 9vw, 6rem)", fontWeight: 300, color: p.text, lineHeight: 1.05 }}>
                    {coupleName.includes("&")
                      ? coupleName.split("&").map((n, i, arr) => (
                          <span key={i}>
                            {n.trim()}
                            {i < arr.length - 1 && <em style={{ display: "block", color: p.primary, fontSize: "0.65em" }}>&</em>}
                          </span>
                        ))
                      : coupleName}
                  </h1>
                </motion.div>

                <motion.div className="flex items-center justify-center gap-3 my-8"
                  initial={{ opacity: 0, scaleX: 0 }} animate={{ opacity: 1, scaleX: 1 }} transition={{ duration: 1.2, delay: 0.9 }}>
                  <div className="h-px w-24" style={{ background: `linear-gradient(90deg, transparent, ${p.primary})`, opacity: 0.5 }} />
                  <span style={{ color: p.primary, opacity: 0.7 }}>✦ ◆ ✦</span>
                  <div className="h-px w-24" style={{ background: `linear-gradient(90deg, ${p.primary}, transparent)`, opacity: 0.5 }} />
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 1.1 }}>
                  <p className="text-sm uppercase tracking-[0.3em] mb-1" style={{ color: p.text, opacity: 0.6 }}>
                    {new Date(eventDate).toLocaleDateString("en-GB", { weekday:"long", day:"numeric", month:"long", year:"numeric" })}
                  </p>
                  <p style={{ fontFamily: `'${fh}', serif`, fontSize: "1.1rem", color: p.primary, opacity: 0.85 }}>
                    {venue}
                  </p>
                </motion.div>

                {/* Story quote */}
                {spec.sections?.find(s => s.type === "hero")?.quote && (
                  <motion.div className="mt-10 px-4 py-6 border-l-2 max-w-lg mx-auto"
                    style={{ borderColor: `${p.primary}40`, background: `${p.primary}08` }}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}>
                    <p className="text-sm leading-relaxed italic text-left" style={{ color: p.text, opacity: 0.65, fontFamily: `'${fh}', serif` }}>
                      &ldquo;{spec.sections.find(s => s.type === "hero")?.quote}&rdquo;
                    </p>
                  </motion.div>
                )}
              </div>

              {/* Scroll indicator */}
              <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2"
                animate={{ y: [0, 10, 0], opacity: [0.4, 0.8, 0.4] }} transition={{ duration: 2.5, repeat: Infinity }}>
                <div className="flex flex-col items-center gap-1" style={{ color: p.primary }}>
                  <div className="w-px h-8" style={{ background: `linear-gradient(180deg, transparent, ${p.primary})` }} />
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: p.primary }} />
                </div>
              </motion.div>

              <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: `linear-gradient(90deg, transparent, ${p.primary}50, transparent)` }} />
            </section>

            {/* ── PHOTOS MOSAIC ────────────────────── */}
            {photos.length > 0 && (
              <section className="px-4 py-12" style={{ background: p.surface, position: "relative" }}>
                <ArabesqueBorder color={p.primary} />
                <div className="max-w-sm mx-auto relative z-10">
                  <Ornament color={p.primary} />
                  <PhotoMosaic photos={photos} palette={p} />
                  <Ornament color={p.primary} />
                </div>
              </section>
            )}

            {/* ── DYNAMIC SECTIONS ─────────────────── */}
            {spec.sections?.map((section, i) => {
              if (section.type === "hero") return null; // Already rendered above
              return (
                <motion.section key={i} className="relative px-6 sm:px-12 py-16 overflow-hidden"
                  style={{ background: sectionBg(i) }}
                  initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ duration: 0.9, delay: 0.05 * i }}>
                  <ArabesqueBorder color={p.primary} />
                  <div className="relative z-10">

                    {/* Section heading */}
                    {section.heading && (
                      <div className="text-center mb-8">
                        <h2 style={{ fontFamily: `'${fh}', serif`, fontSize: "clamp(1.6rem, 4vw, 2.8rem)", fontWeight: 300, color: p.text, lineHeight: 1.2 }}>
                          {String(section.heading || "").replace(/\{\{GUEST_NAME\}\}/g, guestName || "Dear Guest")}
                        </h2>
                        <Ornament color={p.primary} style={spec.decorations?.dividerStyle} />
                      </div>
                    )}

                    {/* COUNTDOWN */}
                    {section.type === "countdown" && (
                      <div>
                        <div className="flex justify-center items-end gap-4 sm:gap-8 flex-wrap">
                          <Hourglass value={time.d} label="Days"    color={p.primary} fontHeading={fh} />
                          <Hourglass value={time.h} label="Hours"   color={p.primary} fontHeading={fh} />
                          <Hourglass value={time.m} label="Minutes" color={p.primary} fontHeading={fh} />
                          <Hourglass value={time.s} label="Seconds" color={p.primary} fontHeading={fh} />
                        </div>
                      </div>
                    )}

                    {/* WELCOME */}
                    {section.type === "welcome" && section.message && (
                      <div className="max-w-xl mx-auto">
                        <div className="p-8 border text-center" style={{ borderColor: `${p.primary}20`, background: `${p.primary}06` }}>
                          <p style={{ fontFamily: `'${fh}', serif`, fontSize: "1.15rem", color: p.text, opacity: 0.8, lineHeight: 2 }}>
                            {section.message.replace(/\{\{GUEST_NAME\}\}/g, guestName || "Dear Guest")}
                          </p>
                          <div className="mt-6" style={{ color: p.primary, fontSize: "1.5rem", opacity: 0.5 }}>♥</div>
                        </div>
                      </div>
                    )}

                    {/* GUEST PERSONALIZATION */}
                    {section.type === "guest" && (
                      <div className="max-w-xl mx-auto text-center space-y-6">
                        <motion.div className="px-6 py-8 border relative overflow-hidden"
                          style={{ borderColor: `${p.primary}30`, background: `linear-gradient(135deg, ${p.primary}10, ${p.bg}80)` }}
                          initial={{ scale: 0.95 }} whileInView={{ scale: 1 }} viewport={{ once: true }}>
                          <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: `linear-gradient(90deg, transparent, ${p.primary}, transparent)` }} />
                          <p className="text-xs uppercase tracking-[0.35em] mb-3" style={{ color: p.primary, opacity: 0.6 }}>Dear</p>
                          <p style={{ fontFamily: `'${fh}', serif`, fontSize: "2.5rem", fontWeight: 300, color: p.primary }}>
                            {guestName || "Valued Guest"}
                          </p>
                          <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: `linear-gradient(90deg, transparent, ${p.primary}, transparent)` }} />
                        </motion.div>
                        {section.message && (
                          <p className="text-base leading-relaxed" style={{ color: p.text, opacity: 0.7, lineHeight: 1.9 }}>
                            {section.message.replace(/\{\{GUEST_NAME\}\}/g, guestName || "Dear Guest")}
                          </p>
                        )}
                      </div>
                    )}

                    {/* VENUE */}
                    {section.type === "venue" && (
                      <div className="max-w-xl mx-auto text-center space-y-5">
                        {/* Lantern icon */}
                        <div className="text-4xl text-center mb-2" style={{ color: p.primary, opacity: 0.4 }}>🏮</div>
                        <p style={{ fontFamily: `'${fh}', serif`, fontSize: "2rem", fontWeight: 300, color: p.primary }}>
                          {section.venueName ?? venue}
                        </p>
                        {section.venueDescription && (
                          <p className="text-sm leading-relaxed" style={{ color: p.text, opacity: 0.6, lineHeight: 1.8 }}>
                            {String(section.venueDescription || "").replace(/\{\{GUEST_NAME\}\}/g, guestName || "Dear Guest")}
                          </p>
                        )}
                        <div className="flex flex-wrap justify-center gap-3 mt-4">
                          {section.time && (
                            <div className="px-5 py-3 border" style={{ borderColor: `${p.primary}30`, background: `${p.primary}08` }}>
                              <p className="text-[10px] uppercase tracking-[0.2em] mb-1" style={{ color: p.primary, opacity: 0.7 }}>Time</p>
                              <p className="text-sm" style={{ color: p.text }}>{section.time}</p>
                            </div>
                          )}
                          {section.dresscode && (
                            <div className="px-5 py-3 border" style={{ borderColor: `${p.primary}30`, background: `${p.primary}08` }}>
                              <p className="text-[10px] uppercase tracking-[0.2em] mb-1" style={{ color: p.primary, opacity: 0.7 }}>Dress Code</p>
                              <p className="text-sm" style={{ color: p.text }}>{section.dresscode}</p>
                            </div>
                          )}
                        </div>
                        <p className="text-sm uppercase tracking-[0.2em] pt-2" style={{ color: p.text, opacity: 0.4 }}>
                          {new Date(eventDate).toLocaleDateString("en-GB", { weekday:"long", day:"numeric", month:"long", year:"numeric" })}
                        </p>
                      </div>
                    )}

                    {/* MESSAGE */}
                    {section.type === "message" && (
                      <MessageForm section={section} p={p} fh={fh} />
                    )}

                  </div>
                </motion.section>
              );
            })}

            {/* Footer */}
            <footer className="py-10 text-center relative overflow-hidden" style={{ background: p.bg, borderTop: `1px solid ${p.primary}20` }}>
              <ArabesqueBorder color={p.primary} />
              <p style={{ fontFamily: `'${fh}', serif`, fontSize: "1.3rem", color: p.primary, opacity: 0.6 }}>{coupleName}</p>
              <p className="text-[10px] uppercase tracking-[0.35em] mt-1" style={{ color: p.text, opacity: 0.25 }}>Made with love · Invité</p>
            </footer>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
