export type RSVPStatus = "attending" | "declined" | "maybe";
export type MealPreference = "standard" | "vegetarian" | "vegan" | "halal" | "kosher";

export interface RSVP {
  id: string;
  invitationId: string;
  guestName: string;
  guestEmail?: string;
  status: RSVPStatus;
  guestCount: number;
  mealPreference?: MealPreference;
  notes?: string;
  respondedAt: string;
}

export interface RSVPStats {
  total: number;
  attending: number;
  declined: number;
  maybe: number;
  totalGuests: number;
  responseRate: number;
}

export interface RSVPSubmitInput {
  invitationId: string;
  guestName: string;
  guestEmail?: string;
  status: RSVPStatus;
  guestCount: number;
  mealPreference?: MealPreference;
  notes?: string;
}
