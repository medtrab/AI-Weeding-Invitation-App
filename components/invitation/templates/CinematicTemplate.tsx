"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Invitation } from "@/types";

// ── Types ──────────────────────────────────────────────────────────────────
interface SpecSection {
  type: string;
  heading?: string;
  subheading?: string;
  quote?: string;
  message?: string;
  venueName?: string;
  venueDescription?: string;
  time?: string;
  dresscode?: string;
  placeholder?: string;
  submitLabel?: string;
}

interface Spec {
  theme?: {
    palette?: { bg?: string; surface?: string; primary?: string; accent?: string; text?: string; textMuted?: string };
    fontHeading?: string;
    petalEmoji?: string;
    topSymbol?: string;
    direction?: string;
  };
  imagePrompt?: string;
  coverSpec?: {
    tagline?: string;
    storyLabel?: string;
    storyText?: string;
    detailsLabel?: string;
    venueIcon?: string;
    messageTitle?: string;
    thankEmoji?: string;
  };
  sections?: SpecSection[];
}

interface Props {
  invitation: Invitation;
  guestName?: string;
  imageUrl?: string;
  trackingToken?: string;
  isPreview?: boolean;
}

// ── Palette helper ─────────────────────────────────────────────────────────
function getPalette(spec: Spec) {
  const p = spec.theme?.palette || {};
  return {
    bg:      p.bg      || "#0D0B08",
    surface: p.surface || "#1A1408",
    primary: p.primary || "#C9A84C",
    accent:  p.accent  || "#E8C86A",
    text:    p.text    || "#FAF7F2",
    muted:   p.textMuted || "rgba(245,240,232,0.5)",
  };
}

// ── Background ─────────────────────────────────────────────────────────────
function Background({ imageUrl, p }: { imageUrl?: string; p: ReturnType<typeof getPalette> }) {
  return (
    <div className="fixed inset-0 z-0">
      {imageUrl ? (
        <>
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: `url(${imageUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center top",
            filter: "brightness(0.55) saturate(1.4) contrast(1.05)",
          }} />
          <div style={{
            position: "absolute", inset: 0,
            background: `linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.05) 25%, ${p.bg}80 60%, ${p.bg}ee 85%, ${p.bg} 100%)`,
          }} />
        </>
      ) : (
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, ${p.bg} 0%, ${p.surface} 50%, ${p.bg} 100%)` }} />
      )}
    </div>
  );
}

// ── Floating particles ─────────────────────────────────────────────────────
function Petals({ emoji = "🌸" }: { emoji?: string }) {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-10">
      {Array.from({ length: 16 }).map((_, i) => (
        <motion.div key={i} className="absolute select-none"
          style={{ left: `${(i * 6.3) % 100}%`, top: "-30px", fontSize: `${0.7 + (i % 3) * 0.3}rem` }}
          animate={{ y: ["0vh", "110vh"], rotate: [0, 360 * (i % 2 ? 1 : -1)], opacity: [0, 0.8, 0.6, 0] }}
          transition={{ duration: 7 + (i % 5) * 1.5, delay: i * 0.4, repeat: Infinity, ease: "linear" }}>
          {emoji}
        </motion.div>
      ))}
    </div>
  );
}

