export type EventType =
  | "wedding"
  | "engagement"
  | "birthday"
  | "corporate"
  | "baby_shower"
  | "graduation"
  | "vip";

export type InvitationStatus = "draft" | "published" | "archived";

export type AnimationStyle =
  | "elegant_fade"
  | "floating_petals"
  | "shimmer"
  | "parallax"
  | "confetti"
  | "botanical";

export interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
}

export interface InvitationSection {
  id: string;
  type: "hero" | "details" | "countdown" | "gallery" | "rsvp" | "map" | "message";
  order: number;
  visible: boolean;
  content: Record<string, unknown>;
}

export interface Invitation {
  id: string;
  userId: string;
  slug: string;
  status: InvitationStatus;
  eventType: EventType;
  title: string;
  coupleName?: string;
  eventDate: string;
  venue: string;
  venueAddress?: string;
  venueLat?: number;
  venueLng?: number;
  coverImageUrl?: string;
  backgroundImageUrl?: string;
  themeId?: string;
  colorPalette: ColorPalette;
  fontPrimary: string;
  fontSecondary: string;
  animationStyle: AnimationStyle;
  musicUrl?: string;
  musicLabel?: string;
  sections: InvitationSection[];
  language: "en" | "fr" | "ar";
  textStyle: "romantic" | "formal" | "luxury" | "funny" | "religious";
  guestCount?: number;
  rsvpDeadline?: string;
  personalizedGreeting: boolean;
  showCountdown: boolean;
  qrCodeUrl?: string;
  generatedHtml?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InvitationCreateInput {
  eventType: EventType;
  title: string;
  coupleName?: string;
  eventDate: string;
  venue: string;
  language: "en" | "fr" | "ar";
  textStyle: Invitation["textStyle"];
  aiPrompt?: string;
}
