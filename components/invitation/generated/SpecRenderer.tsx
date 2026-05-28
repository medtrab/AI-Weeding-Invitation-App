"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ── Types ─────────────────────────────────────────────────────────────────
interface Palette { bg: string; surface: string; primary: string; accent: string; text: string; textMuted: string; }
interface DesignSpec {
  theme: { name: string; palette: Palette; fontHeading: string; fontBody: string; direction: string; patternStyle: string; };
  envelope: { sealSymbol: string; sealColor: string; liningPattern: string; openingEffect: string; };
  sections: Array<{ type: string; layout?: string; heading?: string; subheading?: string; quote?: string; animation?: string; style?: string; label?: string; datetime?: string; message?: string; venueName?: string; venueDescription?: string; time?: string; dresscode?: string; placeholder?: string; submitLabel?: string; }>;
  decorations: { floatingElements: string[]; borderStyle: string; dividerStyle: string; };
  music: { genre: string; mood: string; autoplay: boolean; };
  openingEffect: { type: string; particleType: string; particleCount: number; particleEmoji: string; particleColors: string[]; };
}

interface Props {
  spec: DesignSpec;
  coupleName: string;
  eventDate: string;
  venue: string;
  guestName?: string;
  photos?: string[];
  isPreview?: boolean;
}

// ── Floating particles after envelope opens ──────────────────────────────
function ParticleBurst({ spec, active }: { spec: DesignSpec; active: boolean }) {
  const p = spec.theme.palette;
  const emoji = spec.openingEffect?.particleEmoji || "✿";
  const colors = spec.openingEffect?.particleColors || [p.primary, p.accent];

  if (!active) return null;
  return (
    <div className="fixed inset-0 pointer-events-none z-[90] overflow-hidden">
      {Array.from({ length: 40 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-lg select-none"
          style={{
            left: `${10 + (i * 2.1) % 80}%`,
            top: "-40px",
            color: colors[i % colors.length],
            fontSize: `${0.8 + (i % 3) * 0.4}rem`,
          }}
          initial={{ y: 0, opacity: 1, rotate: 0 }}
          animate={{ y: "110vh", opacity: [1, 0.8, 0], rotate: 360 * (i % 2 === 0 ? 1 : -1), x: [(i % 2 === 0 ? 30 : -30) * Math.random()] }}
          transition={{ duration: 3 + (i % 4), delay: i * 0.08, ease: "easeIn" }}
        >
          {emoji}
        </motion.div>
      ))}
    </div>
  );
}

