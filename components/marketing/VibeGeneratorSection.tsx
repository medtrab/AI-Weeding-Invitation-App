"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Wand2 } from "lucide-react";
import Link from "next/link";

const EXAMPLES = [
  "Clair de Lune by Debussy",
  "Golden hour in Santorini",
  "The Great Gatsby",
  "Late autumn in Kyoto",
  "Dancing barefoot on warm sand",
  "1920s Paris jazz clubs",
];

const STEPS = [
  "Feeling the vibe…",
  "Building visual worlds…",
  "Crafting three concepts…",
  "Finishing touches…",
];

export function VibeGeneratorSection() {
  const [vibe, setVibe]       = useState("");
  const [loading, setLoading] = useState(false);
  const [stepIdx, setStepIdx] = useState(0);
  const [result, setResult]   = useState<null | { interpretation: string; themes: { name: string; tagline: string; mood: string; colorPalette: Record<string,string>; visualDescription: string; musicSuggestion: string; uniqueDetail: string }[] }>(null);

  const generate = async () => {
    if (!vibe.trim()) return;
    setLoading(true); setResult(null); setStepIdx(0);
    const iv = setInterval(() => setStepIdx((i) => Math.min(i + 1, STEPS.length - 1)), 900);
    try {
      const res  = await fetch("/api/ai/vibe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vibe }),
      });
      const text = await res.text();
      if (text) {
        const data = JSON.parse(text);
        if (res.ok) setResult(data);
        else console.error("Vibe error:", data.detail);
      }
    } catch (err) {
      console.error("Vibe generate error:", err);
    } finally { clearInterval(iv); setLoading(false); }
  };

  return (
    <section className="py-28 bg-[#080604]">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div className="text-center mb-14" initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}>
          <div className="inline-flex items-center gap-2 px-4 py-2 border border-gold/20 text-[10px] uppercase tracking-[0.25em] text-gold mb-6">
            <Wand2 size={12} /> AI Creative Engine
          </div>
          <h2 className="font-cormorant text-[clamp(2.2rem,4vw,3.5rem)] font-light leading-tight">
            From a vibe to an invitation<br /><em className="italic text-gold">in seconds</em>
          </h2>
          <p className="text-sm text-cream/45 max-w-lg mx-auto mt-4 leading-relaxed">
            Describe a song, a feeling, a film, a season. Our AI translates your world into 3 distinct invitation concepts — complete with visual direction, animation, typography, and music.
          </p>
        </motion.div>

        {/* Input */}
        <motion.div className="bg-gold/[0.04] border border-gold/25 p-6 mb-4"
          initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}>
          <div className="flex flex-wrap gap-2 mb-5">
            {EXAMPLES.map((ex) => (
              <button key={ex} onClick={() => setVibe(ex)}
                className={`px-3 py-1.5 text-xs border transition-all ${
                  vibe === ex ? "border-gold text-gold bg-gold/10" : "border-gold/15 text-cream/40 hover:border-gold/40 hover:text-cream/70"
                }`}>
                {ex}
              </button>
            ))}
          </div>
          <textarea value={vibe} onChange={(e) => setVibe(e.target.value)} rows={2}
            placeholder="Describe a song, mood, film, season, or feeling…"
            className="w-full bg-transparent text-cream text-sm outline-none resize-none placeholder:text-cream/20 tracking-wide border-t border-gold/15 pt-4"
          />
        </motion.div>

        <button onClick={generate} disabled={loading || !vibe.trim()}
          className="w-full py-4 bg-gradient-to-r from-gold to-[#A8893A] text-deep text-xs uppercase tracking-[0.25em] font-medium hover:brightness-110 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
          <Sparkles size={14} />
          {loading ? STEPS[stepIdx] : "Generate 3 Creative Themes"}
        </button>

        {/* Loading shimmer */}
        {loading && (
          <div className="mt-6 space-y-3">
            {[1,2,3].map((i) => <div key={i} className="h-24 bg-cream/5 border border-gold/8 animate-pulse" />)}
          </div>
        )}

        {/* Results */}
        <AnimatePresence>
          {result && !loading && (
            <motion.div className="mt-6 space-y-4" initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}>
              <div className="flex gap-3 px-4 py-3 bg-gold/[0.06] border-l-2 border-gold/50">
                <Sparkles size={13} className="text-gold shrink-0 mt-0.5" />
                <p className="text-sm text-cream/65 italic leading-relaxed">{result.interpretation}</p>
              </div>
              {result.themes.map((theme, i) => (
                <motion.div key={i} className="border border-gold/15 overflow-hidden"
                  initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay: i * 0.1 }}>
                  <div className="h-1.5 flex">
                    {Object.values(theme.colorPalette).map((c,j) => <div key={j} className="flex-1" style={{ background: c }} />)}
                  </div>
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <span className="text-[10px] uppercase tracking-[0.2em] text-gold/60 block mb-1">Theme {i+1} · {theme.mood}</span>
                        <h4 className="font-cormorant text-xl font-light text-cream">{theme.name}</h4>
                        <p className="text-xs text-cream/45 italic mt-0.5">{theme.tagline}</p>
                      </div>
                      <div className="flex gap-1">
                        {[theme.colorPalette.primary, theme.colorPalette.accent, theme.colorPalette.secondary].map((c,j) => (
                          <div key={j} className="w-5 h-5 rounded-full border border-white/10" style={{ background:c }} />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-cream/50 leading-relaxed mb-3">{theme.visualDescription}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-cream/30">{theme.musicSuggestion}</span>
                      <Link href="/register"
                        className="text-[10px] uppercase tracking-[0.15em] text-gold hover:underline">
                        Use this theme →
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
              <div className="text-center pt-2">
                <Link href="/register" className="inline-block px-8 py-3 bg-gold text-deep text-xs uppercase tracking-[0.2em] font-medium hover:bg-gold-light transition-colors">
                  Start building with AI →
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
