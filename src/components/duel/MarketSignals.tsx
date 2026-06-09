"use client";

import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import type { MarketSignal } from "@/lib/types";
import { Activity, TrendingDown, TrendingUp } from "lucide-react";

export function MarketSignals({ signals }: { signals: MarketSignal[] }) {
  return (
    <Card accent="secondary" padding="md">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="h-5 w-5" strokeWidth={2.5} />
        <h3 className="text-[17px] font-semibold">Live Market Signals</h3>
        <span className="ml-auto flex items-center gap-1.5 text-[12px] font-medium">
          <span className="h-2 w-2 rounded-full bg-success animate-pulse-dot" />
          Nansen-style feed
        </span>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {signals.map((signal) => (
          <div
            key={signal.id}
            className="flex items-start justify-between gap-3 p-3 bg-surface neo-border rounded-[6px]"
          >
            <div className="min-w-0">
              <p className="text-[13px] font-medium text-text/70 truncate">
                {signal.label}
              </p>
              <p className="font-mono text-[15px] font-bold mt-0.5">{signal.value}</p>
            </div>
            <Badge
              variant={
                signal.trend === "up"
                  ? "success"
                  : signal.trend === "down"
                    ? "danger"
                    : "default"
              }
            >
              {signal.trend === "up" ? (
                <TrendingUp className="h-3 w-3" />
              ) : signal.trend === "down" ? (
                <TrendingDown className="h-3 w-3" />
              ) : null}
              {signal.trend}
            </Badge>
          </div>
        ))}
      </div>
    </Card>
  );
}