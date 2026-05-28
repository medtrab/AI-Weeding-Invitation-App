"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Music, Palette, Wand2, ChevronRight, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";

interface ThemeConcept {
  id: string;
  name: string;
  tagline: string;
  mood: string;
  colorPalette: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  visualDescription: string;
  animationStyle: string;
  fontPrimary: string;
  fontSecondary: string;
  musicSuggestion: string;
  uniqueDetail: string;
  invitationText: string;
}

interface VibeResult {
  interpretation: string;
  themes: ThemeConcept[];
}

const VIBE_EXAMPLES = [
  { icon: "🎵", label: "A song",    text: "Clair de Lune by Debussy"         },
  { icon: "🌅", label: "A mood",    text: "Golden hour in Santorini"          },
  { icon: "🎬", label: "A film",    text: "The Great Gatsby"                  },
  { icon: "🍂", label: "A season",  text: "Late autumn in a Japanese garden"  },
  { icon: "✨", label: "A feeling", text: "Dancing barefoot on warm sand"     },
  { icon: "🌹", label: "An era",    text: "1920s Paris jazz clubs"            },
];

const STATUS_STEPS = [
  "Feeling the vibe…",
  "Translating into visual worlds…",
  "Crafting three unique concepts…",
  "Adding the finishing touches…",
];

interface Props {
  invitationId: string;
  onApplyTheme: (theme: ThemeConcept) => void;
}

