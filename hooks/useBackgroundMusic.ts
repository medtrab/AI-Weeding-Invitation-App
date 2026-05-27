import { useRef, useState, useCallback } from "react";

function fadeIn(audio: HTMLAudioElement, targetVolume = 0.4, duration = 3000) {
  const steps = 30, increment = targetVolume / steps, interval = duration / steps;
  const timer = setInterval(() => {
    if (audio.volume < targetVolume - increment) audio.volume = Math.min(audio.volume + increment, targetVolume);
    else { audio.volume = targetVolume; clearInterval(timer); }
  }, interval);
}

export function useBackgroundMusic(src?: string) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const init = useCallback(() => {
    if (!src || audioRef.current) return;
    const audio = new Audio(src);
    audio.loop = true; audio.volume = 0;
    audioRef.current = audio;
    audio.play().then(() => { setIsPlaying(true); fadeIn(audio); }).catch(() => {});
  }, [src]);

  const toggle = useCallback(() => {
    if (!audioRef.current) return;
    if (isPlaying) { audioRef.current.pause(); setIsPlaying(false); }
    else { audioRef.current.play(); setIsPlaying(true); }
  }, [isPlaying]);

  const mute = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted; setIsMuted(!isMuted);
  }, [isMuted]);

  return { init, toggle, mute, isPlaying, isMuted };
}
