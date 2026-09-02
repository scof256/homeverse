import { NextResponse } from "next/server";
import { demoMode } from "@/lib/config";

export async function GET() {
  return NextResponse.json({ status: "ok", service: "homeverse", mode: demoMode ? "demo" : "production", timestamp: new Date().toISOString() }, { headers: { "Cache-Control": "no-store" } });
}
