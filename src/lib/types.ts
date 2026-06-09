export type AssetId = "USDY" | "METH" | "MNT";

export interface Allocation {
  USDY: number;
  METH: number;
  MNT: number;
}

export interface MarketSignal {
  id: string;
  label: string;
  value: string;
  trend: "up" | "down" | "neutral";
  weight: number;
}

export interface AssetMeta {
  id: AssetId;
  name: string;
  description: string;
  baseApy: number;
  volatility: number;
  color: string;
}

export interface AgentDecision {
  allocation: Allocation;
  reasoning: string[];
  confidence: number;
  signalsUsed: MarketSignal[];
  agentId: string;
  timestamp: number;
}

export interface DuelRound {
  id: string;
  humanAllocation: Allocation;
  agentDecision: AgentDecision;
  humanYield: number;
  agentYield: number;
  winner: "human" | "agent" | "tie";
  txHash: string;
  blockNumber: number;
  createdAt: number;
}

export interface LeaderboardEntry {
  rank: number;
  address: string;
  wins: number;
  losses: number;
  avgYield: number;
  streak: number;
}

export interface OnChainLogEntry {
  id: string;
  actor: "human" | "agent";
  action: string;
  allocation: Allocation;
  txHash: string;
  timestamp: number;
}