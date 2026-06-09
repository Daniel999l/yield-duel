"use client";

import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { explorerTxUrl, shortenHash } from "@/lib/mantle";
import { useDuelStore } from "@/store/duel-store";
import { Bot, ExternalLink, Link2, User } from "lucide-react";

export function OnChainLog() {
  const logs = useDuelStore((s) => s.logs);

  return (
    <section id="onchain" className="space-y-4">
      <div>
        <Badge variant="default" className="mb-3">
          <Link2 className="h-3 w-3" />
          On-Chain Benchmark
        </Badge>
        <h2 className="text-[27px] font-bold tracking-tight">Decision Log</h2>
        <p className="mt-2 text-[15px] text-text/70">
          Every human and agent allocation is hashed and recorded on Mantle. The
          first permanent AI performance benchmark in Web3.
        </p>
      </div>

      <Card padding="md">
        {logs.length === 0 ? (
          <div className="py-12 text-center text-[15px] text-text/50">
            No decisions logged yet. Commit a duel to see on-chain activity.
          </div>
        ) : (
          <ul className="divide-y-2 divide-border">
            {logs.map((log) => (
              <li key={log.id} className="flex items-start gap-4 py-4 first:pt-0 last:pb-0">
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center neo-border rounded-[6px] ${
                    log.actor === "agent" ? "bg-secondary text-white" : "bg-primary"
                  }`}
                >
                  {log.actor === "agent" ? (
                    <Bot className="h-4 w-4" />
                  ) : (
                    <User className="h-4 w-4" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[14px] font-semibold">{log.action}</p>
                  <p className="text-[13px] text-text/60 mt-0.5 font-mono">
                    USDY {log.allocation.USDY}% · mETH {log.allocation.METH}% · MNT{" "}
                    {log.allocation.MNT}%
                  </p>
                  <a
                    href={explorerTxUrl(log.txHash)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 mt-1.5 text-[12px] font-mono font-medium hover:underline"
                  >
                    {shortenHash(log.txHash)}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
                <time className="text-[12px] text-text/50 shrink-0">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </time>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </section>
  );
}