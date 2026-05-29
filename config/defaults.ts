import type { ColorPalette } from "@/types";

export const DEFAULT_COLOR_PALETTE: ColorPalette = {
  primary: "#C9A84C",
  secondary: "#1A1610",
  accent: "#E8C96A",
  background: "#0D0B08",
  text: "#FAF7F2",
};

export const DEFAULT_SECTIONS = [
  { type: "hero",      order: 0, visible: true,  content: {} },
  { type: "details",   order: 1, visible: true,  content: {} },
  { type: "countdown", order: 2, visible: true,  content: {} },
  { type: "rsvp",      order: 3, visible: true,  content: {} },
  { type: "gallery",   order: 4, visible: false, content: {} },
  { type: "map",       order: 5, visible: false, content: {} },
  { type: "message",   order: 6, visible: false, content: {} },
];

export const SUPPORTED_FONTS = [
  { label: "Cormorant Garamond", value: "Cormorant Garamond", category: "serif" },
  { label: "Playfair Display",   value: "Playfair Display",   category: "serif" },
  { label: "EB Garamond",        value: "EB Garamond",        category: "serif" },
  { label: "Libre Baskerville",  value: "Libre Baskerville",  category: "serif" },
  { label: "Jost",               value: "Jost",               category: "sans"  },
  { label: "DM Sans",            value: "DM Sans",            category: "sans"  },
  { label: "Outfit",             value: "Outfit",             category: "sans"  },
  { label: "Raleway",            value: "Raleway",            category: "sans"  },
];

// Music library — uses Web Audio synthesis as primary engine (always works)
// External URLs are optional fallbacks if provided via invitation.musicUrl
export const MUSIC_LIBRARY = [
  {
    label: "Ambient Oud & Piano",
    url: "",          // Uses Web Audio synthesis
    genre: "Arabic · Ambient",
    synthesized: true,
  },
  {
    label: "Romantic Strings",
    url: "https://assets.mixkit.co/music/preview/mixkit-serene-view-443.mp3",
    genre: "Classical · Romantic",
    synthesized: false,
  },
  {
    label: "Mediterranean Piano",
    url: "https://assets.mixkit.co/music/preview/mixkit-dreaming-big-31.mp3",
    genre: "Piano · Dreamy",
    synthesized: false,
  },
  {
    label: "Soft Wedding Waltz",
    url: "https://assets.mixkit.co/music/preview/mixkit-a-very-happy-christmas-897.mp3",
    genre: "Orchestral · Elegant",
    synthesized: false,
  },
  {
    label: "Oriental Breeze",
    url: "https://assets.mixkit.co/music/preview/mixkit-sunset-in-the-desert-700.mp3",
    genre: "Oriental · Warm",
    synthesized: false,
  },
];
