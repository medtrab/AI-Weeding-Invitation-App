import { z } from "zod";

export const invitationCreateSchema = z.object({
  eventType: z.enum(["wedding","engagement","birthday","corporate","baby_shower","graduation","vip"]),
  title: z.string().min(2).max(120),
  coupleName: z.string().max(100).optional(),
  eventDate: z.string().datetime(),
  venue: z.string().min(2).max(200),
  language: z.enum(["en","fr","ar"]).default("en"),
  textStyle: z.enum(["romantic","formal","luxury","funny","religious"]).default("luxury"),
  aiPrompt: z.string().max(500).optional(),
});

export const invitationUpdateSchema = invitationCreateSchema.partial().extend({
  status: z.enum(["draft","published","archived"]).optional(),
  colorPalette: z.object({
    primary: z.string(), secondary: z.string(),
    accent: z.string(), background: z.string(), text: z.string(),
  }).optional(),
  fontPrimary: z.string().optional(),
  fontSecondary: z.string().optional(),
  animationStyle: z.enum(["elegant_fade","floating_petals","shimmer","parallax","confetti","botanical"]).optional(),
  musicUrl: z.string().url().optional().or(z.literal("")),
  musicLabel: z.string().optional(),
  guestCount: z.number().int().positive().optional(),
  rsvpDeadline: z.string().datetime().optional(),
  personalizedGreeting: z.boolean().optional(),
  showCountdown: z.boolean().optional(),
  coverImageUrl: z.string().url().optional().or(z.literal("")),
  backgroundImageUrl: z.string().url().optional().or(z.literal("")),
  venueAddress: z.string().optional(),
  venueLat: z.number().optional(),
  venueLng: z.number().optional(),
  sections: z.array(z.object({
    id: z.string(), type: z.string(), order: z.number(),
    visible: z.boolean(), content: z.record(z.unknown()),
  })).optional(),
});
