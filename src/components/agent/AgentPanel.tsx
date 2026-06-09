"use client";

import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { AGENT_PROFILE } from "@/lib/agent";
import { ASSETS } from "@/lib/market";
import type { AgentDecision } from "@/lib/types";
import { Brain, Loader2, Shield } from "lucide-react";

function toSegments(allocation: AgentDecision["allocation"]) {
  return (["USDY", "METH", "MNT"] as const).map((id) => ({
    value: allocation[id],
    color: ASSETS[id].color,
    label: id,
  }));
}

export function AgentPanel({
  decision,
  loading,
}: {
  decision?: AgentDecision;
  loading?: boolean;
}) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4">
        <div className="h-16 w-16 flex items-center justify-center bg-secondary/10 neo-border rounded-[8px]">
          <Loader2 className="h-8 w-8 text-secondary animate-spin" />
        </div>
        <p className="text-[15px] font-semibold">TreasuryClaw is analyzing signals...</p>
        <p className="text-[13px] text-text/50">Reading flows · Computing rebalance · Signing tx</p>
      </div>
    );
  }

  if (!decision) return null;

  return (
    <div className="space-y-5 animate-slide-up">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="secondary">
          <Shield className="h-3 w-3" />
          {AGENT_PROFILE.standard}
        </Badge>
        <Badge variant="default">{decision.confidence}% confidence</Badge>
      </div>

      <ProgressBar segments={toSegments(decision.allocation)} />

      <div className="p-4 bg-surface neo-border rounded-[6px] space-y-3">
        <div className="flex items-center gap-2">
          <Brain className="h-4 w-4 text-secondary" strokeWidth={2.5} />
          <p className="text-[14px] font-semibold">Agent Reasoning</p>
        </div>
        <ul className="space-y-2">
          {decision.reasoning.map((line, i) => (
            <li key={i} className="text-[13px] leading-relaxed text-text/80 flex gap-2">
              <span className="text-secondary font-bold shrink-0">→</span>
              {line}
            </li>
          ))}
        </ul>
      </div>

      <p className="text-[12px] font-mono text-text/50 truncate" title={decision.agentId}>
        ID: {decision.agentId}
      </p>
    </div>
  );
}