// ── Envelope opening screen ───────────────────────────────────────────────
function EnvelopeScreen({ spec, coupleName, guestName, onOpen }: { spec: DesignSpec; coupleName: string; guestName?: string; onOpen: () => void; }) {
  const [phase, setPhase] = useState<"idle" | "opening" | "done">("idle");
  const p = spec.theme.palette;
  const seal = spec.envelope?.sealSymbol || "✦";

  const handleOpen = () => {
    if (phase !== "idle") return;
    setPhase("opening");
    setTimeout(() => { setPhase("done"); setTimeout(onOpen, 600); }, 2000);
  };

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center px-6"
      style={{ background: `radial-gradient(ellipse at center, ${p.surface} 0%, ${p.bg} 100%)` }}
      exit={{ opacity: 0, scale: 1.04 }}
      transition={{ duration: 1 }}
    >
      {/* Ambient floaters */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div key={i} className="absolute text-sm" style={{ left: `${(i * 5.3) % 100}%`, color: p.primary, opacity: 0.15 }}
            animate={{ y: [0, -80], opacity: [0, 0.3, 0] }}
            transition={{ duration: 5 + i % 3, delay: i * 0.5, repeat: Infinity }}>
            {spec.openingEffect?.particleEmoji || "✿"}
          </motion.div>
        ))}
      </div>

      {guestName && (
        <motion.p className="text-xs uppercase tracking-[0.4em] mb-8 text-center"
          style={{ color: p.primary, opacity: 0.75 }}
          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 0.75, y: 0 }} transition={{ delay: 0.4 }}>
          A personal invitation for<br />
          <span className="text-base normal-case tracking-normal" style={{ fontFamily: `'${spec.theme.fontHeading}', serif` }}>
            {guestName}
          </span>
        </motion.p>
      )}

      {/* Envelope SVG */}
      <motion.div className="relative cursor-pointer" style={{ width: 300, height: 200 }}
        onClick={handleOpen} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>

        {/* Body */}
        <div className="absolute inset-0 rounded overflow-hidden"
          style={{ background: `linear-gradient(145deg, ${p.surface}, ${p.bg})`, border: `1px solid ${p.primary}40` }}>
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 300 200" preserveAspectRatio="none">
            <path d="M0 200 L150 120 L300 200 Z" fill={p.primary} opacity="0.08"/>
            <line x1="0" y1="0" x2="150" y2="120" stroke={p.primary} strokeWidth="0.5" opacity="0.25"/>
            <line x1="300" y1="0" x2="150" y2="120" stroke={p.primary} strokeWidth="0.5" opacity="0.25"/>
            <line x1="0" y1="200" x2="150" y2="120" stroke={p.primary} strokeWidth="0.5" opacity="0.25"/>
            <line x1="300" y1="200" x2="150" y2="120" stroke={p.primary} strokeWidth="0.5" opacity="0.25"/>
          </svg>
          {/* Inner border */}
          <div className="absolute inset-2" style={{ border: `0.5px solid ${p.primary}15` }} />
        </div>

        {/* Wax seal */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div className="flex items-center justify-center"
            style={{ width: 64, height: 64, borderRadius: "50%", background: `radial-gradient(circle, ${p.primary}, ${p.accent ?? p.primary})`, boxShadow: `0 4px 24px ${p.primary}50` }}
            animate={phase === "idle" ? { scale: [1, 1.06, 1] } : {}}
            transition={{ duration: 2, repeat: Infinity }}>
            <span className="text-2xl" style={{ color: p.bg }}>{seal}</span>
          </motion.div>
        </div>

        {/* Flap */}
        <motion.div className="absolute top-0 left-0 right-0 origin-top overflow-hidden" style={{ height: 100 }}
          animate={phase === "opening" ? { rotateX: -180, opacity: [1, 1, 0] } : phase === "idle" ? { rotateX: 0 } : { rotateX: -180, opacity: 0 }}
          transition={{ duration: 1.4, ease: "easeInOut" }}>
          <svg viewBox="0 0 300 100" width="300" height="100">
            <path d="M0 0 L150 95 L300 0 Z" fill={p.surface} stroke={p.primary} strokeWidth="0.8" opacity="0.97"/>
            <circle cx="150" cy="90" r="5" fill={p.primary} opacity="0.3"/>
          </svg>
        </motion.div>

        {/* Letter reveal */}
        <AnimatePresence>
          {phase === "opening" && (
            <motion.div className="absolute left-4 right-4 bottom-3 h-36 flex items-center justify-center rounded-sm"
              style={{ background: "linear-gradient(145deg, #FAF7F2, #F5EDD8)", border: `1px solid ${p.primary}25` }}
              initial={{ y: 0 }} animate={{ y: -55 }} transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}>
              <div className="text-center px-4">
                <p style={{ fontFamily: `'${spec.theme.fontHeading}', serif`, fontSize: "1.1rem", color: p.surface, opacity: 0.9 }}>
                  {coupleName}
                </p>
                <div className="w-10 h-px mx-auto my-1.5" style={{ background: p.primary, opacity: 0.5 }} />
                <p style={{ fontSize: "0.6rem", color: p.surface, opacity: 0.5, letterSpacing: "0.25em", textTransform: "uppercase" }}>
                  You are invited
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <motion.div className="mt-8 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
        {phase === "opening" ? (
          <p className="text-xs uppercase tracking-[0.3em]" style={{ color: p.primary, opacity: 0.6 }}>Opening…</p>
        ) : (
          <motion.p className="text-xs uppercase tracking-[0.3em]" style={{ color: p.primary }}
            animate={{ opacity: [0.4, 0.9, 0.4] }} transition={{ duration: 2, repeat: Infinity }}>
            Tap to open
          </motion.p>
        )}
      </motion.div>
    </motion.div>
  );
}

