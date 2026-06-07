"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardLayout } from "./DashboardLayout";
import {
  Copy, Check, Play, RefreshCw, ExternalLink,
  ChevronDown, ChevronUp, Sparkles, Image, Zap, Globe,
} from "lucide-react";

// ── Pre-built test prompts ─────────────────────────────────────────────────
const TEST_PROMPTS = [
  {
    id: "naruto",
    label: "🎌 Naruto Ninja Wedding",
    style: "anime",
    language: "en",
    theme: `Create an epic cinematic wedding invitation inspired by the world of Naruto.

Visual scene: Hidden Leaf Village at magical sunset. Giant Hokage-style mountain carvings visible in background. Cherry blossom trees in full bloom. Paper lanterns floating upward. Traditional Japanese architecture with glowing chakra-like energy particles everywhere. Full moon rising behind the mountains.

The couple: Groom wears elegant white ceremonial haori with orange flame patterns (Hokage-inspired). Bride wears stunning white wedding kimono with subtle red leaf motifs, flowing veil, delicate floral hair accessories. Both standing on ancient stone bridge overlooking the village, seen from behind.`,
    sections: [
      { type: "hero", label: "Cover / Hero", icon: "🎨",
        content: "Epic ninja wedding cover. Quote: 'After a journey filled with adventures, our paths have become one.' Subheading: The Greatest Mission Together" },
      { type: "story", label: "Love Story", icon: "💌",
        content: "Their love story as a legendary ninja mission. They kept crossing paths on dangerous missions until destiny made them partners for life. Reference: cherry blossoms, shared ramen, training under moonlight." },
      { type: "guest", label: "Guest Greeting", icon: "👤",
        content: "Warm ninja-themed personal greeting to {{GUEST_NAME}}. Something like: 'A scroll has arrived for you, chosen shinobi...'" },
      { type: "venue", label: "Date & Venue", icon: "📅",
        content: "Venue details with ninja atmosphere. Dresscode: Traditional Japanese / Ninja-inspired elegance. Include countdown." },
      { type: "message", label: "Leave a Wish", icon: "🕊️",
        content: "Guest wish section. Placeholder: 'Inscribe your blessing on this scroll...' Button: 'Deliver the Scroll ✦'" },
    ],
  },
  {
    id: "tunisian",
    label: "🇹🇳 Sidi Bou Said Romance",
    style: "tunisian",
    language: "ar",
    theme: `زفاف تونسي فاخر مستوحى من أجواء سيدي بو سعيد.

المشهد: شوارع سيدي بو سعيد الضيقة عند الغروب. أبواب زرقاء خشبية مضيئة. أشجار الياسمين تتدلى من الجدران البيضاء. فوانيس عربية ذهبية تضيء الليل. البحر الأبيض المتوسط يلمع في الخلفية. زخارف أرابيسك ذهبية. الفانوس الرمضاني.`,
    sections: [
      { type: "hero", label: "الغلاف", icon: "🎨",
        content: "غلاف رومانسي تونسي. اقتباس شعري عن الحب والجمال. زخارف إسلامية ذهبية." },
      { type: "story", label: "قصة الحب", icon: "💌",
        content: "قصة لقائهما في شوارع سيدي بو سعيد. تحت شجرة الياسمين. رائحة البحر والحب الأول." },
      { type: "welcome", label: "رسالة الترحيب", icon: "🤝",
        content: "رسالة حارة ترحب بالضيوف بأسلوب تونسي أصيل. شعر وعاطفة." },
      { type: "guest", label: "تحية الضيف", icon: "👤",
        content: "رسالة شخصية لـ {{GUEST_NAME}}. بأسلوب عربي راقي وعاطفي." },
      { type: "venue", label: "التفاصيل", icon: "📅",
        content: "تفاصيل الحفل. قواعد اللباس: الأزياء التونسية التقليدية أو الأبيض والذهبي." },
      { type: "message", label: "أتركوا تمنياتكم", icon: "🕊️",
        content: "صندوق تمنيات الضيوف. بأسلوب شعري عربي." },
    ],
  },
  {
    id: "fantasy",
    label: "🧝 Enchanted Forest Fantasy",
    style: "fantasy",
    language: "en",
    theme: `A magical fantasy wedding in an enchanted ancient forest at twilight.

Visual: Massive ancient trees with glowing bioluminescent fireflies. Magic particles floating through misty air. A stone archway covered in luminous flowers serves as the altar. Moonlight filtering through the forest canopy creating god rays. Crystal-clear stream reflecting the magical light. Two silhouettes in elegant fantasy attire standing beneath a sacred tree.`,
    sections: [
      { type: "hero", label: "Cover", icon: "🎨",
        content: "Enchanted fantasy cover. Quote: 'In a world of magic, we found each other.' Mystical and romantic." },
      { type: "story", label: "Our Tale", icon: "💌",
        content: "Their love story as a fairytale. Two souls destined to meet in a magical world. Poetic and whimsical." },
      { type: "guest", label: "Your Invitation", icon: "👤",
        content: "Fantasy greeting for {{GUEST_NAME}}. Something like: 'A magical summons has arrived for you...'" },
      { type: "details", label: "The Ceremony", icon: "📅",
        content: "Event details. Dresscode: Enchanted garden / Fantasy elegance. Include countdown timer." },
      { type: "rsvp", label: "RSVP", icon: "✅",
        content: "RSVP section. Placeholder: 'Cast your spell of attendance...' Button: 'Accept the Invitation ✦'" },
      { type: "message", label: "Leave a Wish", icon: "🕊️",
        content: "Wish section with magical theme. Placeholder: 'Write your enchantment here...'" },
    ],
  },
  {
    id: "french",
    label: "🇫🇷 Parisian Elegance",
    style: "french",
    language: "fr",
    theme: `Un mariage parisien élégant et intemporel.

Scène visuelle: Paris au crépuscule. La Tour Eiffel illuminée en arrière-plan. Rue pavée romantique avec des réverbères anciens. Roses rouges et blanches. Champagne doré. Architecture haussmannienne avec des balcons fleuris. Lumière dorée du soir filtrant à travers les feuilles des platanes.`,
    sections: [
      { type: "hero", label: "Couverture", icon: "🎨",
        content: "Couverture élégante parisienne. Citation: 'L'amour est la poésie des sens.' Romantique et raffiné." },
      { type: "story", label: "Notre Histoire", icon: "💌",
        content: "Leur histoire d'amour à Paris. Un café par hasard, un regard, et tout a changé. Poétique et français." },
      { type: "guest", label: "Invitation Personnelle", icon: "👤",
        content: "Message personnel pour {{GUEST_NAME}}. Élégant et chaleureux en français." },
      { type: "venue", label: "La Cérémonie", icon: "📅",
        content: "Détails de l'événement. Tenue: Élégance française, chic et classique. Compte à rebours." },
      { type: "message", label: "Votre Message", icon: "🕊️",
        content: "Section message. Placeholder: 'Laissez vos vœux les plus doux...' Bouton: 'Envoyer avec amour ♡'" },
    ],
  },
  {
    id: "royal",
    label: "👑 Royal Palace Wedding",
    style: "royal",
    language: "en",
    theme: `An ultra-luxury royal palace wedding with imperial grandeur.

Visual scene: Majestic marble palace at golden hour. Grand pillars with climbing roses. Crystal chandeliers visible through tall arched windows. Guards of honor in ceremonial uniforms lining the entrance. A red carpet leading to ornate golden doors. Rose petals scattered. Fireworks beginning to light the evening sky. Pure opulence and regal atmosphere.`,
    sections: [
      { type: "hero", label: "Royal Cover", icon: "🎨",
        content: "Majestic royal cover with crown motif. Quote: 'A royal union for eternity.' Imperial and grand." },
      { type: "welcome", label: "Royal Welcome", icon: "🤝",
        content: "Grand welcome message from the royal couple. Formal and dignified yet warm." },
      { type: "guest", label: "Royal Summons", icon: "👤",
        content: "Formal royal invitation to {{GUEST_NAME}}. Like a royal decree: 'By royal decree, your presence is requested...'" },
      { type: "venue", label: "The Grand Ceremony", icon: "📅",
        content: "Venue details with royal grandeur. Dresscode: Black tie / Royal formal. Countdown timer." },
      { type: "dresscode", label: "Dress Code", icon: "👗",
        content: "Elaborate dress code guidance. Men: Morning suit or military dress uniform. Women: Ball gown or formal evening wear." },
      { type: "message", label: "Royal Message Book", icon: "🕊️",
        content: "Guest messages. Placeholder: 'Inscribe your blessing in the royal book...' Button: 'Submit to the Royal Court'" },
    ],
  },
];

