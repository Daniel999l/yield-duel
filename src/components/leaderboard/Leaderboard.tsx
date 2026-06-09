"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import type { LeaderboardEntry } from "@/lib/types";
import { Crown, Medal } from "lucide-react";

const FALLBACK: LeaderboardEntry[] = [
  { rank: 1, address: "0x7f2a...9c4e", wins: 12, losses: 2, avgYield: 5.8, streak: 0 },
  { rank: 2, address: "0x3b1d...8a2f", wins: 9, losses: 3, avgYield: 5.4, streak: 0 },
  { rank: 3, address: "0x9e4c...1b7a", wins: 8, losses: 4, avgYield: 5.1, streak: 0 },
];

function RankIcon({ rank }: { rank: number }) {
  if (rank === 1) return <Crown className="h-4 w-4 text-primary" />;
  if (rank <= 3) return <Medal className="h-4 w-4 text-text/50" />;
  return <span className="font-mono text-[13px] font-bold w-4 text-center">{rank}</span>;
}

export function Leaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>(FALLBACK);

  useEffect(() => {
    fetch("/api/duels")
      .then((r) => r.json())
      .then((d) => {
        if (d.entries?.length) setEntries(d.entries);
      })
      .catch(() => {});
  }, []);

  return (
    <section id="leaderboard" className="space-y-4">
      <div>
        <Badge variant="success" className="mb-3">
          <Crown className="h-3 w-3" />
          Global Rankings
        </Badge>
        <h2 className="text-[27px] font-bold tracking-tight">Human vs AI Leaderboard</h2>
        <p className="mt-2 text-[15px] text-text/70">
          Top duelists ranked by win rate and average projected RWA yield.
        </p>
      </div>

      <Card padding="none" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[14px]">
            <thead>
              <tr className="border-b-[3px] border-border bg-surface">
                <th className="px-6 py-3 font-semibold">Rank</th>
                <th className="px-6 py-3 font-semibold">Duelist</th>
                <th className="px-6 py-3 font-semibold">W / L</th>
                <th className="px-6 py-3 font-semibold">Avg Yield</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr
                  key={entry.rank}
                  className="border-b-2 border-border/30 last:border-0 hover:bg-surface/80"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center w-6">
                      <RankIcon rank={entry.rank} />
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono font-medium">{entry.address}</td>
                  <td className="px-6 py-4">
                    <span className="text-success font-semibold">{entry.wins}</span>
                    <span className="text-text/40 mx-1">/</span>
                    <span className="text-danger font-semibold">{entry.losses}</span>
                  </td>
                  <td className="px-6 py-4 font-mono font-bold">{entry.avgYield}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </section>
  );
}