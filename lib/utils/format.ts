export function formatDate(
  date: string | Date,
  locale = "en-GB",
  options: Intl.DateTimeFormatOptions = {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  }
): string {
  return new Intl.DateTimeFormat(locale, options).format(new Date(date));
}

export function formatRelativeTime(date: string | Date): string {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return formatDate(date, "en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export function formatGuestCount(count: number): string {
  return count === 1 ? "1 guest" : `${count} guests`;
}

export function responseRateColor(rate: number): string {
  if (rate >= 80) return "text-emerald-400";
  if (rate >= 50) return "text-gold";
  return "text-red-400";
}
