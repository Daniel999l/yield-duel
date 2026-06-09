import { AgentIdentity } from "@/components/agent/AgentIdentity";
import { DuelArena } from "@/components/duel/DuelArena";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/layout/Hero";
import { Leaderboard } from "@/components/leaderboard/Leaderboard";
import { OnChainLog } from "@/components/onchain/OnChainLog";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 space-y-20">
          <DuelArena />
          <AgentIdentity />
          <OnChainLog />
          <Leaderboard />
        </div>
      </main>
      <Footer />
    </>
  );
}