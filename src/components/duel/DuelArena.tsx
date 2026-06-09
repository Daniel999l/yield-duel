"use client";

import { useCallback, useEffect, useState } from "react";
import { AllocationSlider } from "./AllocationSlider";
import { DuelResult } from "./DuelResult";
import { MarketSignals } from "./MarketSignals";
import { AgentPanel } from "@/components/agent/AgentPanel";
import { ShareCard } from "@/components/share/ShareCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { useCommitDuel } from "@/hooks/useCommitDuel";
import { isContractConfigured } from "@/lib/chains";
import { ASSETS } from "@/lib/market";
import type { AgentDecision, Allocation, MarketSignal } from "@/lib/types";
import { useDuelStore } from "@/store/duel-store";
import { Bot, Swords, User } from "lucide-react";

function toSegments(allocation: Allocation) {
  return (["USDY", "METH", "MNT"] as const).map((id) => ({
    value: allocation[id],
    color: ASSETS[id].color,
    label: id,
  }));
}

export function DuelArena() {
  const {
    humanAllocation,
    setAllocation,
    isDueling,
    lastRound,
    startDuel,
    finishDuel,
    wins,
    losses,
    streak,
  } = useDuelStore();

  const { commitDuel, isConnected } = useCommitDuel();
  const contractReady = isContractConfigured();

  const [signals, setSignals] = useState<MarketSignal[]>([]);
  const [agentDecision, setAgentDecision] = useState<AgentDecision | null>(null);
  const [showShare, setShowShare] = useState(false);
  const [phase, setPhase] = useState<"idle" | "thinking" | "signing" | "done">("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/market")
      .then((r) => r.json())
      .then((d) => setSignals(d.signals))
      .catch(() => {});
  }, []);

  const runDuel = useCallback(async () => {
    setError(null);

    if (!isConnected) {
      setError("Connect your wallet on Mantle Sepolia to commit a duel.");
      return;
    }

    if (!contractReady) {
      setError("Contract not deployed yet. Run npm run deploy:mantle and set NEXT_PUBLIC_YIELD_DUEL_CONTRACT.");
      return;
    }

    startDuel();
    setPhase("thinking");
    setAgentDecision(null);

    try {
      setPhase("signing");
      const result = await commitDuel(humanAllocation);
      setAgentDecision(result.agentDecision);
      finishDuel(result.round, result.logs);
      setPhase("done");
    } catch (err) {
      setPhase("idle");
      setError(err instanceof Error ? err.message : "Transaction failed. Try again.");
    }
  }, [
    humanAllocation,
    startDuel,
    finishDuel,
    commitDuel,
    isConnected,
    contractReady,
  ]);

  return (
    <section id="duel" className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Badge variant="warning" className="mb-3">
            <Swords className="h-3 w-3" />
            Live Duel
          </Badge>
          <h2 className="text-[32px] font-bold leading-tight tracking-tight">
            Can you beat the machine?
          </h2>
          <p className="mt-2 max-w-xl text-[15px] text-text/70">
            Set your USDY / mETH / MNT allocation. TreasuryClaw responds with a
            signal-weighted rebalance. Sign one transaction to log it on Mantle.
          </p>
        </div>
        <div className="flex gap-3">
          <div className="px-4 py-2 bg-white neo-border rounded-[6px] neo-shadow-sm text-center min-w-[5rem]">
            <p className="text-[12px] font-semibold text-text/60">Wins</p>
            <p className="font-mono text-[20px] font-bold text-success">{wins}</p>
          </div>
          <div className="px-4 py-2 bg-white neo-border rounded-[6px] neo-shadow-sm text-center min-w-[5rem]">
            <p className="text-[12px] font-semibold text-text/60">Losses</p>
            <p className="font-mono text-[20px] font-bold text-danger">{losses}</p>
          </div>
          <div className="px-4 py-2 bg-primary neo-border rounded-[6px] neo-shadow-sm text-center min-w-[5rem]">
            <p className="text-[12px] font-semibold text-text/60">Streak</p>
            <p className="font-mono text-[20px] font-bold">{streak}</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-danger/10 neo-border border-danger rounded-[6px] text-[14px] font-medium text-danger">
          {error}
        </div>
      )}

      {!contractReady && (
        <div className="p-4 bg-warning/10 neo-border rounded-[6px] text-[14px] text-text/80">
          On-chain mode pending: deploy the contract with{" "}
          <code className="font-mono text-[13px]">npm run deploy:mantle</code> and
          add the address to your env file.
        </div>
      )}

      {signals.length > 0 && <MarketSignals signals={signals} />}

      {phase === "done" && lastRound ? (
        <DuelResult round={lastRound} onShare={() => setShowShare(true)} />
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card accent="primary" padding="lg">
            <div className="flex items-center gap-2 mb-6">
              <div className="flex h-9 w-9 items-center justify-center bg-primary neo-border rounded-[6px]">
                <User className="h-4 w-4" strokeWidth={2.5} />
              </div>
              <div>
                <h3 className="text-[17px] font-semibold">Your Portfolio</h3>
                <p className="text-[13px] text-text/60">Drag sliders to allocate 100%</p>
              </div>
            </div>

            <ProgressBar segments={toSegments(humanAllocation)} className="mb-6" />
            <AllocationSlider
              allocation={humanAllocation}
              onChange={setAllocation}
              disabled={isDueling || phase === "signing"}
            />

            <Button
              className="w-full mt-8"
              size="lg"
              loading={phase === "thinking" || phase === "signing"}
              onClick={runDuel}
              disabled={isDueling || phase === "signing"}
            >
              <Swords className="h-5 w-5" />
              {phase === "signing" ? "Confirm in Wallet..." : "Commit Duel On-Chain"}
            </Button>
          </Card>

          <Card accent="secondary" padding="lg">
            <div className="flex items-center gap-2 mb-6">
              <div className="flex h-9 w-9 items-center justify-center bg-secondary neo-border rounded-[6px]">
                <Bot className="h-4 w-4 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <h3 className="text-[17px] font-semibold">TreasuryClaw Agent</h3>
                <p className="text-[13px] text-text/60">ERC-8004 · Autonomous RWA manager</p>
              </div>
            </div>

            {phase === "thinking" || phase === "signing" ? (
              <AgentPanel loading />
            ) : agentDecision ? (
              <AgentPanel decision={agentDecision} />
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="h-20 w-20 bg-surface neo-border rounded-[8px] neo-shadow flex items-center justify-center mb-4">
                  <Bot className="h-10 w-10 text-text/30" />
                </div>
                <p className="text-[15px] font-medium text-text/50">
                  Agent awaits your move
                </p>
                <p className="text-[13px] text-text/40 mt-1 max-w-[240px]">
                  Connect wallet, then commit your allocation
                </p>
              </div>
            )}
          </Card>
        </div>
      )}

      {showShare && lastRound && (
        <ShareCard round={lastRound} onClose={() => setShowShare(false)} />
      )}
    </section>
  );
}