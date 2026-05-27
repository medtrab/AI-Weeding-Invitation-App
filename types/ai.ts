import type { EventType, ColorPalette, AnimationStyle, Invitation } from "./invitation";

export interface AIGenerationInput {
  prompt: string;
  eventType?: EventType;
  language?: "en" | "fr" | "ar";
  textStyle?: Invitation["textStyle"];
}

export interface AIGenerationResult {
  themeName: string;
  colorPalette: ColorPalette;
  fontPrimary: string;
  fontSecondary: string;
  animationStyle: AnimationStyle;
  invitationText: string;
  musicSuggestion: string;
  tagline: string;
  decorativeStyle: string;
}

export interface AITextGenerationInput {
  eventType: EventType;
  coupleName?: string;
  eventDate?: string;
  venue?: string;
  language: "en" | "fr" | "ar";
  textStyle: Invitation["textStyle"];
  additionalDetails?: string;
}
