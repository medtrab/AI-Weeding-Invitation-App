import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { db } from "@/lib/db/client";

interface Params { params: Promise<{ id: string }> }

export async function POST(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ detail: "Unauthorized" }, { status: 401 });

  const inv = await db.invitation.findFirst({
    where: { id, userId: user.id },
    select: { slug: true, coupleName: true, title: true, venue: true, eventDate: true },
  });
  if (!inv) return NextResponse.json({ detail: "Not found" }, { status: 404 });

  const { guestIds } = await req.json() as { guestIds: string[] };

  const guests = await db.guest.findMany({
    where: { id: { in: guestIds }, invitationId: id },
  });

  const baseUrl = process.env.NEXTAUTH_URL || "https://ai-weeding-invitation-app.vercel.app";

  const results = guests.map((guest: { id: string; name: string; phone: string | null; token: string }) => {
    // Personalized link with guest token
    const inviteUrl = `${baseUrl}/i/${inv.slug}?g=${guest.token}`;

    // OG preview image URL (dynamic per guest)
    const ogUrl = `${baseUrl}/api/og/${guest.token}`;

    // WhatsApp message
    const coupleName = inv.coupleName || inv.title;
    const date = new Date(inv.eventDate).toLocaleDateString("en-US", {
      weekday: "long", day: "numeric", month: "long",
    });
    const message = [
      `✨ *${guest.name}*, you are cordially invited`,
      ``,
      `*${coupleName}*`,
      `🗓 ${date}`,
      `📍 ${inv.venue}`,
      ``,
      `Open your personal invitation:`,
      inviteUrl,
      ``,
      `_A magical evening awaits you_ 🌸`,
    ].join("\n");

    const whatsappUrl = guest.phone
      ? `https://wa.me/${guest.phone.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`
      : null;

    return {
      guestId:    guest.id,
      guestName:  guest.name,
      inviteUrl,
      ogUrl,
      whatsappUrl,
      message,
    };
  });

  // Mark as sent
  await db.guest.updateMany({
    where: { id: { in: guestIds } },
    data: { sendStatus: "sent", sentAt: new Date() },
  });

  return NextResponse.json({ results });
}
