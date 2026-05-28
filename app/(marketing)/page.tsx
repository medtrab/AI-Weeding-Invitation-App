"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { VibeGeneratorSection } from "@/components/marketing/VibeGeneratorSection";

function ParticleField() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    for (let i = 0; i < 35; i++) {
      const p = document.createElement("div");
      const s = Math.random() < 0.3 ? 2 : 1;
      p.style.cssText = `position:absolute;width:${s}px;height:${s}px;background:#C9A84C;border-radius:50%;left:${Math.random()*100}%;animation:particleFloat ${8+Math.random()*12}s linear ${Math.random()*10}s infinite;opacity:0;`;
      el.appendChild(p);
    }
  }, []);
  return <div ref={ref} className="absolute inset-0 pointer-events-none overflow-hidden" />;
}

function FloatingCard() {
  return (
    <motion.div
      className="absolute right-[8%] top-1/2 -translate-y-1/2 w-[240px] hidden xl:block"
      initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:1.2, delay:0.6 }}
    >
      <motion.div animate={{ y:[0,-12,0], rotate:[-2,-1,-2] }} transition={{ duration:6, repeat:Infinity, ease:"easeInOut" }}>
        <div className="relative bg-gradient-to-br from-[#1A160E] to-[#2A2218] border border-gold/25 p-8 text-center">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
          <div className="absolute inset-[10px] border border-gold/10 pointer-events-none" />
          <p className="font-cormorant text-2xl text-gold/70 mb-2">✦</p>
          <p className="font-cormorant text-xl font-light text-cream leading-tight">
            Sofia<span className="block italic text-gold text-2xl">&</span>Élias
          </p>
          <div className="my-3 flex items-center gap-3">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-gold/30" />
            <div className="w-1.5 h-1.5 bg-gold/70 rotate-45" />
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-gold/30" />
          </div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-cream/45">September 12 · 2025</p>
          <p className="text-[10px] uppercase tracking-[0.15em] text-cream/30 mt-1">Villa Majestic, Paris</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

const PROMPTS = [
  { label:"Arabic Wedding",  text:"Luxury Arabic wedding with gold calligraphy and romantic animations" },
  { label:"Engagement",      text:"Minimalist white and champagne engagement invitation"               },
  { label:"Corporate Gala",  text:"Elegant corporate gala with midnight blue and silver accents"      },
  { label:"Birthday",        text:"Whimsical garden birthday party with floral illustrations"         },
  { label:"Graduation",      text:"Modern graduation celebration with gold and black theme"            },
];

const STATUS_MSGS = ["Analyzing your style…","Choosing color palette…","Crafting invitation text…","Selecting animations…","Finalizing your design…"];

interface AIResult {
  themeName: string; conceptLine?: string; invitationText: string;
  musicSuggestion: string; decorativeStyle?: string; colorPalette: Record<string,string>;
  colorStory?: string; uniqueFeature?: string;
}

