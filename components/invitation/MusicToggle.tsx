"use client";
import { motion } from "framer-motion";
import { Music, VolumeX } from "lucide-react";

interface Props { isPlaying: boolean; onToggle: () => void; }

export function MusicToggle({ isPlaying, onToggle }: Props) {
  return (
    <motion.button
      className="fixed bottom-6 right-6 z-40 w-10 h-10 flex items-center justify-center border"
      style={{ borderColor: "var(--inv-primary)", color: "var(--inv-primary)", background: "var(--inv-bg)" }}
      onClick={onToggle}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 0.8, y: 0 }}
      transition={{ delay: 2 }}
      aria-label={isPlaying ? "Mute music" : "Play music"}
    >
      {isPlaying ? <Music size={15} /> : <VolumeX size={15} />}
    </motion.button>
  );
}
