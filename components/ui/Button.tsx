"use client";
import { forwardRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "ghost" | "gold" | "danger" | "text";
type Size    = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant; size?: Size; isLoading?: boolean;
  leftIcon?: React.ReactNode; rightIcon?: React.ReactNode;
}

const variants: Record<Variant, string> = {
  primary: "bg-gold text-deep hover:bg-gold-light",
  ghost:   "bg-transparent border border-white/20 text-cream hover:border-gold hover:text-gold",
  gold:    "bg-transparent border border-gold/40 text-gold hover:bg-gold hover:text-deep",
  danger:  "bg-transparent border border-red-500/40 text-red-400 hover:bg-red-500/10",
  text:    "bg-transparent text-cream/60 hover:text-gold hover:underline underline-offset-4",
};
const sizes: Record<Size, string> = {
  sm: "px-4 py-2 text-[11px] tracking-[0.15em]",
  md: "px-6 py-3 text-[11px] tracking-[0.2em]",
  lg: "px-10 py-4 text-xs tracking-[0.25em]",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", isLoading, leftIcon, rightIcon, className, children, disabled, ...props }, ref) => (
    <motion.button
      ref={ref}
      whileTap={{ scale: 0.97 }}
      className={cn(
        "relative inline-flex items-center justify-center gap-2 font-jost uppercase transition-all duration-300",
        "disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]",
        variants[variant], sizes[size], className
      )}
      disabled={disabled || isLoading}
      {...(props as React.ComponentProps<typeof motion.button>)}
    >
      {isLoading && <span className="absolute inset-0 overflow-hidden"><span className="absolute inset-y-0 left-0 bg-white/10 animate-loading-bar" /></span>}
      {leftIcon && <span className="shrink-0">{leftIcon}</span>}
      <span>{isLoading ? "Please wait..." : children}</span>
      {rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </motion.button>
  )
);
Button.displayName = "Button";
