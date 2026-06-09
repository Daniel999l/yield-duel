import { getDb, isMongoConfigured } from "@/lib/mongodb";
import type { AgentDecision, DuelRound } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  if (!isMongoConfigured()) {
    return NextResponse.json({ saved: false, reason: "MongoDB not configured" });
  }

  const body = await req.json();
  const round = body.round as DuelRound;
  const wallet = body.wallet as string;
  const agentDecision = body.agentDecision as AgentDecision;

  const db = await getDb();
  if (!db) {
    return NextResponse.json({ saved: false, reason: "DB unavailable" }, { status: 503 });
  }

  await db.collection("duels").insertOne({
    round,
    wallet: wallet.toLowerCase(),
    agentDecision,
    createdAt: new Date(),
  });

  return NextResponse.json({ saved: true });
}

export async function GET() {
  if (!isMongoConfigured()) {
    return NextResponse.json({ entries: [] });
  }

  const db = await getDb();
  if (!db) {
    return NextResponse.json({ entries: [] });
  }

  const duels = await db
    .collection("duels")
    .aggregate([
      {
        $group: {
          _id: "$wallet",
          wins: {
            $sum: { $cond: [{ $eq: ["$round.winner", "human"] }, 1, 0] },
          },
          losses: {
            $sum: { $cond: [{ $eq: ["$round.winner", "agent"] }, 1, 0] },
          },
          avgYield: { $avg: "$round.humanYield" },
        },
      },
      { $sort: { wins: -1 } },
      { $limit: 10 },
    ])
    .toArray();

  const entries = duels.map((d, i) => ({
    rank: i + 1,
    address: `${String(d._id).slice(0, 6)}...${String(d._id).slice(-4)}`,
    wins: d.wins as number,
    losses: d.losses as number,
    avgYield: Math.round((d.avgYield as number) * 10) / 10,
    streak: 0,
  }));

  return NextResponse.json({ entries });
}