import { runAgent } from "@/lib/agent";
import { getMarketSignals } from "@/lib/market";
import { NextResponse } from "next/server";

export async function GET() {
  const signals = getMarketSignals();
  const decision = runAgent(signals);
  return NextResponse.json({ decision, signals });
}