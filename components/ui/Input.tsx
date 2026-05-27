import { forwardRef } from "react";
import { cn } from "@/lib/utils/cn";
import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string; error?: string; hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className, id, ...props }, ref) => {
    const inputId = id || `input_${Math.random().toString(36).slice(2)}`;
    return (
      <div className="flex flex-col gap-1.5">
        {label && <label htmlFor={inputId} className="text-[11px] uppercase tracking-[0.2em] text-gold">{label}</label>}
        <input ref={ref} id={inputId}
          className={cn(
            "w-full bg-gold/[0.04] border border-gold/20 text-cream font-jost text-sm px-4 py-3 outline-none",
            "placeholder:text-cream/20 transition-colors focus:border-gold/60",
            error && "border-red-500/50 focus:border-red-500/80", className
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-400 tracking-wide">{error}</p>}
        {hint && !error && <p className="text-xs text-cream/30 tracking-wide">{hint}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";
