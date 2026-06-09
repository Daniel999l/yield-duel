import type { AgentDecision, Allocation, MarketSignal } from "./types";
import { normalizeAllocation } from "./market";

const AGENT_ID = "ERC-8004://yield-duel-agent-v1";

export function computeAgentAllocation(signals: MarketSignal[]): Allocation {
  let usdy = 40;
  let meth = 35;
  let mnt = 25;

  for (const signal of signals) {
    if (signal.id === "stable-inflow" && signal.trend === "up") {
      usdy += 12 * signal.weight;
      meth -= 6 * signal.weight;
    }
    if (signal.id === "eth-vol" && signal.trend === "up") {
      usdy += 8 * signal.weight;
      meth -= 10 * signal.weight;
      mnt += 2 * signal.weight;
    }
    if (signal.id === "rwa-spread" && signal.trend === "up") {
      usdy += 6 * signal.weight;
      mnt -= 4 * signal.weight;
    }
    if (signal.id === "funding" && signal.trend === "down") {
      meth -= 5 * signal.weight;
      usdy += 5 * signal.weight;
    }
  }

  return normalizeAllocation({
    USDY: Math.max(10, Math.round(usdy)),
    METH: Math.max(10, Math.round(meth)),
    MNT: Math.max(5, Math.round(mnt)),
  });
}

export function buildAgentReasoning(
  allocation: Allocation,
  signals: MarketSignal[]
): string[] {
  const reasons: string[] = [];

  const stable = signals.find((s) => s.id === "stable-inflow");
  if (stable?.trend === "up" && allocation.USDY >= 40) {
    reasons.push(
      `Stablecoin inflows at ${stable.value}. Overweighting USDY RWA yield for capital preservation.`
    );
  }

  const vol = signals.find((s) => s.id === "eth-vol");
  if (vol?.trend === "up" && allocation.USDY > allocation.METH) {
    reasons.push(
      `ETH volatility elevated (${vol.value}). Reducing mETH exposure to limit drawdown risk.`
    );
  } else if (vol?.trend === "down" && allocation.METH >= 35) {
    reasons.push(
      `Vol compression detected. Increasing mETH allocation to capture staking spread.`
    );
  }

  const spread = signals.find((s) => s.id === "rwa-spread");
  if (spread) {
    reasons.push(
      `RWA yield premium at ${spread.value} vs DeFi. Favoring Mantle-native real-world assets.`
    );
  }

  if (allocation.MNT >= 20) {
    reasons.push(
      `Maintaining ${allocation.MNT}% MNT for ecosystem fee capture and governance upside.`
    );
  }

  if (reasons.length === 0) {
    reasons.push("Balanced allocation across Mantle RWA stack based on current signal weights.");
  }

  return reasons;
}

export function runAgent(signals: MarketSignal[]): AgentDecision {
  const allocation = computeAgentAllocation(signals);
  const reasoning = buildAgentReasoning(allocation, signals);

  const confidence = Math.min(
    95,
    72 +
      signals.filter((s) => s.trend === "up").length * 5 +
      (allocation.USDY > 30 ? 8 : 0)
  );

  return {
    allocation,
    reasoning,
    confidence,
    signalsUsed: signals,
    agentId: AGENT_ID,
    timestamp: Date.now(),
  };
}

export const AGENT_PROFILE = {
  id: AGENT_ID,
  name: "TreasuryClaw",
  version: "1.0.0",
  category: "RWA Treasury",
  standard: "ERC-8004",
  description:
    "Autonomous Mantle treasury agent. Rebalances USDY, mETH, and MNT based on on-chain flows and macro signals.",
};