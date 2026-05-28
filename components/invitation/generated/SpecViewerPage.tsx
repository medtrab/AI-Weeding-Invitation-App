"use client";
import { SpecRenderer } from "./SpecRenderer";

interface Props {
  spec: unknown;
  coupleName: string;
  eventDate: string;
  venue: string;
  guestName?: string;
  photos?: string[];
}

export function SpecViewerPage({ spec, coupleName, eventDate, venue, guestName, photos }: Props) {
  return (
    <SpecRenderer
      spec={spec as never}
      coupleName={coupleName}
      eventDate={eventDate}
      venue={venue}
      guestName={guestName}
      photos={photos}
      isPreview={false}
    />
  );
}
