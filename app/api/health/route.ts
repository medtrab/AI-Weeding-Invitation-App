import { NextResponse } from "next/server";
import { db } from "@/lib/db/client";

export async function GET() {
  const checks: Record<string, string> = {
    env_database_url: process.env.DATABASE_URL ? "✅ set" : "❌ missing",
    env_nextauth_secret: process.env.NEXTAUTH_SECRET ? "✅ set" : "❌ missing",
    env_nextauth_url: process.env.NEXTAUTH_URL || "❌ missing",
    env_gemini_key: process.env.GEMINI_API_KEY ? "✅ set" : "❌ missing",
  };

  try {
    await db.$connect();
    await db.$queryRaw`SELECT 1`;
    checks.database = "✅ connected";

    // Check if migrations ran (tables exist)
    const userCount = await db.user.count();
    checks.users_table = `✅ exists (${userCount} users)`;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    checks.database = `❌ ${msg.slice(0, 120)}`;
  }

  const allOk = Object.values(checks).every(v => v.startsWith("✅"));
  return NextResponse.json({ status: allOk ? "ok" : "degraded", checks }, {
    status: allOk ? 200 : 503,
  });
}
