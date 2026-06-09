import { keccak256, stringToHex, type Hex } from "viem";
import type { AgentDecision, Allocation } from "./types";

export function allocationReasoningHash(
  allocation: Allocation,
  extra?: string
): Hex {
  const payload = JSON.stringify({ allocation, extra: extra ?? "" });
  return keccak256(stringToHex(payload));
}

export function agentReasoningHash(decision: AgentDecision): Hex {
  const payload = JSON.stringify({
    allocation: decision.allocation,
    reasoning: decision.reasoning,
    confidence: decision.confidence,
    agentId: decision.agentId,
  });
  return keccak256(stringToHex(payload));
}

export function yieldToBps(yieldPct: number): number {
  return Math.round(yieldPct * 100);
}