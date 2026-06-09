"use client";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { DuelRound } from "@/lib/types";
import { Copy, X, Trophy } from "lucide-react";
import { useState } from "react";

export function ShareCard({
  round,
  onClose,
}: {
  round: DuelRound;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const won = round.winner === "human";

  const tweet = won
    ? `I beat TreasuryClaw on Yield Duel.\n\nMy RWA allocation: ${round.humanYield}% APY\nAgent: ${round.agentYield}% APY\n\nHuman > AI. Can you beat the machine?\n\nyieldduel.app`
    : `TreasuryClaw won this round on Yield Duel.\n\nAgent: ${round.agentYield}% vs Me: ${round.humanYield}%\n\nThink you can beat an ERC-8004 agent on Mantle?\n\nyieldduel.app`;

  const copyTweet = async () => {
    await navigator.clipboard.writeText(tweet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareX = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet)}`,
      "_blank"
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-text/40"
      role="dialog"
      aria-modal
      aria-label="Share duel result"
    >
      <div className="w-full max-w-md bg-white neo-border rounded-[12px] neo-shadow-lg p-6 animate-slide-up">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            <h3 className="text-[17px] font-bold">Share Your Duel</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-neutral-100 rounded-[4px]"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div
          id="share-card-preview"
          className="p-6 bg-primary neo-border rounded-[8px] neo-shadow text-left"
        >
          <Badge variant="default" className="mb-3 bg-white">
            Yield Duel · Mantle RWA
          </Badge>
          <p className="text-[24px] font-bold leading-tight">
            {won ? "HUMAN WINS" : "AGENT WINS"}
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="p-3 bg-white neo-border rounded-[6px]">
              <p className="text-[12px] font-semibold">You</p>
              <p className="font-mono text-[20px] font-bold">{round.humanYield}%</p>
            </div>
            <div className="p-3 bg-white neo-border rounded-[6px]">
              <p className="text-[12px] font-semibold">Agent</p>
              <p className="font-mono text-[20px] font-bold">{round.agentYield}%</p>
            </div>
          </div>
          <p className="mt-4 text-[13px] font-medium">yieldduel.app</p>
        </div>

        <pre className="mt-4 p-3 bg-surface neo-border rounded-[6px] text-[12px] whitespace-pre-wrap font-sans text-text/80 max-h-32 overflow-y-auto">
          {tweet}
        </pre>

        <div className="mt-4 flex gap-3">
          <Button className="flex-1" onClick={shareX}>
            Post on X
          </Button>
          <Button variant="ghost" onClick={copyTweet}>
            <Copy className="h-4 w-4" />
            {copied ? "Copied!" : "Copy"}
          </Button>
        </div>
      </div>
    </div>
  );
}