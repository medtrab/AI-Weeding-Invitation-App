"use client";
import { useInvitationStore } from "@/stores/useInvitationStore";
import type { AnimationStyle } from "@/types";

const OPTIONS: { value: AnimationStyle; label: string; desc: string }[] = [
  { value:"elegant_fade",    label:"Elegant Fade",    desc:"Soft, cinematic reveals"     },
  { value:"floating_petals", label:"Floating Petals", desc:"Romantic petal particles"    },
  { value:"shimmer",         label:"Gold Shimmer",    desc:"Lustrous gold sparkles"       },
  { value:"parallax",        label:"Parallax Depth",  desc:"Layered scroll depth"         },
  { value:"confetti",        label:"Confetti Burst",  desc:"Joyful celebration burst"    },
  { value:"botanical",       label:"Botanical",       desc:"Organic leaf animations"      },
];

export function AnimationPicker() {
  const { invitation, updateField } = useInvitationStore();
  if (!invitation) return null;
  return (
    <div>
      <span className="text-[10px] uppercase tracking-[0.2em] text-cream/40 block mb-3">Animation Style</span>
      <div className="space-y-1">
        {OPTIONS.map((opt) => (
          <button key={opt.value} onClick={() => updateField("animationStyle", opt.value)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-all border ${
              invitation.animationStyle === opt.value
                ? "border-gold/50 bg-gold/10 text-cream"
                : "border-transparent hover:bg-cream/5 text-cream/50"
            }`}>
            <div className="flex-1">
              <p className="text-xs font-medium">{opt.label}</p>
              <p className="text-[10px] text-cream/30 mt-0.5">{opt.desc}</p>
            </div>
            {invitation.animationStyle === opt.value && <div className="w-1.5 h-1.5 bg-gold rounded-full" />}
          </button>
        ))}
      </div>
    </div>
  );
}