// ── Cover scene ────────────────────────────────────────────────────────────
function CoverScene({ invitation, guestName, spec, p, onOpen }: {
  invitation: Invitation; guestName?: string; spec: Spec;
  p: ReturnType<typeof getPalette>; onOpen: () => void;
}) {
  const [tapped, setTapped] = useState(false);
  const heroSection = spec.sections?.find(s => s.type === "hero");
  const font = spec.theme?.fontHeading || "Georgia";

  const handleTap = () => {
    if (tapped) return;
    setTapped(true);
    setTimeout(onOpen, 1000);
  };

  return (
    <div className="fixed inset-0 z-20 flex flex-col items-center justify-center text-center px-6 cursor-pointer"
      onClick={handleTap}>
      <motion.div className="relative z-10 max-w-sm w-full"
        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2 }}>

        {/* Top symbol */}
        <motion.div className="text-5xl mb-4"
          animate={tapped ? { scale: [1, 1.5, 0], opacity: [1, 1, 0] } : { scale: [1, 1.06, 1] }}
          transition={{ duration: tapped ? 0.6 : 3, repeat: tapped ? 0 : Infinity, ease: "easeInOut" }}
          style={{ filter: `drop-shadow(0 0 14px ${p.primary}90)` }}>
          {spec.theme?.topSymbol || "✦"}
        </motion.div>

        {/* Guest greeting */}
        {guestName && (
          <motion.p className="text-xs uppercase tracking-[0.35em] mb-3"
            style={{ color: p.primary, opacity: 0.85 }}
            initial={{ opacity: 0 }} animate={{ opacity: 0.85 }} transition={{ delay: 0.4 }}>
            Dear {guestName}
          </motion.p>
        )}

        {/* Couple names */}
        <motion.h1 style={{
          fontFamily: `'${font}', Georgia, serif`,
          fontSize: "clamp(2.5rem,10vw,4.5rem)",
          fontWeight: 300, color: p.text, lineHeight: 1.1,
          textShadow: `0 2px 30px ${p.primary}50`,
        }}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          {invitation.coupleName?.includes("&") ? (
            <>
              {invitation.coupleName.split("&")[0].trim()}
              <em style={{ display: "block", color: p.primary, fontSize: "0.5em", fontStyle: "normal", margin: "0.3em 0" }}>
                {heroSection?.subheading || "✦ & ✦"}
              </em>
              {invitation.coupleName.split("&")[1].trim()}
            </>
          ) : invitation.coupleName || invitation.title}
        </motion.h1>

        {/* Quote */}
        {heroSection?.quote && (
          <motion.p className="mt-4 text-sm leading-relaxed italic px-4"
            style={{ fontFamily: `'${font}', serif`, color: p.text, opacity: 0.7 }}
            initial={{ opacity: 0 }} animate={{ opacity: 0.7 }} transition={{ delay: 1 }}>
            {heroSection.quote}
          </motion.p>
        )}

        {/* Tagline */}
        {spec.coverSpec?.tagline && !heroSection?.quote && (
          <motion.p className="mt-4 text-sm italic"
            style={{ color: p.text, opacity: 0.65, fontFamily: `'${font}', serif` }}
            initial={{ opacity: 0 }} animate={{ opacity: 0.65 }} transition={{ delay: 1 }}>
            {spec.coverSpec.tagline}
          </motion.p>
        )}

        {/* Tap hint */}
        <motion.div className="mt-10 flex flex-col items-center gap-2"
          animate={{ y: [0, -8, 0], opacity: tapped ? [1, 0] : [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}>
          <motion.div className="w-10 h-10 border-2 rounded-full flex items-center justify-center"
            style={{ borderColor: p.primary, color: p.primary }}
            animate={{ boxShadow: [`0 0 0px ${p.primary}00`, `0 0 20px ${p.primary}60`, `0 0 0px ${p.primary}00`] }}
            transition={{ duration: 2, repeat: Infinity }}>
            {tapped ? "✦" : "↓"}
          </motion.div>
          <p className="text-xs uppercase tracking-[0.3em]" style={{ color: p.primary, opacity: 0.6 }}>
            {tapped ? "Opening…" : "Tap to open"}
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}

// ── Generic section renderer ───────────────────────────────────────────────
function SectionView({ section, spec, p, invitation, guestName, onNext, isLast }: {
  section: SpecSection; spec: Spec; p: ReturnType<typeof getPalette>;
  invitation: Invitation; guestName?: string;
  onNext: () => void; isLast: boolean;
}) {
  const font = spec.theme?.fontHeading || "Georgia";
  const resolveText = (text?: string) =>
    (text || "").replace(/\{\{GUEST_NAME\}\}/g, guestName || "Dear Guest");

  const [msgValue, setMsgValue] = useState("");
  const [msgSent, setMsgSent]   = useState(false);
  const [cd, setCd] = useState({ d: 0, h: 0, m: 0, s: 0 });

  // Countdown for venue/details section
  useEffect(() => {
    if (section.type !== "venue" && section.type !== "details" && section.type !== "countdown") return;
    const tick = () => {
      const diff = new Date(invitation.eventDate).getTime() - Date.now();
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
  }, [section.type, invitation.eventDate]);

  const sendMessage = async () => {
    if (!msgValue.trim()) return;
    await fetch(`/api/rsvp/${invitation.id}`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ guestName: guestName || "Guest", message: msgValue, status: "attending" }),
    }).catch(() => {});
    setMsgSent(true);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16 relative z-20"
      dir={spec.theme?.direction || "ltr"}>
      <motion.div className="max-w-sm w-full"
        initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>

        {/* Section heading */}
        {section.heading && (
          <motion.h2 className="text-center mb-6"
            style={{ fontFamily: `'${font}', serif`, fontSize: "clamp(1.4rem,4vw,2.2rem)", fontWeight: 300, color: p.primary, lineHeight: 1.2 }}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            {resolveText(section.heading)}
          </motion.h2>
        )}

        {/* Divider */}
        <div className="flex items-center gap-3 justify-center mb-6">
          <div className="h-px flex-1 max-w-[60px]" style={{ background: `linear-gradient(to right, transparent, ${p.primary}60)` }} />
          <span style={{ color: p.primary, opacity: 0.5 }}>◆</span>
          <div className="h-px flex-1 max-w-[60px]" style={{ background: `linear-gradient(to left, transparent, ${p.primary}60)` }} />
        </div>

        {/* STORY / WELCOME / CUSTOM / DRESSCODE — text content */}
        {(section.type === "story" || section.type === "welcome" || section.type === "custom" || section.type === "dresscode") && section.message && (
          <motion.p className="text-center leading-relaxed mb-6"
            style={{ fontFamily: `'${font}', serif`, fontSize: "1.05rem", fontStyle: "italic", color: p.text, opacity: 0.82, lineHeight: 1.9 }}
            initial={{ opacity: 0 }} animate={{ opacity: 0.82 }} transition={{ delay: 0.3 }}>
            {resolveText(section.message)}
          </motion.p>
        )}

        {/* GUEST — personalized */}
        {section.type === "guest" && section.message && (
          <motion.p className="text-center leading-relaxed mb-6"
            style={{ fontFamily: `'${font}', serif`, fontSize: "1.05rem", fontStyle: "italic", color: p.text, opacity: 0.82, lineHeight: 1.9 }}
            initial={{ opacity: 0 }} animate={{ opacity: 0.82 }} transition={{ delay: 0.3 }}>
            {resolveText(section.message)}
          </motion.p>
        )}

        {/* VENUE / DETAILS */}
        {(section.type === "venue" || section.type === "details") && (
          <div className="space-y-3 mb-6">
            {[
              { icon: spec.coverSpec?.venueIcon || "📍", label: "Venue",   value: section.venueName || invitation.venue },
              { icon: "📅", label: "Date",    value: new Date(invitation.eventDate).toLocaleDateString(spec.theme?.direction === "rtl" ? "ar-TN" : "en-US", { weekday:"long", day:"numeric", month:"long", year:"numeric" }) },
              { icon: "🕐", label: "Time",    value: section.time || new Date(invitation.eventDate).toLocaleTimeString("en-US", { hour:"2-digit", minute:"2-digit" }) },
              section.dresscode ? { icon: "👗", label: "Dress Code", value: section.dresscode } : null,
              section.venueDescription ? { icon: "✦",  label: "About",   value: section.venueDescription } : null,
            ].filter(Boolean).map((row, i) => row && (
              <motion.div key={row.label} className="flex gap-3 items-start px-4 py-3 border"
                style={{ borderColor: `${p.primary}20`, background: `${p.surface}99` }}
                initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 * i + 0.2 }}>
                <span className="text-xl shrink-0">{row.icon}</span>
                <div>
                  <p className="text-xs uppercase tracking-[0.15em] mb-0.5" style={{ color: p.primary, opacity: 0.6 }}>{row.label}</p>
                  <p style={{ fontFamily: `'${font}', serif`, fontSize: "0.95rem", color: p.text }}>{row.value}</p>
                </div>
              </motion.div>
            ))}

            {/* Countdown */}
            {cd.d > 0 && (
              <motion.div className="border px-4 py-4 text-center"
                style={{ borderColor: `${p.primary}25`, background: `${p.primary}08` }}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
                <p className="text-xs uppercase tracking-[0.25em] mb-3" style={{ color: p.primary, opacity: 0.6 }}>
                  {spec.coverSpec?.detailsLabel || "Counting Down"}
                </p>
                <div className="flex justify-center gap-4">
                  {[{ v: cd.d, l: "Days" }, { v: cd.h, l: "Hours" }, { v: cd.m, l: "Min" }, { v: cd.s, l: "Sec" }].map(({ v, l }) => (
                    <div key={l}>
                      <p style={{ fontFamily: `'${font}', serif`, fontSize: "2rem", fontWeight: 300, color: p.primary, lineHeight: 1 }}>
                        {String(v).padStart(2, "0")}
                      </p>
                      <p className="text-xs mt-1" style={{ color: p.text, opacity: 0.4 }}>{l}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        )}

        {/* COUNTDOWN standalone */}
        {section.type === "countdown" && cd.d > 0 && (
          <div className="border px-4 py-6 text-center mb-6"
            style={{ borderColor: `${p.primary}25`, background: `${p.primary}08` }}>
            <div className="flex justify-center gap-5">
              {[{ v: cd.d, l: "Days" }, { v: cd.h, l: "Hours" }, { v: cd.m, l: "Min" }, { v: cd.s, l: "Sec" }].map(({ v, l }) => (
                <div key={l}>
                  <p style={{ fontFamily: `'${font}', serif`, fontSize: "2.5rem", fontWeight: 300, color: p.primary, lineHeight: 1 }}>
                    {String(v).padStart(2, "0")}
                  </p>
                  <p className="text-xs mt-1" style={{ color: p.text, opacity: 0.4 }}>{l}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MESSAGE / RSVP — wish box */}
        {(section.type === "message" || section.type === "rsvp") && (
          <div className="mb-6">
            <AnimatePresence mode="wait">
              {!msgSent ? (
                <motion.div key="form" exit={{ opacity: 0, y: -10 }}>
                  <textarea value={msgValue} onChange={e => setMsgValue(e.target.value)} rows={4}
                    placeholder={section.placeholder || "Write your wishes here…"}
                    className="w-full p-4 text-sm leading-relaxed outline-none resize-none"
                    style={{ background: `${p.primary}08`, border: `1px solid ${p.primary}30`, color: p.text, borderRadius: 2 }} />
                  <button onClick={sendMessage}
                    className="mt-3 w-full py-3.5 text-xs uppercase tracking-[0.25em] transition-all hover:opacity-80"
                    style={{ background: p.primary, color: p.bg, fontFamily: `'${font}', serif` }}>
                    {section.submitLabel || "Send with Love ♡"}
                  </button>
                </motion.div>
              ) : (
                <motion.div key="thanks" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="py-10 text-center">
                  <div className="text-5xl mb-4">{spec.coverSpec?.thankEmoji || "🕊️"}</div>
                  <p style={{ fontFamily: `'${font}', serif`, fontSize: "1.4rem", fontStyle: "italic", color: p.primary }}>
                    Thank you ✦
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Next button */}
        {!isLast && !(section.type === "message" || section.type === "rsvp") && (
          <motion.button onClick={onNext}
            className="w-full py-3.5 border text-xs uppercase tracking-[0.25em] transition-all hover:opacity-80 mt-2"
            style={{ borderColor: `${p.primary}40`, color: p.primary, background: "transparent" }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
            Continue ✦
          </motion.button>
        )}
      </motion.div>
    </div>
  );
}

// ── Preview mode — all sections in scroll ──────────────────────────────────
function PreviewMode({ invitation, spec, p, imageUrl }: {
  invitation: Invitation; spec: Spec; p: ReturnType<typeof getPalette>; imageUrl?: string;
}) {
  const font = spec.theme?.fontHeading || "Georgia";
  const sections = spec.sections || [];

  return (
    <div style={{ background: p.bg, color: p.text, minHeight: "100vh" }}>
      {/* Cover preview */}
      <div style={{ height: 480, position: "relative", overflow: "hidden" }}>
        {imageUrl ? (
          <>
            <div style={{
              position: "absolute", inset: 0,
              backgroundImage: `url(${imageUrl})`,
              backgroundSize: "cover", backgroundPosition: "center top",
              filter: "brightness(0.6) saturate(1.4)",
            }} />
            <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to bottom, transparent 40%, ${p.bg} 100%)` }} />
          </>
        ) : (
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, ${p.bg}, ${p.surface})` }} />
        )}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-10">
          <div className="text-4xl mb-3">{spec.theme?.topSymbol || "✦"}</div>
          <h1 style={{ fontFamily: `'${font}', serif`, fontSize: "clamp(1.8rem,5vw,2.8rem)", fontWeight: 300, color: p.text, lineHeight: 1.1 }}>
            {invitation.coupleName || invitation.title}
          </h1>
          {spec.coverSpec?.tagline && (
            <p className="mt-3 text-sm italic" style={{ color: p.text, opacity: 0.7, fontFamily: `'${font}', serif` }}>
              {spec.coverSpec.tagline}
            </p>
          )}
        </div>
      </div>

      {/* All sections */}
      {sections.map((s, i) => (
        <div key={i} className="px-6 py-6 border-t" style={{ borderColor: `${p.primary}12` }}>
          {s.heading && (
            <p className="text-center text-sm mb-3" style={{ fontFamily: `'${font}', serif`, color: p.primary, opacity: 0.8 }}>
              {s.heading}
            </p>
          )}
          {(s.message || s.quote || s.venueDescription) && (
            <p className="text-xs text-center leading-relaxed italic" style={{ color: p.text, opacity: 0.7, lineHeight: 1.8 }}>
              {s.message || s.quote || s.venueDescription}
            </p>
          )}
          {(s.type === "venue" || s.type === "details") && (
            <div className="mt-3 space-y-1.5">
              {[s.venueName || invitation.venue, new Date(invitation.eventDate).toLocaleDateString(), s.time].filter(Boolean).map((v, j) => (
                <p key={j} className="text-xs text-center" style={{ color: p.text, opacity: 0.6 }}>{v}</p>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────
export function CinematicTemplate({ invitation, guestName, imageUrl, isPreview = false }: Props) {
  // Parse spec from generatedHtml
  const raw = (invitation as { generatedHtml?: string }).generatedHtml;
  let spec: Spec = {};
  let rawPollinationsUrl = imageUrl;
  try {
    if (raw) {
      const parsed = JSON.parse(raw);
      spec = (parsed.spec || parsed) as Spec;
      // Use proxy for Pollinations URLs (avoids rate limit & caches result)
      if (parsed.pollinationsUrl && !parsed.imageData) {
        rawPollinationsUrl = `/api/image-proxy?url=${encodeURIComponent(parsed.pollinationsUrl)}`;
      } else if (parsed.imageData) {
        rawPollinationsUrl = parsed.imageData;
      }
    }
  } catch {}

  // Use proxy URL if imageUrl is a Pollinations URL
  const finalImageUrl = imageUrl?.startsWith("https://image.pollinations.ai/")
    ? `/api/image-proxy?url=${encodeURIComponent(imageUrl)}`
    : imageUrl || rawPollinationsUrl;

  const p = getPalette(spec);
  const sections = spec.sections || [];

  // Scene navigation — cover + all spec sections
  const [sceneIdx, setSceneIdx] = useState(-1); // -1 = cover
  const ctxRef = useRef<AudioContext | null>(null);

  const startMusic = () => {
    if (ctxRef.current) return;
    try {
      const ctx = new AudioContext();
      ctxRef.current = ctx;
      const notes = [220, 246.9, 277.2, 329.6, 370, 440];
      let t = ctx.currentTime + 0.5;
      function loop() {
        notes.forEach((f, i) => {
          const o = ctx.createOscillator(), g = ctx.createGain();
          o.type = "triangle"; o.frequency.value = f;
          o.connect(g); g.connect(ctx.destination);
          g.gain.setValueAtTime(0, t + i * 0.5);
          g.gain.linearRampToValueAtTime(0.06, t + i * 0.5 + 0.05);
          g.gain.exponentialRampToValueAtTime(0.001, t + i * 0.5 + 0.8);
          o.start(t + i * 0.5); o.stop(t + i * 0.5 + 0.85);
        });
        t += notes.length * 0.5 + 1;
        if (ctxRef.current) setTimeout(loop, (notes.length * 0.5 + 1) * 1000);
      }
      loop();
    } catch {}
  };

  useEffect(() => () => { ctxRef.current?.close(); }, []);

  if (isPreview) {
    return (
      <div style={{ background: p.bg }}>
        <Background imageUrl={finalImageUrl} p={p} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <PreviewMode invitation={invitation} spec={spec} p={p} imageUrl={finalImageUrl} />
        </div>
      </div>
    );
  }

  return (
    <div className="relative" style={{ background: p.bg, minHeight: "100dvh" }} dir={spec.theme?.direction || "ltr"}>
      <Background imageUrl={finalImageUrl} p={p} />
      <Petals emoji={spec.theme?.petalEmoji || "🌸"} />

      {/* Scene navigation dots */}
      {sceneIdx >= 0 && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex gap-1.5">
          {[-1, ...sections.map((_, i) => i)].map((idx) => (
            <button key={idx}
              className="transition-all rounded-full"
              style={{
                width: sceneIdx === idx ? 20 : 6,
                height: 6,
                background: sceneIdx === idx ? p.primary : `${p.primary}40`,
                border: "none",
              }}
              onClick={() => setSceneIdx(idx)} />
          ))}
        </div>
      )}

      <AnimatePresence mode="wait">
        {sceneIdx === -1 ? (
          <motion.div key="cover"
            exit={{ opacity: 0, scale: 1.05 }} transition={{ duration: 0.5 }}>
            <CoverScene
              invitation={invitation} guestName={guestName}
              spec={spec} p={p}
              onOpen={() => { startMusic(); setSceneIdx(0); }}
            />
          </motion.div>
        ) : (
          <motion.div key={`section-${sceneIdx}`}
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.6 }}>
            {sections[sceneIdx] && (
              <SectionView
                section={sections[sceneIdx]}
                spec={spec} p={p}
                invitation={invitation} guestName={guestName}
                onNext={() => setSceneIdx(i => Math.min(i + 1, sections.length - 1))}
                isLast={sceneIdx === sections.length - 1}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
