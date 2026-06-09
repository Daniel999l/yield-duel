import { getMarketSignals } from "@/lib/market";
import { NextResponse } from "next/server";

export async function GET() {
  const signals = getMarketSignals();
  return NextResponse.json({
    signals,
    updatedAt: Date.now(),
    source: "nansen-style-sim",
  });
}