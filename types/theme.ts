import type { EventType, ColorPalette, AnimationStyle } from "./invitation";

export interface Theme {
  id: string;
  name: string;
  slug: string;
  tags: string[];
  eventTypes: EventType[];
  isPremium: boolean;
  previewImageUrl: string;
  animationPreviewUrl?: string;
  colorPalette: ColorPalette;
  fontPrimary: string;
  fontSecondary: string;
  animationStyle: AnimationStyle;
  musicSuggestion?: string;
  language?: "en" | "fr" | "ar" | "all";
}
