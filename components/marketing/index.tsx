// components/marketing/HeroSection.tsx

"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { FloatingInvitationCard } from "./FloatingInvitationCard";
import { ParticleField } from "./ParticleField";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-6 pt-24 pb-16">
      {/* Radial ambient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-gold/[0.04] rounded-full blur-3xl" />
      </div>

      <ParticleField count={35} />

      <div className="relative z-10 text-center max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
        >
          <SectionLabel>AI-Powered Event Invitations</SectionLabel>
        </motion.div>

        <motion.h1
          className="font-cormorant text-[clamp(3rem,7vw,6.5rem)] font-light leading-[1.05] tracking-[-0.01em] mb-6"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.15 }}
        >
          Invitations that
          <br />
          <em className="italic text-gold">move hearts</em>
        </motion.h1>

        <motion.p
          className="text-sm text-cream/50 tracking-wide max-w-md mx-auto mb-10 leading-relaxed"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3 }}
        >
          Generate breathtaking, personalized event invitations with AI.
          Every detail crafted for your most memorable moments.
        </motion.p>

        <motion.div
          className="flex gap-4 justify-center flex-wrap"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.45 }}
        >
          <Link href="/dashboard">
            <Button size="lg">Create Your Invitation</Button>
          </Link>
          <Link href="#themes">
            <Button variant="ghost" size="lg">Explore Themes</Button>
          </Link>
        </motion.div>
      </div>

      <FloatingInvitationCard />
    </section>
  );
}


// components/marketing/FloatingInvitationCard.tsx

"use client";

import { motion } from "framer-motion";
import { GoldDivider } from "@/components/ui/GoldDivider";

export function FloatingInvitationCard() {
  return (
    <motion.div
      className="absolute right-[8%] top-1/2 -translate-y-1/2 w-[240px] hidden xl:block"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2, delay: 0.6 }}
    >
      <motion.div
        animate={{ y: [0, -12, 0], rotate: [-2, -1, -2] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="relative bg-gradient-to-br from-[#1A160E] to-[#2A2218] border border-gold/25 p-8 text-center">
          {/* Top gold line */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
          {/* Inner border */}
          <div className="absolute inset-[10px] border border-gold/10 pointer-events-none" />

          <p className="font-cormorant text-2xl text-gold/70 mb-2">✦</p>
          <p className="font-cormorant text-xl font-light text-cream leading-tight">
            Sofia
            <span className="block italic text-gold text-2xl">&</span>
            Élias
          </p>
          <GoldDivider className="my-3" showDiamond={false} />
          <p className="text-[10px] uppercase tracking-[0.2em] text-cream/45">
            September 12 · 2025
          </p>
          <p className="text-[10px] uppercase tracking-[0.15em] text-cream/30 mt-1">
            Villa Majestic, Paris
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}


// components/marketing/ParticleField.tsx

"use client";

import { useEffect, useRef } from "react";

interface ParticleFieldProps {
  count?: number;
}

