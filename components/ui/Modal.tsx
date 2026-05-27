"use client";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface ModalProps {
  isOpen: boolean; onClose: () => void; title?: string; subtitle?: string;
  children: React.ReactNode; size?: "sm" | "md" | "lg"; className?: string;
}

export function Modal({ isOpen, onClose, title, subtitle, children, size = "md", className }: ModalProps) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <motion.div className="absolute inset-0 bg-black/80 backdrop-blur-md"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className={cn(
              "relative w-full z-10 bg-gradient-to-br from-[#1A160E] to-[#0D0B08] border border-gold/25 p-8",
              size === "sm" && "max-w-sm", size === "md" && "max-w-lg", size === "lg" && "max-w-2xl",
              className
            )}
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ type: "spring", duration: 0.4, bounce: 0.1 }}
          >
            <button onClick={onClose} className="absolute top-4 right-4 text-cream/30 hover:text-gold transition-colors" aria-label="Close">
              <X size={18} />
            </button>
            {title && (
              <div className="mb-6">
                <h2 className="font-cormorant text-3xl font-light text-cream">{title}</h2>
                {subtitle && <p className="text-sm text-cream/45 mt-1 tracking-wide">{subtitle}</p>}
              </div>
            )}
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
