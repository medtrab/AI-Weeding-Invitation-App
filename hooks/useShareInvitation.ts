import { useCallback } from "react";
import { useUIStore } from "@/stores/useUIStore";

export function useShareInvitation(slug: string, title: string) {
  const { addToast } = useUIStore();
  const url = `${process.env.NEXT_PUBLIC_APP_URL}/i/${slug}`;
  const copyLink = useCallback(async () => {
    await navigator.clipboard.writeText(url);
    addToast({ type: "success", message: "Link copied to clipboard" });
  }, [url, addToast]);
  const shareWhatsApp = useCallback(() => {
    window.open(`https://wa.me/?text=${encodeURIComponent(`You're invited! ${title}\n${url}`)}`, "_blank");
  }, [url, title]);
  const shareNative = useCallback(async () => {
    if (navigator.share) await navigator.share({ title, url });
    else copyLink();
  }, [title, url, copyLink]);
  return { url, copyLink, shareWhatsApp, shareNative };
}