export function VibeGenerator({ invitationId, onApplyTheme }: Props) {
  const [vibe, setVibe]         = useState("");
  const [loading, setLoading]   = useState(false);
  const [stepIdx, setStepIdx]   = useState(0);
  const [result, setResult]     = useState<VibeResult | null>(null);
  const [error, setError]       = useState("");
  const [selected, setSelected] = useState<string | null>(null);

  const generate = async () => {
    if (!vibe.trim()) return;
    setLoading(true);
    setResult(null);
    setError("");
    setSelected(null);
    setStepIdx(0);

    const iv = setInterval(() =>
      setStepIdx((i) => Math.min(i + 1, STATUS_STEPS.length - 1)), 800
    );

    try {
      const res  = await fetch("/api/ai/vibe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vibe }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail ?? "Generation failed");
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      clearInterval(iv);
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 border border-gold/30 flex items-center justify-center">
          <Wand2 size={16} className="text-gold" />
        </div>
        <div>
          <h3 className="font-cormorant text-xl font-light text-cream">Vibe to Invitation</h3>
          <p className="text-xs text-cream/40 tracking-wide">Describe a song, mood, film, or feeling</p>
        </div>
      </div>

      {/* Input area */}
      <div className="bg-gold/[0.04] border border-gold/20 p-5">
        <div className="flex flex-wrap gap-2 mb-4">
          {VIBE_EXAMPLES.map((ex) => (
            <button
              key={ex.text}
              onClick={() => setVibe(ex.text)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs border transition-all ${
                vibe === ex.text
                  ? "border-gold text-gold bg-gold/10"
                  : "border-gold/15 text-cream/40 hover:border-gold/40 hover:text-cream/70"
              }`}
            >
              <span>{ex.icon}</span>
              {ex.label}
            </button>
          ))}
        </div>

        <textarea
          value={vibe}
          onChange={(e) => setVibe(e.target.value)}
          placeholder="e.g. 'Clair de Lune by Debussy' or 'golden hour in Marrakech' or 'the feeling of slow dancing at midnight'…"
          rows={3}
          className="w-full bg-transparent text-cream text-sm outline-none resize-none placeholder:text-cream/20 tracking-wide leading-relaxed border-t border-gold/15 pt-4"
          onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) generate(); }}
        />

        <div className="flex items-center justify-between mt-3">
          <p className="text-[10px] text-cream/25">Ctrl+Enter to generate</p>
          <button
            onClick={generate}
            disabled={loading || !vibe.trim()}
            className="flex items-center gap-2 px-6 py-2.5 bg-gold text-deep text-xs uppercase tracking-[0.2em] font-medium hover:bg-gold-light transition-all disabled:opacity-40"
          >
            <Sparkles size={13} />
            {loading ? STATUS_STEPS[stepIdx] : "Generate Themes"}
          </button>
        </div>
      </div>

      {/* Loading shimmer */}
      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-cream/5 border border-gold/8 animate-pulse" style={{ animationDelay: `${i * 0.15}s` }} />
          ))}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="px-4 py-3 border border-red-500/30 bg-red-500/5 text-xs text-red-400 flex items-center gap-2">
          {error}
          <button onClick={generate} className="ml-auto flex items-center gap-1 hover:text-red-300">
            <RefreshCw size={11} /> Retry
          </button>
        </div>
      )}

      {/* Results */}
      <AnimatePresence>
        {result && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-5"
          >
            {/* AI interpretation */}
            <div className="flex gap-3 px-4 py-3 bg-gold/[0.06] border-l-2 border-gold/50">
              <Sparkles size={14} className="text-gold shrink-0 mt-0.5" />
              <p className="text-sm text-cream/65 leading-relaxed italic">
                {result.interpretation}
              </p>
            </div>

            {/* Theme cards */}
            <div className="space-y-4">
              {result.themes.map((theme, i) => (
                <ThemeCard
                  key={theme.id}
                  theme={theme}
                  index={i}
                  isSelected={selected === theme.id}
                  onSelect={() => setSelected(theme.id)}
                  onApply={() => onApplyTheme(theme)}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Individual theme card ──────────────────────────────────────────────────
function ThemeCard({
  theme, index, isSelected, onSelect, onApply,
}: {
  theme: ThemeConcept;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  onApply: () => void;
}) {
  const p = theme.colorPalette;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.12 }}
      className={`border transition-all cursor-pointer ${
        isSelected ? "border-gold/60" : "border-gold/15 hover:border-gold/35"
      }`}
      onClick={onSelect}
    >
      {/* Color bar */}
      <div className="h-1.5 flex">
        {Object.values(p).map((color, i) => (
          <div key={i} className="flex-1" style={{ background: color }} />
        ))}
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] uppercase tracking-[0.2em] text-gold/60">
                Theme {index + 1}
              </span>
              <span className="text-[10px] text-cream/25">·</span>
              <span className="text-[10px] text-cream/40">{theme.mood}</span>
            </div>
            <h4 className="font-cormorant text-xl font-light text-cream">{theme.name}</h4>
            <p className="text-xs text-cream/50 mt-0.5 italic">{theme.tagline}</p>
          </div>

          {/* Mini palette */}
          <div className="flex gap-1 shrink-0 mt-1">
            {[p.primary, p.accent, p.secondary].map((c, i) => (
              <div key={i} className="w-5 h-5 rounded-full border border-white/10" style={{ background: c }} />
            ))}
          </div>
        </div>

        {/* Visual description — shown when selected */}
        <AnimatePresence>
          {isSelected && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="space-y-4 pt-3 border-t border-gold/10 mt-3">
                {/* Visual world */}
                <div>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Palette size={11} className="text-gold/60" />
                    <span className="text-[10px] uppercase tracking-[0.15em] text-gold/60">Visual World</span>
                  </div>
                  <p className="text-xs text-cream/60 leading-relaxed">{theme.visualDescription}</p>
                </div>

                {/* Sample text */}
                <div>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className="text-[10px] uppercase tracking-[0.15em] text-gold/60">Sample Text</span>
                  </div>
                  <p
                    className="text-sm italic text-cream/70 leading-relaxed pl-3 border-l border-gold/20"
                    style={{ fontFamily: `'${theme.fontPrimary}', serif` }}
                  >
                    "{theme.invitationText}"
                  </p>
                </div>

                {/* Music + unique detail */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gold/[0.04] border border-gold/15 p-3">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <Music size={10} className="text-gold/60" />
                      <span className="text-[10px] uppercase tracking-[0.15em] text-gold/60">Music</span>
                    </div>
                    <p className="text-xs text-cream/60">{theme.musicSuggestion}</p>
                  </div>
                  <div className="bg-gold/[0.04] border border-gold/15 p-3">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <Sparkles size={10} className="text-gold/60" />
                      <span className="text-[10px] uppercase tracking-[0.15em] text-gold/60">Signature</span>
                    </div>
                    <p className="text-xs text-cream/60">{theme.uniqueDetail}</p>
                  </div>
                </div>

                {/* Fonts */}
                <div className="flex gap-3 text-[10px] text-cream/35">
                  <span>Heading: <span className="text-cream/55">{theme.fontPrimary}</span></span>
                  <span>Body: <span className="text-cream/55">{theme.fontSecondary}</span></span>
                </div>

                {/* Apply button */}
                <button
                  onClick={(e) => { e.stopPropagation(); onApply(); }}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-gold text-deep text-xs uppercase tracking-[0.2em] font-medium hover:bg-gold-light transition-colors"
                >
                  Apply This Theme <ChevronRight size={13} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!isSelected && (
          <p className="text-[10px] text-cream/25 mt-2">Click to expand →</p>
        )}
      </div>
    </motion.div>
  );
}
