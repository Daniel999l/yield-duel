import { runAgent } from "@/lib/agent";
import { enrichAgentReasoning } from "@/lib/groq";
import { getMarketSignals, normalizeAllocation, simulateYield } from "@/lib/market";
import type { Allocation, DuelRound } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const humanAllocation = normalizeAllocation(body.humanAllocation as Allocation);

  const signals = getMarketSignals();
  let agentDecision = runAgent(signals);
  agentDecision = {
    ...agentDecision,
    reasoning: await enrichAgentReasoning(agentDecision, signals),
  };

  const humanYield = simulateYield(humanAllocation, signals, 42);
  const agentYield = simulateYield(agentDecision.allocation, signals, 99);

  let winner: DuelRound["winner"] = "tie";
  if (humanYield > agentYield) winner = "human";
  else if (agentYield > humanYield) winner = "agent";

  const timestamp = Date.now();

  const round: Omit<DuelRound, "txHash" | "blockNumber"> & {
    txHash?: string;
    blockNumber?: number;
  } = {
    id: `duel-${timestamp}`,
    humanAllocation,
    agentDecision,
    humanYield,
    agentYield,
    winner,
    createdAt: timestamp,
  };

  return NextResponse.json({
    round,
    agentDecision,
    signals,
    onChainRequired: true,
  });
}