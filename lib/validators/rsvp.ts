import { z } from "zod";

export const rsvpSubmitSchema = z.object({
  invitationId: z.string().cuid(),
  guestName: z.string().min(2).max(100),
  guestEmail: z.string().email().optional().or(z.literal("")),
  status: z.enum(["attending","declined","maybe"]),
  guestCount: z.coerce.number().int().min(1).max(20).default(1),
  mealPreference: z.enum(["standard","vegetarian","vegan","halal","kosher"]).optional(),
  notes: z.string().max(500).optional(),
});
