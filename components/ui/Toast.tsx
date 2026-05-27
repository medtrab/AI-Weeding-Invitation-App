"use client";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertCircle, Info, X } from "lucide-react";
import { useUIStore } from "@/stores/useUIStore";

const icons  = { success: CheckCircle, error: AlertCircle, info: Info };
const colors = {
  success: "border-emerald-500/30 text-emerald-400",
  error:   "border-red-500/30 text-red-400",
  info:    "border-gold/30 text-gold",
};

export function ToastContainer() {
  const { toasts, removeToast } = useUIStore();
  return (
    <div className="fixed bottom-6 right-6 z-[60] flex flex-col gap-2">
      <AnimatePresence mode="popLayout">
        {toasts.map((t) => (
          <Toast key={t.id} toast={t} onRemove={() => removeToast(t.id)} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function Toast({ toast, onRemove }: { toast: { id: string; type: "success"|"error"|"info"; message: string }; onRemove: () => void }) {
  const Icon = icons[toast.type];
  useEffect(() => { const t = setTimeout(onRemove, 4000); return () => clearTimeout(t); }, [onRemove]);
  return (
    <motion.div
      className={`flex items-center gap-3 px-4 py-3 bg-[#1A1610] border ${colors[toast.type]} min-w-[260px] max-w-sm`}
      initial={{ opacity: 0, x: 32, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 32, scale: 0.9 }}
    >
      <Icon size={16} className="shrink-0" />
      <p className="flex-1 text-sm text-cream/80 tracking-wide">{toast.message}</p>
      <button onClick={onRemove} className="text-cream/30 hover:text-cream/70"><X size={14} /></button>
    </motion.div>
  );
}
