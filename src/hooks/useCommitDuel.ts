"use client";

import { YIELD_DUEL_LOG_ABI } from "@/lib/abis/yieldDuelLog";
import { YIELD_DUEL_CONTRACT } from "@/lib/chains";
import {
  agentReasoningHash,
  allocationReasoningHash,
  yieldToBps,
} from "@/lib/onchain";
import type { AgentDecision, Allocation, DuelRound, OnChainLogEntry } from "@/lib/types";
import { useCallback } from "react";
import { useAccount, useWriteContract, usePublicClient } from "wagmi";

interface DuelApiResponse {
  round: Omit<DuelRound, "txHash" | "blockNumber"> & {
    txHash?: string;
    blockNumber?: number;
  };
  agentDecision: AgentDecision;
  logs: OnChainLogEntry[];
}

export function useCommitDuel() {
  const { address, isConnected } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const publicClient = usePublicClient();

  const commitDuel = useCallback(
    async (humanAllocation: Allocation): Promise<{
      round: DuelRound;
      agentDecision: AgentDecision;
      logs: OnChainLogEntry[];
    }> => {
      if (!isConnected || !address) {
        throw new Error("Connect your wallet on Mantle Sepolia first.");
      }

      if (!YIELD_DUEL_CONTRACT) {
        throw new Error("Contract not configured. Set NEXT_PUBLIC_YIELD_DUEL_CONTRACT.");
      }

      const res = await fetch("/api/duel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ humanAllocation, wallet: address }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? "Duel simulation failed.");
      }

      const data: DuelApiResponse = await res.json();
      const { agentDecision } = data;
      const human = data.round.humanAllocation;
      const agent = agentDecision.allocation;

      const hash = await writeContractAsync({
        address: YIELD_DUEL_CONTRACT,
        abi: YIELD_DUEL_LOG_ABI,
        functionName: "commitDuel",
        args: [
          human.USDY,
          human.METH,
          human.MNT,
          agent.USDY,
          agent.METH,
          agent.MNT,
          yieldToBps(data.round.humanYield),
          yieldToBps(data.round.agentYield),
          allocationReasoningHash(human, address),
          agentReasoningHash(agentDecision),
        ],
      });

      const receipt = await publicClient!.waitForTransactionReceipt({ hash });

      const round: DuelRound = {
        ...data.round,
        txHash: receipt.transactionHash,
        blockNumber: Number(receipt.blockNumber),
      };

      const logs: OnChainLogEntry[] = [
        {
          id: `log-human-${round.id}`,
          actor: "human",
          action: "Human allocation committed on-chain",
          allocation: human,
          txHash: receipt.transactionHash,
          timestamp: Date.now(),
        },
        {
          id: `log-agent-${round.id}`,
          actor: "agent",
          action: "TreasuryClaw rebalanced on-chain",
          allocation: agent,
          txHash: receipt.transactionHash,
          timestamp: Date.now(),
        },
      ];

      await fetch("/api/duels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ round, wallet: address, agentDecision }),
      }).catch(() => {});

      return { round, agentDecision, logs };
    },
    [address, isConnected, publicClient, writeContractAsync]
  );

  return { commitDuel, isConnected, address };
}