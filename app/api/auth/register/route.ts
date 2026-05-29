import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import bcrypt from "bcryptjs";
import { z } from "zod";

const registerSchema = z.object({
  name:      z.string().min(2).max(100),
  email:     z.string().email(),
  password:  z.string().min(8),
  eventType: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { detail: "Validation error", errors: parsed.error.flatten() },
        { status: 422 }
      );
    }

    const { name, email, password } = parsed.data;

    // Test DB connection first
    await db.$connect();

    const existing = await db.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { detail: "An account with this email already exists" },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await db.user.create({
      data: { name, email, passwordHash, plan: "free" },
      select: { id: true, email: true, name: true, plan: true },
    });

    return NextResponse.json({ user }, { status: 201 });

  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[register] Error:", message);

    // Detect common DB issues
    if (message.includes("connect") || message.includes("ECONNREFUSED") ||
        message.includes("P1001") || message.includes("P1003") ||
        message.includes("relation") || message.includes("does not exist")) {
      return NextResponse.json(
        { detail: "Database connection error. Please check DATABASE_URL and run migrations." },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { detail: "Registration failed. Please try again." },
      { status: 500 }
    );
  }
}
