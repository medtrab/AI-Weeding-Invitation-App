import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  return NextResponse.json({
    NEXTAUTH_URL:    process.env.NEXTAUTH_URL    || "NOT SET",
    VERCEL_URL:      process.env.VERCEL_URL      || "NOT SET",
    NODE_ENV:        process.env.NODE_ENV        || "NOT SET",
    host:            req.headers.get("host"),
    proto:           req.headers.get("x-forwarded-proto"),
    origin:          req.headers.get("origin"),
    referer:         req.headers.get("referer"),
    computedBaseUrl: `${req.headers.get("x-forwarded-proto") || "https"}://${req.headers.get("host")}`,
  });
}