// ── SVG decorative divider ────────────────────────────────────────────────
function Divider({ color, style }: { color: string; style: string }) {
  return (
    <div className="flex items-center justify-center gap-3 py-2 px-8">
      <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, transparent, ${color}40)` }} />
      <span style={{ color, opacity: 0.6, fontSize: "1rem" }}>
        {style === "floral" ? "✿ ❋ ✿" : style === "ornate" ? "✦ ◆ ✦" : style === "calligraphy" ? "— ✦ —" : "✦"}
      </span>
      <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, ${color}40, transparent)` }} />
    </div>
  );
}

// ── Sandclock countdown ───────────────────────────────────────────────────
function SandclockCountdown({ datetime, spec }: { datetime: string; spec: DesignSpec }) {
  const p = spec.theme.palette;
  const [time, setTime] = useState({ d: 0, h: 0, m: 0, s: 0 });

  useEffect(() => {
    const calc = () => {
      const diff = new Date(datetime).getTime() - Date.now();
      if (diff <= 0) return;
      setTime({ d: Math.floor(diff/86400000), h: Math.floor((diff%86400000)/3600000), m: Math.floor((diff%3600000)/60000), s: Math.floor((diff%60000)/1000) });
    };
    calc();
    const iv = setInterval(calc, 1000);
    return () => clearInterval(iv);
  }, [datetime]);

  const units = [{ v: time.d, l: "Days" }, { v: time.h, l: "Hours" }, { v: time.m, l: "Min" }, { v: time.s, l: "Sec" }];

  return (
    <div className="flex justify-center items-end gap-3 sm:gap-6 flex-wrap">
      {units.map(({ v, l }, i) => (
        <motion.div key={l} className="flex flex-col items-center"
          initial={{ opacity: 0, scale: 0.7 }} whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }} transition={{ delay: i * 0.1, type: "spring" }}>
          {/* Sandclock shape */}
          <div className="relative flex flex-col items-center">
            <svg width="70" height="90" viewBox="0 0 70 90">
              {/* Top half */}
              <path d="M5 5 L65 5 L35 45 Z" fill={p.primary} opacity="0.15" stroke={p.primary} strokeWidth="1"/>
              {/* Bottom half */}
              <path d="M5 85 L65 85 L35 45 Z" fill={p.primary} opacity="0.08" stroke={p.primary} strokeWidth="1"/>
              {/* Sand fill top — animated */}
              <motion.path d={`M15 12 L55 12 L35 42 Z`} fill={p.primary} opacity="0.4"
                animate={{ opacity: [0.4, 0.6, 0.4] }} transition={{ duration: 2, repeat: Infinity }}/>
              {/* Waist dots */}
              <circle cx="35" cy="45" r="3" fill={p.primary} opacity="0.6"/>
              <circle cx="5" cy="5" r="2" fill={p.primary} opacity="0.4"/>
              <circle cx="65" cy="5" r="2" fill={p.primary} opacity="0.4"/>
              <circle cx="5" cy="85" r="2" fill={p.primary} opacity="0.4"/>
              <circle cx="65" cy="85" r="2" fill={p.primary} opacity="0.4"/>
              {/* Number */}
              <text x="35" y="75" textAnchor="middle" style={{ fontFamily: `'${spec.theme.fontHeading}', serif`, fontSize: "20px", fill: p.primary }}>
                {String(v).padStart(2, "0")}
              </text>
            </svg>
          </div>
          <p className="text-[10px] uppercase tracking-[0.2em] mt-1" style={{ color: p.textMuted ?? p.text, opacity: 0.5 }}>{l}</p>
        </motion.div>
      ))}
    </div>
  );
}

// ── Photo grid ────────────────────────────────────────────────────────────
function PhotoStrip({ photos, palette }: { photos: string[]; palette: Palette }) {
  if (!photos.length) return null;
  return (
    <div className={`grid gap-2 ${photos.length === 1 ? "grid-cols-1" : photos.length === 2 ? "grid-cols-2" : photos.length >= 4 ? "grid-cols-2" : "grid-cols-3"}`}>
      {photos.slice(0, 5).map((src, i) => (
        <motion.div key={i} className="overflow-hidden" style={{ aspectRatio: photos.length === 1 ? "16/9" : "3/4", border: `1px solid ${palette.primary}25` }}
          initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
        </motion.div>
      ))}
    </div>
  );
}