export function ParticleField({ count = 30 }: ParticleFieldProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    for (let i = 0; i < count; i++) {
      const particle = document.createElement("div");
      const size = Math.random() < 0.3 ? 2 : 1;
      particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: #C9A84C;
        border-radius: 50%;
        left: ${Math.random() * 100}%;
        animation: particleFloat ${8 + Math.random() * 12}s linear ${Math.random() * 10}s infinite;
        opacity: 0;
      `;
      container.appendChild(particle);
    }
  }, [count]);

  return <div ref={containerRef} className="absolute inset-0 pointer-events-none overflow-hidden" />;
}


// components/marketing/AIGeneratorSection.tsx

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAIGeneration } from "@/hooks/useAIGeneration";
import { useAIStore } from "@/stores/useAIStore";
import { Button } from "@/components/ui/Button";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { AIResultCard } from "./AIResultCard";
import { AIProgressBar } from "./AIProgressBar";

const PROMPT_PRESETS = [
  { label: "Arabic Wedding", prompt: "Luxury Arabic wedding with gold calligraphy and romantic animations" },
  { label: "Engagement", prompt: "Minimalist white and champagne engagement invitation" },
  { label: "Corporate Gala", prompt: "Elegant corporate gala with midnight blue and silver accents" },
  { label: "Birthday", prompt: "Whimsical garden birthday party with floral illustrations" },
  { label: "Graduation", prompt: "Modern graduation celebration with gold and black theme" },
];

export function AIGeneratorSection() {
  const [prompt, setPrompt] = useState(PROMPT_PRESETS[0].prompt);
  const [activePreset, setActivePreset] = useState(0);
  const { generate } = useAIGeneration();
  const { status, result, progress } = useAIStore();

  const isGenerating = !["idle", "done", "error"].includes(status);

  const handleGenerate = () => generate({ prompt });

  const handlePreset = (index: number) => {
    setActivePreset(index);
    setPrompt(PROMPT_PRESETS[index].prompt);
  };

  return (
    <section id="ai-gen" className="py-28 bg-gradient-to-b from-deep to-[#100E0A]">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <SectionLabel>AI Generator</SectionLabel>
          <h2 className="font-cormorant text-[clamp(2.2rem,4vw,3.5rem)] font-light leading-tight">
            Describe your dream,
            <br />
            <em className="italic text-gold">we craft the invitation</em>
          </h2>
        </motion.div>

        <motion.div
          className="bg-gold/[0.04] border border-gold/25 p-6 mb-4"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-[10px] uppercase tracking-[0.2em] text-gold block mb-4">
            Choose a style
          </span>
          <div className="flex flex-wrap gap-2 mb-5">
            {PROMPT_PRESETS.map((preset, i) => (
              <button
                key={preset.label}
                onClick={() => handlePreset(i)}
                className={`px-4 py-2 text-xs tracking-[0.1em] border transition-all ${
                  activePreset === i
                    ? "border-gold text-gold bg-gold/10"
                    : "border-gold/20 text-cream/50 hover:border-gold/50 hover:text-cream/80"
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
          <div className="border-t border-gold/15 pt-4">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={3}
              className="w-full bg-transparent text-cream text-sm outline-none resize-none placeholder:text-cream/20 tracking-wide leading-relaxed"
              placeholder="Describe your event style, colors, mood, cultural elements..."
            />
          </div>
        </motion.div>

        <Button
          variant="gold"
          size="lg"
          className="w-full"
          isLoading={isGenerating}
          onClick={handleGenerate}
        >
          {status === "done" ? "✦ Generate Again" : "✦ Generate with AI"}
        </Button>

        {isGenerating && (
          <AIProgressBar progress={progress} status={status} />
        )}

        <AnimatePresence>
          {result && status === "done" && (
            <AIResultCard result={result} />
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}


// components/marketing/AIProgressBar.tsx

"use client";

import { motion } from "framer-motion";

const STATUS_LABELS: Record<string, string> = {
  analyzing: "Analyzing your style...",
  generating_palette: "Choosing color palette...",
  crafting_text: "Crafting invitation text...",
  selecting_animations: "Selecting animations...",
  finalizing: "Finalizing your design...",
};

interface AIProgressBarProps {
  progress: number;
  status: string;
}

export function AIProgressBar({ progress, status }: AIProgressBarProps) {
  return (
    <motion.div
      className="mt-6"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
    >
      <p className="text-[11px] uppercase tracking-[0.2em] text-gold text-center mb-3 animate-pulse">
        {STATUS_LABELS[status] || "Processing..."}
      </p>
      <div className="h-px bg-cream/10 relative overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 bg-gold"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    </motion.div>
  );
}


// components/marketing/AIResultCard.tsx

"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { ColorSwatch } from "@/components/ui/ColorSwatch";
import type { AIGenerationResult } from "@/types";

interface AIResultCardProps {
  result: AIGenerationResult;
}

export function AIResultCard({ result }: AIResultCardProps) {
  return (
    <motion.div
      className="mt-6 grid grid-cols-2 gap-3"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <ResultCell label="Theme Name">
        <p className="font-cormorant text-xl font-light text-cream">
          {result.themeName}
        </p>
      </ResultCell>

      <ResultCell label="Color Palette">
        <div className="flex gap-2 mt-1">
          {Object.values(result.colorPalette).map((color, i) => (
            <ColorSwatch key={i} color={color} size="sm" />
          ))}
        </div>
      </ResultCell>

      <ResultCell label="Invitation Text" className="col-span-2">
        <p className="font-cormorant text-base italic text-cream/70 leading-relaxed">
          {result.invitationText}
        </p>
      </ResultCell>

      <ResultCell label="Suggested Music">
        <p className="text-sm text-cream/80">{result.musicSuggestion}</p>
      </ResultCell>

      <ResultCell label="Animation Style">
        <p className="text-sm text-cream/80">{result.decorativeStyle}</p>
      </ResultCell>

      <div className="col-span-2 flex gap-3 pt-2">
        <Button size="md" className="flex-1">Edit & Customize</Button>
        <Button variant="ghost" size="md" className="flex-1">Use This Theme</Button>
      </div>
    </motion.div>
  );
}

function ResultCell({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`bg-gold/[0.04] border border-gold/20 p-4 ${className}`}>
      <span className="text-[10px] uppercase tracking-[0.2em] text-gold block mb-2">
        {label}
      </span>
      {children}
    </div>
  );
}


// components/marketing/ThemeMarketplace.tsx

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { SectionLabel } from "@/components/ui/SectionLabel";
import type { Theme } from "@/types";

const FILTER_TAGS = ["All", "Wedding", "Corporate", "Birthday", "Arabic", "Minimalist"];

interface ThemeMarketplaceProps {
  themes: Theme[];
}

export function ThemeMarketplace({ themes }: ThemeMarketplaceProps) {
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered =
    activeFilter === "All"
      ? themes
      : themes.filter((t) => t.tags.includes(activeFilter.toLowerCase()));

  return (
    <section id="themes" className="py-28 bg-[#0A0906]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <SectionLabel>Theme Collection</SectionLabel>
          <h2 className="font-cormorant text-[clamp(2.2rem,4vw,3.5rem)] font-light">
            Curated templates for
            <br />
            <em className="italic text-gold">every occasion</em>
          </h2>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 flex-wrap justify-center mb-10">
          {FILTER_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveFilter(tag)}
              className={`px-5 py-2 text-xs uppercase tracking-[0.15em] border transition-all ${
                activeFilter === tag
                  ? "border-gold text-gold"
                  : "border-cream/10 text-cream/40 hover:border-cream/30"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Theme grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-gold/20">
          {filtered.map((theme, i) => (
            <ThemeCard key={theme.id} theme={theme} index={i} />
          ))}
        </div>

        <div className="text-center mt-8">
          <Button variant="ghost" size="lg">Browse All 60+ Themes</Button>
        </div>
      </div>
    </section>
  );
}

function ThemeCard({ theme, index }: { theme: Theme; index: number }) {
  return (
    <motion.div
      className="group relative bg-deep overflow-hidden"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06 }}
    >
      {/* Preview */}
      <div
        className="h-52 flex items-center justify-center relative overflow-hidden"
        style={{ backgroundColor: theme.colorPalette.background }}
      >
        <div className="text-center px-6">
          <p className="font-cormorant text-lg font-light" style={{ color: theme.colorPalette.text }}>
            {theme.name}
          </p>
        </div>
        {theme.isPremium && (
          <span className="absolute top-2 right-2 text-[9px] uppercase tracking-[0.2em] px-2 py-1 border border-gold/40 text-gold">
            Premium
          </span>
        )}
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gold/[0.06] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button className="px-5 py-2 border border-gold text-gold text-xs tracking-[0.2em] uppercase font-jost bg-deep/80">
            Preview
          </button>
        </div>
      </div>

      <div className="p-4 border-t border-gold/10">
        <p className="text-xs uppercase tracking-[0.1em] text-cream/70">{theme.name}</p>
        <p className="text-[11px] text-gold mt-0.5">{theme.tags.slice(0, 3).join(" · ")}</p>
      </div>
    </motion.div>
  );
}


// components/marketing/PricingSection.tsx

"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { useUIStore } from "@/stores/useUIStore";

const PLANS = [
  {
    name: "Essentials",
    badge: "Free",
    price: 0,
    period: "forever",
    features: [
      "1 invitation per month",
      "5 basic themes",
      "RSVP up to 50 guests",
      "Invité watermark",
      "Basic animations",
    ],
    cta: "Get Started Free",
    featured: false,
  },
  {
    name: "Luxe",
    badge: "Most Popular",
    price: 19,
    period: "month",
    features: [
      "Unlimited invitations",
      "All 60+ premium themes",
      "Unlimited guests",
      "No watermark",
      "AI text generation",
      "Background music library",
      "Full analytics dashboard",
      "QR codes & custom links",
    ],
    cta: "Start 14-Day Trial",
    featured: true,
  },
  {
    name: "Studio",
    badge: "Enterprise",
    price: 79,
    period: "month",
    features: [
      "Everything in Luxe",
      "Wedding planner accounts",
      "White-label branding",
      "AI video generation",
      "AI voice narration",
      "Seat management & QR tickets",
      "Priority support",
    ],
    cta: "Contact Sales",
    featured: false,
  },
];

export function PricingSection() {
  const { openModal } = useUIStore();

  return (
    <section id="pricing" className="py-28">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-14">
          <SectionLabel>Pricing</SectionLabel>
          <h2 className="font-cormorant text-[clamp(2.2rem,4vw,3.5rem)] font-light">
            Simple, transparent
            <br />
            <em className="italic text-gold">pricing</em>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-px bg-gold/20">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.name}
              className={`p-8 relative ${
                plan.featured
                  ? "bg-gradient-to-b from-[#1A1608] to-[#141009]"
                  : "bg-deep"
              }`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <span className="text-[10px] uppercase tracking-[0.2em] text-gold border border-gold/40 px-3 py-1 inline-block mb-4">
                {plan.badge}
              </span>
              <h3 className="font-cormorant text-2xl font-light mb-2">
                {plan.name}
              </h3>
              <div className="mb-4">
                <span className="font-cormorant text-5xl font-light text-gold">
                  ${plan.price}
                </span>
                <span className="text-xs text-cream/35 tracking-wide ml-1">
                  / {plan.period}
                </span>
              </div>

              <div className="h-px bg-gold/15 my-5" />

              <ul className="space-y-2.5 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-cream/55">
                    <div className="w-1 h-1 bg-gold/60 rotate-45 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <Button
                variant={plan.featured ? "primary" : "gold"}
                size="md"
                className="w-full"
                onClick={() => openModal("auth")}
              >
                {plan.cta}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