// ── Invitation selector ────────────────────────────────────────────────────
interface InvitationOption {
  id: string; title: string; coupleName?: string;
  slug: string; eventDate: string; venue: string;
}

// ── Copy button ────────────────────────────────────────────────────────────
function CopyBtn({ text, label = "Copy" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={copy}
      className={`flex items-center gap-1.5 px-3 py-1.5 text-xs border transition-all ${copied ? "border-green-500/50 text-green-400 bg-green-500/10" : "border-gold/25 text-gold/60 hover:border-gold/50 hover:text-gold"}`}>
      {copied ? <><Check size={11} /> Copied!</> : <><Copy size={11} /> {label}</>}
    </button>
  );
}

// ── Prompt card ────────────────────────────────────────────────────────────
function PromptCard({ prompt, invitations, onTest }: {
  prompt: typeof TEST_PROMPTS[0];
  invitations: InvitationOption[];
  onTest: (prompt: typeof TEST_PROMPTS[0], invitationId: string) => void;
}) {
  const [expanded, setExpanded]       = useState(false);
  const [selectedInv, setSelectedInv] = useState(invitations[0]?.id || "");

  const fullPromptText = [
    `THEME:\n${prompt.theme}`,
    `\nSECTIONS:\n${prompt.sections.map(s => `SECTION — ${s.label.toUpperCase()}\n${s.content}`).join("\n\n")}`,
  ].join("\n\n");

  return (
    <div className="border border-gold/15 bg-gold/[0.02] overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="flex-1">
          <p className="text-sm text-cream/90 font-medium">{prompt.label}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[9px] uppercase tracking-[0.15em] px-1.5 py-0.5 border border-gold/20 text-gold/50">
              {prompt.style}
            </span>
            <span className="text-[9px] uppercase tracking-[0.15em] px-1.5 py-0.5 border border-blue-500/20 text-blue-400/60">
              {prompt.language}
            </span>
            <span className="text-[9px] text-cream/30">{prompt.sections.length} sections</span>
          </div>
        </div>
        <button onClick={() => setExpanded(!expanded)}
          className="text-cream/30 hover:text-cream transition-colors p-1">
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div className="border-t border-gold/8"
            initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}>

            {/* Theme description */}
            <div className="px-4 py-3 border-b border-gold/8">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] uppercase tracking-[0.2em] text-gold/50">Theme Description</p>
                <CopyBtn text={prompt.theme} label="Copy theme" />
              </div>
              <pre className="text-xs text-cream/60 leading-relaxed whitespace-pre-wrap font-sans">{prompt.theme}</pre>
            </div>

            {/* Sections */}
            <div className="px-4 py-3 border-b border-gold/8">
              <p className="text-[10px] uppercase tracking-[0.2em] text-gold/50 mb-2">Sections ({prompt.sections.length})</p>
              <div className="space-y-2">
                {prompt.sections.map((s, i) => (
                  <div key={i} className="bg-cream/[0.03] border border-gold/10 px-3 py-2">
                    <p className="text-xs font-medium text-cream/80 mb-1">{s.icon} {s.label}</p>
                    <p className="text-[10px] text-cream/45 leading-relaxed">{s.content}</p>
                    <div className="mt-1.5"><CopyBtn text={s.content} label="Copy" /></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Copy full prompt */}
            <div className="px-4 py-3 border-b border-gold/8 flex items-center gap-3">
              <CopyBtn text={fullPromptText} label="Copy full prompt" />
              <p className="text-[10px] text-cream/30">Paste into AI Design Studio sections</p>
            </div>

            {/* Test with invitation */}
            <div className="px-4 py-3">
              <p className="text-[10px] uppercase tracking-[0.2em] text-gold/50 mb-2">Test with Invitation</p>
              {invitations.length === 0 ? (
                <p className="text-xs text-cream/30">No published invitations — publish one first</p>
              ) : (
                <div className="flex gap-2">
                  <select value={selectedInv} onChange={e => setSelectedInv(e.target.value)}
                    className="flex-1 bg-gold/[0.04] border border-gold/20 text-cream text-xs px-3 py-2 outline-none">
                    {invitations.map(inv => (
                      <option key={inv.id} value={inv.id} className="bg-[#0D0B08]">
                        {inv.coupleName || inv.title}
                      </option>
                    ))}
                  </select>
                  <button onClick={() => onTest(prompt, selectedInv)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-gold text-deep text-xs uppercase tracking-[0.15em] hover:bg-gold-light transition-colors">
                    <Play size={11} /> Generate
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Test result ────────────────────────────────────────────────────────────
function TestResult({ result, invitations }: {
  result: { loading: boolean; error: string; data: Record<string, unknown> | null; invitationSlug: string };
  invitations: InvitationOption[];
}) {
  if (result.loading) return (
    <div className="border border-gold/15 p-6 text-center">
      <div className="flex items-center justify-center gap-2 text-gold animate-pulse">
        <Sparkles size={16} />
        <span className="text-sm">Generating invitation + scene image…</span>
      </div>
      <div className="mt-4 h-px bg-gold/15 overflow-hidden">
        <motion.div className="h-full bg-gold" animate={{ x: ["-100%", "200%"] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }} />
      </div>
    </div>
  );

  if (result.error) return (
    <div className="border border-red-500/25 bg-red-500/5 p-4 text-sm text-red-400">
      ❌ {result.error}
    </div>
  );

  if (!result.data) return null;

  const { pollinationsUrl, imagePrompt, spec } = result.data as {
    pollinationsUrl?: string; imagePrompt?: string; spec?: { theme?: { name?: string } };
  };

  const inv = invitations.find(i => i.slug === result.invitationSlug);
  const viewUrl = inv ? `/i/${inv.slug}` : null;

  return (
    <motion.div className="border border-green-500/25 bg-green-500/5 overflow-hidden"
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>

      <div className="p-4 border-b border-green-500/15">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Check size={14} className="text-green-400" />
            <span className="text-sm text-green-400 font-medium">Generated: {spec?.theme?.name || "Invitation"}</span>
          </div>
          {viewUrl && (
            <a href={viewUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gold text-deep text-xs uppercase tracking-[0.15em] hover:bg-gold-light transition-colors">
              <ExternalLink size={11} /> View Invitation
            </a>
          )}
        </div>
      </div>

      {/* Image preview */}
      {pollinationsUrl && (
        <div className="border-b border-green-500/15 p-3">
          <div className="flex items-center gap-2 mb-2">
            <Image size={12} className="text-gold/60" />
            <p className="text-[10px] uppercase tracking-[0.15em] text-gold/60">Generated Scene Image</p>
            <CopyBtn text={pollinationsUrl} label="Copy URL" />
          </div>
          <div className="relative overflow-hidden" style={{ height: 200 }}>
            <img src={pollinationsUrl} alt="Generated scene"
              className="w-full h-full object-cover object-top"
              style={{ filter: "brightness(0.9)" }}
              onError={e => { (e.target as HTMLImageElement).parentElement!.style.display = "none"; }} />
            <p className="absolute bottom-2 left-2 text-[10px] text-white/50 bg-black/40 px-2 py-1">
              flux-pro • loading may take ~15s
            </p>
          </div>
        </div>
      )}

      {/* Image prompt */}
      {imagePrompt && (
        <div className="p-3 border-b border-green-500/15">
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-[10px] uppercase tracking-[0.15em] text-gold/50">Image Prompt Generated</p>
            <CopyBtn text={imagePrompt} label="Copy prompt" />
          </div>
          <p className="text-xs text-cream/50 leading-relaxed">{imagePrompt}</p>
        </div>
      )}

      {/* Raw spec preview */}
      <div className="p-3">
        <div className="flex items-center justify-between mb-1.5">
          <p className="text-[10px] uppercase tracking-[0.15em] text-gold/50">Raw Spec JSON</p>
          <CopyBtn text={JSON.stringify(result.data, null, 2)} label="Copy JSON" />
        </div>
        <pre className="text-[10px] text-cream/30 overflow-auto max-h-40 leading-relaxed">
          {JSON.stringify(result.data, null, 2).slice(0, 800)}…
        </pre>
      </div>
    </motion.div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────
export function LabClient({ invitations }: { invitations: InvitationOption[] }) {
  const [result, setResult] = useState<{
    loading: boolean; error: string;
    data: Record<string, unknown> | null; invitationSlug: string;
  }>({ loading: false, error: "", data: null, invitationSlug: "" });

  const [customTheme, setCustomTheme]     = useState("");
  const [customSections, setCustomSections] = useState("");
  const [customStyle, setCustomStyle]     = useState("custom");
  const [customLang, setCustomLang]       = useState<"en"|"fr"|"ar">("en");
  const [customInv, setCustomInv]         = useState(invitations[0]?.id || "");

  const runTest = async (prompt: typeof TEST_PROMPTS[0], invitationId: string) => {
    const inv = invitations.find(i => i.id === invitationId);
    if (!inv) return;

    setResult({ loading: true, error: "", data: null, invitationSlug: inv.slug });

    const sectionText = prompt.sections
      .map(s => `SECTION — ${s.label.toUpperCase()} (${s.type})\n${s.content}`)
      .join("\n\n");

    const additionalDetails = `THEME:\n${prompt.theme}\n\nSECTIONS TO INCLUDE:\n${sectionText}`;

    try {
      const res = await fetch("/api/ai/design", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invitationId,
          coupleName: inv.coupleName || inv.title,
          eventDate:  inv.eventDate,
          venue:      inv.venue,
          language:   prompt.language,
          style:      prompt.style,
          additionalDetails,
        }),
      });
      const data = await res.json() as Record<string, unknown>;
      if (!res.ok) throw new Error((data.detail as string) || "Failed");
      setResult({ loading: false, error: "", data, invitationSlug: inv.slug });
    } catch (err) {
      setResult({ loading: false, error: err instanceof Error ? err.message : "Error", data: null, invitationSlug: inv.slug });
    }
  };

  const runCustom = async () => {
    const inv = invitations.find(i => i.id === customInv);
    if (!inv || !customTheme.trim()) return;
    const fakePrompt = {
      ...TEST_PROMPTS[0],
      style: customStyle,
      language: customLang,
      theme: customTheme,
      sections: customSections ? [{
        type: "custom", label: "Custom", icon: "✨",
        content: customSections,
      }] : [],
    };
    await runTest(fakePrompt, customInv);
  };

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-8 max-w-5xl">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <Zap size={18} className="text-gold" />
            <h1 className="font-cormorant text-2xl sm:text-3xl font-light text-cream">Design Lab</h1>
          </div>
          <p className="text-sm text-cream/40">
            Test AI generation with pre-built prompts. Copy, paste, and experiment.
          </p>
          {invitations.length === 0 && (
            <div className="mt-3 px-4 py-2.5 border border-yellow-500/30 bg-yellow-500/5 text-xs text-yellow-400">
              ⚠ No published invitations found. Publish an invitation first to test generation.
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Left: Pre-built prompts */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Globe size={14} className="text-gold/60" />
              <p className="text-[10px] uppercase tracking-[0.25em] text-gold/60">Pre-Built Test Prompts</p>
            </div>
            <div className="space-y-2">
              {TEST_PROMPTS.map(prompt => (
                <PromptCard key={prompt.id} prompt={prompt} invitations={invitations} onTest={runTest} />
              ))}
            </div>
          </div>

          {/* Right: Custom prompt + results */}
          <div className="space-y-4">

            {/* Custom prompt builder */}
            <div className="border border-gold/20 p-4 space-y-3">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles size={14} className="text-gold" />
                <p className="text-[10px] uppercase tracking-[0.25em] text-gold/60">Custom Prompt Builder</p>
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-[0.15em] text-gold/50 block mb-1.5">Theme Description</label>
                <textarea value={customTheme} onChange={e => setCustomTheme(e.target.value)} rows={6}
                  placeholder="Describe your theme in detail. E.g: A Naruto-inspired wedding in the Hidden Leaf Village at sunset. Cherry blossoms everywhere. The couple in ninja attire. Hokage mountain carvings in background. Lanterns floating upward. Magical chakra particles glowing..."
                  className="w-full bg-gold/[0.04] border border-gold/20 text-cream text-xs px-3 py-2.5 outline-none resize-none placeholder:text-cream/20 focus:border-gold/40 leading-relaxed" />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-[0.15em] text-gold/50 block mb-1.5">Sections (optional — one per line)</label>
                <textarea value={customSections} onChange={e => setCustomSections(e.target.value)} rows={3}
                  placeholder={"HERO: Epic cover with couple names\nSTORY: Their ninja love story\nGUEST: Personal scroll for {{GUEST_NAME}}\nVENUE: Hidden Leaf ceremony details\nMESSAGE: Inscribe your blessing"}
                  className="w-full bg-gold/[0.04] border border-gold/20 text-cream text-xs px-3 py-2.5 outline-none resize-none placeholder:text-cream/20 focus:border-gold/40 leading-relaxed font-mono" />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-gold/50 block mb-1">Style</label>
                  <input value={customStyle} onChange={e => setCustomStyle(e.target.value)}
                    placeholder="anime / tunisian / royal / fantasy"
                    className="w-full bg-gold/[0.04] border border-gold/20 text-cream text-xs px-2.5 py-2 outline-none focus:border-gold/40" />
                </div>
                <div>
                  <label className="text-[10px] text-gold/50 block mb-1">Language</label>
                  <select value={customLang} onChange={e => setCustomLang(e.target.value as "en"|"fr"|"ar")}
                    className="w-full bg-gold/[0.04] border border-gold/20 text-cream text-xs px-2.5 py-2 outline-none">
                    <option value="en" className="bg-[#0D0B08]">English</option>
                    <option value="fr" className="bg-[#0D0B08]">Français</option>
                    <option value="ar" className="bg-[#0D0B08]">العربية</option>
                  </select>
                </div>
              </div>

              {invitations.length > 0 && (
                <div>
                  <label className="text-[10px] text-gold/50 block mb-1">Target Invitation</label>
                  <select value={customInv} onChange={e => setCustomInv(e.target.value)}
                    className="w-full bg-gold/[0.04] border border-gold/20 text-cream text-xs px-2.5 py-2 outline-none">
                    {invitations.map(inv => (
                      <option key={inv.id} value={inv.id} className="bg-[#0D0B08]">
                        {inv.coupleName || inv.title}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <button onClick={runCustom}
                disabled={result.loading || !customTheme.trim() || invitations.length === 0}
                className="w-full py-3 bg-gradient-to-r from-gold to-[#A8893A] text-deep text-xs uppercase tracking-[0.2em] font-medium hover:brightness-110 transition-all disabled:opacity-40 flex items-center justify-center gap-2">
                {result.loading ? <><RefreshCw size={12} className="animate-spin" /> Generating…</> : <><Play size={12} /> Generate Custom Invitation</>}
              </button>
            </div>

            {/* Results */}
            <TestResult result={result} invitations={invitations} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
