"use client";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { explorerTxUrl, shortenHash } from "@/lib/mantle";
import type { DuelRound } from "@/lib/types";
import { ExternalLink, Share2, Trophy, Bot, User } from "lucide-react";
import { motion } from "framer-motion";

export function DuelResult({
  round,
  onShare,
}: {
  round: DuelRound;
  onShare: () => void;
}) {
  const won = round.winner === "human";
  const tied = round.winner === "tie";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card
        accent={won ? "primary" : tied ? "none" : "secondary"}
        padding="lg"
        className="text-center"
      >
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center bg-primary neo-border rounded-[8px] neo-shadow">
          <Trophy className="h-8 w-8" strokeWidth={2.5} />
        </div>

        <h2 className="text-[27px] font-bold tracking-tight">
          {tied ? "It's a Tie!" : won ? "You Beat the Agent!" : "Agent Wins This Round"}
        </h2>
        <p className="mt-2 text-[15px] text-text/70 max-w-md mx-auto">
          {tied
            ? "Identical projected yield. The machine matched your instincts."
            : won
              ? "Your allocation outperformed TreasuryClaw on simulated 7-day RWA yield."
              : "TreasuryClaw's signal-weighted rebalance captured more yield this round."}
        </p>

        <div className="mt-6 grid grid-cols-2 gap-4 max-w-sm mx-auto">
          <div className="p-4 bg-surface neo-border rounded-[6px]">
            <div className="flex items-center justify-center gap-1.5 text-[13px] font-semibold mb-1">
              <User className="h-4 w-4" /> You
            </div>
            <p className="font-mono text-[24px] font-bold text-success">
              {round.humanYield}%
            </p>
            <p className="text-[12px] text-text/60 mt-1">7d projected APY</p>
          </div>
          <div className="p-4 bg-surface neo-border rounded-[6px]">
            <div className="flex items-center justify-center gap-1.5 text-[13px] font-semibold mb-1">
              <Bot className="h-4 w-4" /> Agent
            </div>
            <p className="font-mono text-[24px] font-bold text-secondary">
              {round.agentYield}%
            </p>
            <p className="text-[12px] text-text/60 mt-1">7d projected APY</p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <Badge variant="secondary">Block #{round.blockNumber.toLocaleString()}</Badge>
          <a
            href={explorerTxUrl(round.txHash)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[13px] font-mono font-medium hover:underline"
          >
            {shortenHash(round.txHash)}
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button onClick={onShare} variant="primary">
            <Share2 className="h-4 w-4" />
            Share Result
          </Button>
          <Button variant="ghost" onClick={() => window.location.reload()}>
            New Duel
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}