// ── Message form ──────────────────────────────────────────────────────────
function MessageForm({ section, p, fontHeading }: { section: { heading?: string; placeholder?: string; submitLabel?: string }; p: Palette; fontHeading: string }) {
  const [msg, setMsg] = useState("");
  const [name, setName] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <div>
      {!sent ? (
        <div className="space-y-3">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name"
            className="w-full border py-3 px-4 text-sm outline-none"
            style={{ borderColor: `${p.primary}30`, background: `${p.primary}06`, color: p.text }} />
          <textarea value={msg} onChange={(e) => setMsg(e.target.value)}
            placeholder={section.placeholder || "Write a message for the couple…"} rows={4}
            className="w-full border py-3 px-4 text-sm outline-none resize-none"
            style={{ borderColor: `${p.primary}30`, background: `${p.primary}06`, color: p.text }} />
          <button onClick={() => { if (msg.trim()) setSent(true); }}
            className="w-full py-3 text-xs uppercase tracking-[0.2em] transition-all"
            style={{ background: p.primary, color: p.bg }}>
            {section.submitLabel || "Send Message"}
          </button>
        </div>
      ) : (
        <motion.div className="text-center py-10" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
          <div className="text-4xl mb-4" style={{ color: p.primary }}>✦</div>
          <p style={{ fontFamily: `'${fontHeading}', serif`, fontSize: "1.4rem", color: p.text, opacity: 0.85 }}>
            Your message has been received
          </p>
          <p className="text-sm mt-2" style={{ color: p.textMuted ?? p.text, opacity: 0.5 }}>
            Thank you, {name}
          </p>
        </motion.div>
      )}
    </div>
  );
}

