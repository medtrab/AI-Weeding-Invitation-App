export function GoldDivider({ className = "", showDiamond = true }: { className?: string; showDiamond?: boolean }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="flex-1 h-px bg-gradient-to-r from-transparent to-gold/30" />
      {showDiamond && <div className="w-1.5 h-1.5 bg-gold/70 rotate-45 shrink-0" />}
      <div className="flex-1 h-px bg-gradient-to-l from-transparent to-gold/30" />
    </div>
  );
}
