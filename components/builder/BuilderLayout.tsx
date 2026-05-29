"use client";
import { useEffect, useState } from "react";
import { useInvitationStore } from "@/stores/useInvitationStore";
import { useAutoSave } from "@/hooks/useAutoSave";
import { BuilderToolbar } from "./BuilderToolbar";
import { BuilderSidebar } from "./BuilderSidebar";
import { BuilderCanvas } from "./BuilderCanvas";
import { BuilderPropertiesPanel } from "./BuilderPropertiesPanel";
import { ToastContainer } from "@/components/ui/Toast";
import { Layers, Monitor, SlidersHorizontal } from "lucide-react";
import type { Invitation } from "@/types";

type MobileTab = "sections" | "canvas" | "properties";

export function BuilderLayout({ invitation }: { invitation: Invitation }) {
  const { setInvitation } = useInvitationStore();
  const [mobileTab, setMobileTab] = useState<MobileTab>("canvas");
  useAutoSave(invitation.id);
  useEffect(() => { setInvitation(invitation); }, [invitation.id]);

  return (
    <div className="fixed inset-0 flex flex-col bg-[#0A0806] overflow-hidden">
      <BuilderToolbar />

      {/* ── Desktop: 3-panel layout ── */}
      <div className="hidden md:flex flex-1 overflow-hidden">
        <BuilderSidebar />
        <BuilderCanvas />
        <BuilderPropertiesPanel />
      </div>

      {/* ── Mobile: tab-based single panel ── */}
      <div className="flex md:hidden flex-1 overflow-hidden flex-col">
        <div className="flex-1 overflow-hidden relative">
          {mobileTab === "sections"   && <div className="absolute inset-0 overflow-y-auto"><BuilderSidebar /></div>}
          {mobileTab === "canvas"     && <div className="absolute inset-0 overflow-y-auto"><BuilderCanvas /></div>}
          {mobileTab === "properties" && <div className="absolute inset-0 overflow-y-auto"><BuilderPropertiesPanel /></div>}
        </div>

        {/* Mobile bottom tab bar */}
        <div className="flex border-t border-gold/10 bg-[#0D0B08] safe-area-bottom">
          {([
            { tab: "sections"   as MobileTab, icon: Layers,             label: "Sections"   },
            { tab: "canvas"     as MobileTab, icon: Monitor,            label: "Preview"    },
            { tab: "properties" as MobileTab, icon: SlidersHorizontal,  label: "Style"      },
          ] as const).map(({ tab, icon: Icon, label }) => (
            <button key={tab} onClick={() => setMobileTab(tab)}
              className={`flex-1 flex flex-col items-center gap-1 py-3 text-[10px] uppercase tracking-[0.1em] transition-colors ${
                mobileTab === tab ? "text-gold bg-gold/5" : "text-cream/30 hover:text-cream/60"
              }`}>
              <Icon size={18} />
              {label}
            </button>
          ))}
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}