// ── Main renderer ─────────────────────────────────────────────────────────
export function SpecRenderer({ spec, coupleName, eventDate, venue, guestName, photos = [], isPreview = false }: Props) {
  const [opened, setOpened] = useState(isPreview);
  const [burst, setBurst]   = useState(false);
  const p = spec.theme.palette;
  const fh = spec.theme.fontHeading;
  const fb = spec.theme.fontBody;

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    const fonts = [fh, fb].map(encodeURIComponent).join("&family=");
    link.href = `https://fonts.googleapis.com/css2?family=${fonts}:ital,wght@0,300;0,400;1,400&display=swap`;
    document.head.appendChild(link);
    return () => { try { document.head.removeChild(link); } catch {} };
  }, [fh, fb]);

  const handleOpen = () => {
    setBurst(true);
    setTimeout(() => { setBurst(false); setOpened(true); }, 3200);
  };

  return (
    <div style={{ background: p.bg, color: p.text, fontFamily: `'${fb}', system-ui, sans-serif`, direction: spec.theme.direction as "ltr" | "rtl", minHeight: "100vh" }}>

      {/* Envelope */}
      <AnimatePresence>
        {!opened && !isPreview && (
          <EnvelopeScreen spec={spec} coupleName={coupleName} guestName={guestName} onOpen={handleOpen} />
        )}
      </AnimatePresence>

      {/* Particle burst */}
      <ParticleBurst spec={spec} active={burst} />

      {/* Content */}
      <AnimatePresence>
        {(opened || isPreview) && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2 }}>

            {/* Photos strip at top if available */}
            {photos.length > 0 && (
              <section style={{ background: p.surface }} className="px-4 pt-4 pb-0">
                <PhotoStrip photos={photos} palette={p} />
              </section>
            )}

            {/* Render each section */}
            {spec.sections.map((section, i) => (
              <motion.section key={i}
                className="px-6 sm:px-12 py-16 relative"
                style={{ background: i % 2 === 0 ? p.bg : p.surface }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.05 * i }}
              >
                {/* Section heading */}
                {section.heading && (
                  <div className="text-center mb-8">
                    <h2 style={{ fontFamily: `'${fh}', serif`, fontSize: "clamp(1.8rem, 5vw, 3rem)", fontWeight: 300, color: p.text, lineHeight: 1.2 }}>
                      {section.heading}
                    </h2>
                    {section.subheading && (
                      <p className="mt-2 text-sm" style={{ color: p.textMuted ?? p.text, opacity: 0.6 }}>{section.subheading}</p>
                    )}
                    <Divider color={p.primary} style={spec.decorations?.dividerStyle ?? "ornate"} />
                  </div>
                )}

                {/* Countdown */}
                {section.type === "countdown" && (
                  <SandclockCountdown datetime={section.datetime ?? eventDate} spec={spec} />
                )}

                {/* Hero quote */}
                {section.type === "hero" && section.quote && (
                  <p className="text-center text-lg italic max-w-2xl mx-auto"
                    style={{ fontFamily: `'${fh}', serif`, color: p.text, opacity: 0.65, lineHeight: 1.8 }}>
                    "{section.quote}"
                  </p>
                )}

                {/* Welcome / message body */}
                {["welcome", "hero"].includes(section.type) && section.message && (
                  <p className="text-center text-base leading-relaxed max-w-xl mx-auto"
                    style={{ color: p.text, opacity: 0.7, lineHeight: 1.9 }}>
                    {section.message}
                  </p>
                )}

                {/* Guest personalization */}
                {section.type === "guest" && section.message && (
                  <div className="text-center max-w-xl mx-auto">
                    <div className="mb-6 px-6 py-5 border" style={{ borderColor: `${p.primary}30`, background: `${p.primary}08` }}>
                      <p style={{ fontFamily: `'${fh}', serif`, fontSize: "1.8rem", fontWeight: 300, color: p.primary }}>
                        {guestName || "Dear Guest"}
                      </p>
                    </div>
                    <p className="text-base leading-relaxed" style={{ color: p.text, opacity: 0.7 }}>
                      {section.message?.replace(/\{\{GUEST_NAME\}\}/g, guestName || "Dear Guest")}
                    </p>
                  </div>
                )}

                {/* Venue */}
                {section.type === "venue" && (
                  <div className="max-w-xl mx-auto text-center space-y-4">
                    <p style={{ fontFamily: `'${fh}', serif`, fontSize: "1.6rem", fontWeight: 300, color: p.primary }}>
                      {section.venueName ?? venue}
                    </p>
                    {section.venueDescription && (
                      <p className="text-sm leading-relaxed" style={{ color: p.text, opacity: 0.6 }}>
                        {section.venueDescription}
                      </p>
                    )}
                    <div className="flex flex-wrap justify-center gap-4 mt-4">
                      {section.time && (
                        <div className="px-4 py-2.5 border" style={{ borderColor: `${p.primary}30` }}>
                          <p className="text-[10px] uppercase tracking-[0.2em] mb-1" style={{ color: p.primary, opacity: 0.7 }}>Time</p>
                          <p className="text-sm" style={{ color: p.text }}>{section.time}</p>
                        </div>
                      )}
                      {section.dresscode && (
                        <div className="px-4 py-2.5 border" style={{ borderColor: `${p.primary}30` }}>
                          <p className="text-[10px] uppercase tracking-[0.2em] mb-1" style={{ color: p.primary, opacity: 0.7 }}>Dress Code</p>
                          <p className="text-sm" style={{ color: p.text }}>{section.dresscode}</p>
                        </div>
                      )}
                    </div>
                    {/* Date */}
                    <div className="pt-2 text-sm uppercase tracking-[0.2em]" style={{ color: p.text, opacity: 0.5 }}>
                      {new Date(eventDate).toLocaleDateString("en-GB", { weekday:"long", day:"numeric", month:"long", year:"numeric" })}
                    </div>
                  </div>
                )}

                {/* Message form */}
                {section.type === "message" && (
                  <div className="max-w-md mx-auto">
                    <MessageForm section={section} p={p} fontHeading={fh} />
                  </div>
                )}
              </motion.section>
            ))}

            {/* Footer */}
            <div className="py-8 text-center" style={{ background: p.bg, borderTop: `1px solid ${p.primary}20` }}>
              <p style={{ fontFamily: `'${fh}', serif`, fontSize: "1.2rem", color: p.primary, opacity: 0.6 }}>
                {coupleName}
              </p>
              <p className="text-[10px] uppercase tracking-[0.3em] mt-1" style={{ color: p.text, opacity: 0.3 }}>
                Made with love · Invité
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
