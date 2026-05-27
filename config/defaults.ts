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

export const MUSIC_LIBRARY = [
  { label: "Fairuz — Li Beirut",      url: "/music/fairuz-li-beirut.mp3",   genre: "Arabic"    },
  { label: "Debussy — Clair de Lune", url: "/music/clair-de-lune.mp3",      genre: "Classical" },
  { label: "Satie — Gymnopédie No.1", url: "/music/gymnopedie.mp3",         genre: "Classical" },
  { label: "Norah Jones — Come Away", url: "/music/come-away.mp3",          genre: "Jazz"      },
  { label: "Ambient Oud",             url: "/music/ambient-oud.mp3",        genre: "Arabic"    },
  { label: "String Quartet",          url: "/music/string-quartet.mp3",     genre: "Classical" },
];