function AIGenerator() {
  const [prompt, setPrompt]   = useState(PROMPTS[0].text);
  const [active, setActive]   = useState(0);
  const [loading, setLoading] = useState(false);
  const [statusIdx, setStatusIdx] = useState(0);
  const [result, setResult]   = useState<AIResult | null>(null);

  const generate = async () => {
    setLoading(true); setResult(null); setStatusIdx(0);
    const iv = setInterval(() => setStatusIdx((i) => Math.min(i+1, STATUS_MSGS.length-1)), 520);
    try {
      const res  = await fetch("/api/ai/generate", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ prompt }) });
      const text = await res.text();
      if (!text) throw new Error("Empty response from AI");
      const data = JSON.parse(text);
      if (res.ok) setResult(data);
      else console.error("AI error:", data.detail);
    } catch (err) {
      console.error("Generate error:", err);
    } finally { clearInterval(iv); setLoading(false); }
  };

  return (
    <section id="ai-gen" className="py-28 bg-gradient-to-b from-deep to-[#100E0A]">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div className="text-center mb-14" initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}>
          <p className="text-[11px] uppercase tracking-[0.35em] text-gold mb-4">AI Generator</p>
          <h2 className="font-cormorant text-[clamp(2.2rem,4vw,3.5rem)] font-light leading-tight">
            Describe your dream,<br /><em className="italic text-gold">we craft the invitation</em>
          </h2>
        </motion.div>

        <motion.div className="bg-gold/[0.04] border border-gold/25 p-6 mb-4"
          initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}>
          <span className="text-[10px] uppercase tracking-[0.2em] text-gold block mb-4">Choose a style</span>
          <div className="flex flex-wrap gap-2 mb-5">
            {PROMPTS.map((p, i) => (
              <button key={p.label} onClick={() => { setActive(i); setPrompt(p.text); }}
                className={`px-4 py-2 text-xs tracking-[0.1em] border transition-all ${i===active ? "border-gold text-gold bg-gold/10" : "border-gold/20 text-cream/50 hover:border-gold/50"}`}>
                {p.label}
              </button>
            ))}
          </div>
          <div className="border-t border-gold/15 pt-4">
            <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} rows={3}
              className="w-full bg-transparent text-cream text-sm outline-none resize-none placeholder:text-cream/20 tracking-wide leading-relaxed"
              placeholder="Describe your event style, colors, mood, cultural elements…" />
          </div>
        </motion.div>

        <button onClick={generate} disabled={loading}
          className="w-full py-4 bg-gradient-to-r from-gold to-[#A8893A] text-deep text-xs uppercase tracking-[0.25em] font-medium hover:brightness-110 transition-all disabled:opacity-60">
          {loading ? STATUS_MSGS[statusIdx] : "✦ Generate with AI ✦"}
        </button>

        <AnimatePresence>
          {result && !loading && (
            <motion.div className="mt-6 grid grid-cols-2 gap-3" initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}>
              <ResultCell label="Theme Name">
                <p className="font-cormorant text-xl font-light text-cream">{result.themeName}</p>
              </ResultCell>
              <ResultCell label="Color Palette">
                <div className="flex gap-2 mt-1">
                  {Object.values(result.colorPalette).slice(0,5).map((c,i) => (
                    <div key={i} className="w-7 h-7 rounded-full" style={{ background: c }} />
                  ))}
                </div>
              </ResultCell>
              {result.conceptLine && (
                <ResultCell label="Concept" className="col-span-2">
                  <p className="text-sm text-cream/70 italic leading-relaxed">{result.conceptLine}</p>
                </ResultCell>
              )}
              <ResultCell label="Invitation Text" className="col-span-2">
                <p className="font-cormorant text-base italic text-cream/70 leading-relaxed">{result.invitationText}</p>
              </ResultCell>
              {result.colorStory && (
                <ResultCell label="Color Story" className="col-span-2">
                  <p className="text-xs text-cream/55 leading-relaxed">{result.colorStory}</p>
                </ResultCell>
              )}
              <ResultCell label="Music">
                <p className="text-sm text-cream/80">{result.musicSuggestion}</p>
              </ResultCell>
              {result.uniqueFeature && (
                <ResultCell label="Signature Detail">
                  <p className="text-xs text-cream/70 leading-relaxed">{result.uniqueFeature}</p>
                </ResultCell>
              )}
              <div className="col-span-2 flex gap-3 pt-2">
                <Link href="/register" className="flex-1 py-3 bg-gold text-deep text-xs uppercase tracking-[0.2em] font-medium text-center hover:bg-gold-light transition-colors">
                  Use This Theme
                </Link>
                <button onClick={generate} className="flex-1 py-3 border border-gold/30 text-gold text-xs uppercase tracking-[0.2em] hover:bg-gold/10 transition-colors">
                  Generate Again
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

function ResultCell({ label, children, className="" }: { label:string; children:React.ReactNode; className?:string }) {
  return (
    <div className={`bg-gold/[0.04] border border-gold/20 p-4 ${className}`}>
      <span className="text-[10px] uppercase tracking-[0.2em] text-gold block mb-2">{label}</span>
      {children}
    </div>
  );
}

function StatsBar() {
  return (
    <div className="border-t border-b border-gold/10 bg-gold/[0.03] py-10">
      <div className="flex justify-center gap-12 flex-wrap max-w-3xl mx-auto px-6">
        {[
          { num:"24K+", label:"Invitations Created"  },
          { num:"98%",  label:"Guest Open Rate"       },
          { num:"60+",  label:"Premium Themes"        },
          { num:"3",    label:"Languages Supported"   },
        ].map((s) => (
          <div key={s.label} className="text-center">
            <div className="font-cormorant text-3xl font-light text-gold">{s.num}</div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-cream/35 mt-1">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

const FEATURES = [
  { icon:"✦", title:"AI Text Generator",    desc:"Generate invitation wording in English, French, and Arabic. Romantic, formal, luxury, or religious styles." },
  { icon:"◈", title:"Drag & Drop Builder",  desc:"Intuitive editor with hero, gallery, maps, RSVP, countdown sections. No design experience needed."          },
  { icon:"♪", title:"Background Music",     desc:"Curated music library with elegant fade effects. Set the perfect ambiance for your invitation."              },
  { icon:"⟡", title:"RSVP Analytics",       desc:"Real-time dashboard with guest counts, attendance charts, meal preferences, and response tracking."          },
  { icon:"◉", title:"QR & WhatsApp Share",  desc:"One-click WhatsApp sharing with auto-generated QR codes. Optimized for mobile-first guest experiences."      },
  { icon:"⬡", title:"Guest Personalization",desc:"Personalize each invitation with the guest's name. Individual links that greet each person uniquely."        },
];

const PLANS = [
  { badge:"Free",         name:"Essentials", price:0,  period:"forever", featured:false, cta:"Get Started Free",
    features:["1 invitation / month","5 basic themes","RSVP up to 50 guests","Invité watermark","Basic animations"] },
  { badge:"Most Popular", name:"Luxe",       price:19, period:"month",   featured:true,  cta:"Start 14-Day Trial",
    features:["Unlimited invitations","All 60+ premium themes","Unlimited guests","No watermark","AI text generation","Music library","Full analytics","QR codes & custom links"] },
  { badge:"Enterprise",   name:"Studio",     price:79, period:"month",   featured:false, cta:"Contact Sales",
    features:["Everything in Luxe","Wedding planner accounts","White-label branding","AI video generation","AI voice narration","Seat management & QR tickets","Priority support"] },
];

export default function LandingPage() {
  return (
    <div className="bg-deep text-cream min-h-screen">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 backdrop-blur-xl bg-deep/70 border-b border-gold/10">
        <span className="font-cormorant text-xl font-light tracking-[0.15em] text-gold uppercase">Invité</span>
        <div className="hidden md:flex gap-6 text-[11px] uppercase tracking-[0.15em]">
          {[["#ai-gen","Generator"],["#vibe","AI Themes"],["#themes","Templates"],["#features","Features"],["#pricing","Pricing"]].map(([href,label]) => (
            <a key={href} href={href} className="text-cream/50 hover:text-gold transition-colors">{label}</a>
          ))}
        </div>
        <Link href="/login" className="px-5 py-2 border border-gold/40 text-gold text-[11px] uppercase tracking-[0.15em] hover:bg-gold hover:text-deep transition-all">
          Sign In
        </Link>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center text-center px-6 pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gold/[0.04] rounded-full blur-3xl" />
        </div>
        <ParticleField />
        <div className="relative z-10 max-w-4xl">
          <motion.p className="text-[11px] uppercase tracking-[0.35em] text-gold mb-6" initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.9 }}>
            AI-Powered Event Invitations
          </motion.p>
          <motion.h1 className="font-cormorant text-[clamp(3rem,7vw,6.5rem)] font-light leading-[1.05] mb-6" initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.9, delay:0.15 }}>
            Invitations that<br /><em className="italic text-gold">move hearts</em>
          </motion.h1>
          <motion.p className="text-sm text-cream/50 max-w-md mx-auto mb-10 leading-relaxed tracking-wide" initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.9, delay:0.3 }}>
            Describe a song, a mood, a memory. Our AI creates three full invitation worlds — with unique visual concepts, animations, typography, and music.
          </motion.p>
          <motion.div className="flex gap-4 justify-center flex-wrap" initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.9, delay:0.45 }}>
            <Link href="/register" className="px-10 py-4 bg-gold text-deep text-xs uppercase tracking-[0.25em] font-medium hover:bg-gold-light transition-all active:scale-[0.97]">
              Create Your Invitation
            </Link>
            <a href="#vibe" className="px-10 py-4 border border-cream/20 text-cream text-xs uppercase tracking-[0.25em] hover:border-gold hover:text-gold transition-all">
              Try AI Themes
            </a>
          </motion.div>
        </div>
        <FloatingCard />
      </section>

      <StatsBar />
      <AIGenerator />

      {/* Vibe Generator section */}
      <div id="vibe">
        <VibeGeneratorSection />
      </div>

      {/* Themes */}
      <section id="themes" className="py-28 bg-[#0A0906]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-[11px] uppercase tracking-[0.35em] text-gold mb-4">Theme Collection</p>
            <h2 className="font-cormorant text-[clamp(2.2rem,4vw,3.5rem)] font-light">Curated templates for<br /><em className="italic text-gold">every occasion</em></h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-gold/15">
            {[
              { name:"Al-Andalus Gold",bg:"from-[#1A1308] to-[#0D0B06]",text:"#F5E4B0",accent:"#C9A84C",sub:"Arabic · Luxury"  },
              { name:"Celestial Blue", bg:"from-[#0F1520] to-[#080A10]",text:"#E8F0FA",accent:"#7A9ACC",sub:"European · Minimal"},
              { name:"Rosa Eterna",    bg:"from-[#1A0808] to-[#0D0606]",text:"#FAE8E8",accent:"#CC6666",sub:"Italian · Romantic" },
              { name:"Jardin Secret",  bg:"from-[#0A1510] to-[#060A08]",text:"#E8F5EE",accent:"#4A9468",sub:"Garden · Botanical" },
            ].map((t, i) => (
              <motion.div key={t.name} className="group relative overflow-hidden cursor-pointer"
                initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:i*0.08 }}>
                <div className={`h-52 bg-gradient-to-br ${t.bg} flex flex-col items-center justify-center p-6 relative`}>
                  <p className="font-cormorant text-lg font-light mb-2" style={{ color:t.text }}>{t.name}</p>
                  <div className="w-8 h-px my-1" style={{ background:t.accent, opacity:0.6 }} />
                  <p className="text-[10px] uppercase tracking-[0.15em]" style={{ color:t.text, opacity:0.4 }}>{t.sub}</p>
                  <div className="absolute inset-0 bg-gold/[0.06] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Link href="/register" className="px-5 py-2 border border-gold text-gold text-[11px] uppercase tracking-[0.2em] bg-deep/80 hover:bg-gold hover:text-deep transition-all">
                      Use Theme
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/register" className="px-8 py-3 border border-cream/15 text-cream/50 text-xs uppercase tracking-[0.2em] hover:border-gold hover:text-gold transition-all">
              Browse All 60+ Themes →
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-28 bg-gradient-to-b from-[#0A0906] to-deep">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-[11px] uppercase tracking-[0.35em] text-gold mb-4">Platform Features</p>
            <h2 className="font-cormorant text-[clamp(2.2rem,4vw,3.5rem)] font-light">Everything you need,<br /><em className="italic text-gold">nothing less</em></h2>
          </div>
          <div className="grid md:grid-cols-3 gap-px bg-gold/10">
            {FEATURES.map((f, i) => (
              <motion.div key={f.title} className="bg-deep p-8 hover:bg-gold/[0.03] transition-colors"
                initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:i*0.08 }}>
                <div className="w-10 h-10 border border-gold/30 flex items-center justify-center mb-5 text-lg">{f.icon}</div>
                <h3 className="font-cormorant text-xl font-light mb-2">{f.title}</h3>
                <p className="text-xs text-cream/40 leading-relaxed tracking-wide">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-28 bg-[#080604]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-[11px] uppercase tracking-[0.35em] text-gold mb-4">Stories</p>
            <h2 className="font-cormorant text-[clamp(2.2rem,4vw,3.5rem)] font-light">Moments they'll<br /><em className="italic text-gold">remember</em></h2>
          </div>
          <div className="grid md:grid-cols-3 gap-px bg-gold/10">
            {[
              { q:"Our guests couldn't believe it was digital. The music started and people were genuinely moved — the most beautiful invitation they'd ever received.", name:"Yasmine Al-Hassan", event:"Wedding · Dubai 2024" },
              { q:"The AI generated our text in three languages perfectly. Family across France, Lebanon, and the UK all felt included. Our RSVP rate was 94%.",           name:"Pierre & Nour Lefèvre", event:"Wedding · Paris 2024" },
              { q:"Used Invité for our annual gala. The corporate theme was polished and professional. RSVP analytics made planning effortless.",                         name:"Sarah Mitchell", event:"Corporate Gala · London 2024" },
            ].map((t, i) => (
              <motion.div key={i} className="bg-[#080604] p-8" initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:i*0.1 }}>
                <div className="flex gap-1 mb-4">{Array.from({length:5}).map((_,j) => <span key={j} className="text-gold text-xs">★</span>)}</div>
                <p className="font-cormorant text-base italic text-cream/65 leading-relaxed mb-5">"{t.q}"</p>
                <p className="text-[11px] uppercase tracking-[0.15em] text-gold">{t.name}</p>
                <p className="text-[10px] text-cream/30 mt-0.5">{t.event}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-28 bg-deep">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-[11px] uppercase tracking-[0.35em] text-gold mb-4">Pricing</p>
            <h2 className="font-cormorant text-[clamp(2.2rem,4vw,3.5rem)] font-light">Simple, transparent<br /><em className="italic text-gold">pricing</em></h2>
          </div>
          <div className="grid md:grid-cols-3 gap-px bg-gold/15">
            {PLANS.map((plan, i) => (
              <motion.div key={plan.name} className={`p-8 ${plan.featured ? "bg-gradient-to-b from-[#1A1608] to-[#141009]" : "bg-deep"}`}
                initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:i*0.1 }}>
                <span className="text-[10px] uppercase tracking-[0.2em] text-gold border border-gold/40 px-3 py-1 inline-block mb-4">{plan.badge}</span>
                <h3 className="font-cormorant text-2xl font-light mb-1">{plan.name}</h3>
                <div className="mb-5">
                  <span className="font-cormorant text-5xl font-light text-gold">${plan.price}</span>
                  <span className="text-xs text-cream/30 ml-1">/ {plan.period}</span>
                </div>
                <div className="h-px bg-gold/15 mb-5" />
                <ul className="space-y-2.5 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-cream/50">
                      <div className="w-1 h-1 bg-gold/60 rotate-45 shrink-0" />{f}
                    </li>
                  ))}
                </ul>
                <Link href="/register" className={`block w-full text-center py-3 text-[11px] uppercase tracking-[0.2em] transition-all ${plan.featured ? "bg-gold text-deep hover:bg-gold-light" : "border border-gold/30 text-gold hover:bg-gold hover:text-deep"}`}>
                  {plan.cta}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#050402] border-t border-gold/10 py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <p className="font-cormorant text-2xl font-light tracking-[0.2em] text-gold uppercase mb-1">Invité</p>
            <p className="text-[10px] uppercase tracking-[0.2em] text-cream/25">Craft moments. Create memories.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            {[
              { title:"Product", links:[["#ai-gen","AI Generator"],["#vibe","AI Themes"],["#themes","Templates"],["#pricing","Pricing"]] },
              { title:"Events",  links:[["#","Weddings"],["#","Engagements"],["#","Birthdays"],["#","Corporate"]] },
              { title:"Company", links:[["#","About"],["#","Blog"],["#","Careers"]] },
              { title:"Legal",   links:[["#","Privacy"],["#","Terms"],["#","Cookies"]] },
            ].map(({ title, links }) => (
              <div key={title}>
                <h4 className="text-[10px] uppercase tracking-[0.2em] text-gold mb-4">{title}</h4>
                <ul className="space-y-2">
                  {links.map(([href,label]) => (
                    <li key={label}><a href={href} className="text-xs text-cream/30 hover:text-gold transition-colors">{label}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-gold/10 pt-6 flex justify-between items-center flex-wrap gap-2">
            <span className="text-[10px] text-cream/20">© 2025 Invité. All rights reserved.</span>
            <span className="text-[10px] text-cream/20">Made with love for the moments that matter.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
