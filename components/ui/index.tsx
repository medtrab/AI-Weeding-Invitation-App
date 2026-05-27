// components/ui/Button.tsx

import { forwardRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "ghost" | "gold" | "danger" | "text";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-gold text-deep font-medium hover:bg-gold-light active:scale-[0.98]",
  ghost:
    "bg-transparent border border-white/20 text-cream hover:border-gold hover:text-gold",
  gold:
    "bg-transparent border border-gold/40 text-gold hover:bg-gold hover:text-deep",
  danger:
    "bg-transparent border border-red-500/40 text-red-400 hover:bg-red-500/10",
  text: "bg-transparent text-cream/60 hover:text-gold underline-offset-4 hover:underline",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-xs tracking-[0.15em]",
  md: "px-6 py-3 text-xs tracking-[0.2em]",
  lg: "px-10 py-4 text-sm tracking-[0.25em]",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      isLoading,
      leftIcon,
      rightIcon,
      className,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: 0.97 }}
        className={cn(
          "relative inline-flex items-center justify-center gap-2",
          "font-jost uppercase transition-all duration-300",
          "disabled:opacity-40 disabled:cursor-not-allowed",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        disabled={disabled || isLoading}
        {...(props as React.ComponentProps<typeof motion.button>)}
      >
        {isLoading && (
          <span className="absolute inset-0 overflow-hidden">
            <span className="absolute inset-y-0 left-0 bg-white/10 animate-loading-bar" />
          </span>
        )}
        {leftIcon && <span className="shrink-0">{leftIcon}</span>}
        <span>{isLoading ? "Please wait..." : children}</span>
        {rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </motion.button>
    );
  }
);
Button.displayName = "Button";


// components/ui/Input.tsx

import { forwardRef } from "react";
import { cn } from "@/lib/utils/cn";
import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className, id, ...props }, ref) => {
    const inputId = id || `input_${Math.random().toString(36).slice(2)}`;
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-[11px] uppercase tracking-[0.2em] text-gold"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "w-full bg-gold/[0.04] border border-gold/20 text-cream",
            "font-jost text-sm px-4 py-3 outline-none",
            "placeholder:text-cream/20 transition-colors",
            "focus:border-gold/60",
            error && "border-red-500/50 focus:border-red-500/80",
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-xs text-red-400 tracking-wide">{error}</p>
        )}
        {hint && !error && (
          <p className="text-xs text-cream/30 tracking-wide">{hint}</p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";


// components/ui/Modal.tsx

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
};

export function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  size = "md",
  className,
}: ModalProps) {
  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          aria-modal="true"
          role="dialog"
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            className={cn(
              "relative w-full z-10",
              "bg-gradient-to-br from-[#1A160E] to-[#0D0B08]",
              "border border-gold/25 p-8",
              sizeMap[size],
              className
            )}
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ type: "spring", duration: 0.4, bounce: 0.1 }}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-cream/30 hover:text-gold transition-colors"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>

            {title && (
              <div className="mb-6">
                <h2 className="font-cormorant text-3xl font-light text-cream">
                  {title}
                </h2>
                {subtitle && (
                  <p className="text-sm text-cream/45 mt-1 tracking-wide">
                    {subtitle}
                  </p>
                )}
              </div>
            )}
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}


// components/ui/GoldDivider.tsx
// Decorative section divider

interface GoldDividerProps {
  className?: string;
  showDiamond?: boolean;
}

export function GoldDivider({ className = "", showDiamond = true }: GoldDividerProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="flex-1 h-px bg-gradient-to-r from-transparent to-gold/30" />
      {showDiamond && (
        <div className="w-1.5 h-1.5 bg-gold/70 rotate-45 shrink-0" />
      )}
      <div className="flex-1 h-px bg-gradient-to-l from-transparent to-gold/30" />
    </div>
  );
}


// components/ui/SectionLabel.tsx
// Eyebrow label for sections

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] uppercase tracking-[0.35em] text-gold mb-4">
      {children}
    </p>
  );
}


// components/ui/ColorSwatch.tsx

interface ColorSwatchProps {
  color: string;
  size?: "sm" | "md";
  selected?: boolean;
  onClick?: () => void;
  label?: string;
}

export function ColorSwatch({
  color,
  size = "md",
  selected,
  onClick,
  label,
}: ColorSwatchProps) {
  const dims = size === "sm" ? "w-6 h-6" : "w-8 h-8";
  return (
    <button
      onClick={onClick}
      title={label}
      className={`${dims} rounded-full transition-all ${
        selected ? "ring-2 ring-gold ring-offset-2 ring-offset-deep" : ""
      }`}
      style={{ backgroundColor: color }}
      aria-label={label || color}
    />
  );
}


// components/ui/Toast.tsx

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertCircle, Info, X } from "lucide-react";
import { useUIStore } from "@/stores/useUIStore";

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
};

const colors = {
  success: "border-emerald-500/30 text-emerald-400",
  error: "border-red-500/30 text-red-400",
  info: "border-gold/30 text-gold",
};

export function ToastContainer() {
  const { toasts, removeToast } = useUIStore();

  return (
    <div className="fixed bottom-6 right-6 z-[60] flex flex-col gap-2">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastItem
            key={toast.id}
            toast={toast}
            onRemove={() => removeToast(toast.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

function ToastItem({
  toast,
  onRemove,
}: {
  toast: { id: string; type: "success" | "error" | "info"; message: string };
  onRemove: () => void;
}) {
  const Icon = icons[toast.type];

  useEffect(() => {
    const t = setTimeout(onRemove, 4000);
    return () => clearTimeout(t);
  }, [onRemove]);

  return (
    <motion.div
      className={`flex items-center gap-3 px-4 py-3 bg-[#1A1610] border ${colors[toast.type]} min-w-[260px] max-w-sm`}
      initial={{ opacity: 0, x: 32, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 32, scale: 0.9 }}
    >
      <Icon size={16} className="shrink-0" />
      <p className="flex-1 text-sm text-cream/80 tracking-wide">
        {toast.message}
      </p>
      <button onClick={onRemove} className="text-cream/30 hover:text-cream/70">
        <X size={14} />
      </button>
    </motion.div>
  );
}
