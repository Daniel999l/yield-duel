import { Badge } from "@/components/ui/Badge";
import { HeroCta } from "@/components/layout/HeroCta";
import { Sparkles } from "lucide-react";

export function Hero() {
  return (
    <section>
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="max-w-3xl">
          <Badge variant="warning" className="mb-4">
            <Sparkles className="h-3 w-3" />
            RWA Treasury Benchmark
          </Badge>

          <h1 className="text-[35px] sm:text-[48px] font-bold leading-[1.05] tracking-tight">
            Human vs AI.
            <br />
            <span className="bg-primary px-2 neo-border inline-block mt-2 neo-shadow-sm">
              Real yield. On-chain.
            </span>
          </h1>

          <p className="mt-6 text-[17px] leading-relaxed text-text/75 max-w-2xl">
            Yield Duel benchmarks autonomous RWA treasury agents against human
            intuition on Mantle. Every allocation, rebalance, and outcome is permanently
            recorded. Every round is verifiable on-chain.
          </p>

          <HeroCta />

          <dl className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Assets", value: "USDY · mETH · MNT" },
              { label: "Agent Standard", value: "ERC-8004" },
              { label: "Chain", value: "Mantle" },
              { label: "Mode", value: "Human vs AI" },
            ].map((item) => (
              <div
                key={item.label}
                className="p-4 bg-white neo-border rounded-[6px] neo-shadow-sm"
              >
                <dt className="text-[12px] font-semibold text-text/60 uppercase tracking-wide">
                  {item.label}
                </dt>
                <dd className="mt-1 text-[14px] font-bold">{item.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}