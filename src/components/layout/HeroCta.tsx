"use client";

import { Button } from "@/components/ui/Button";
import { MANTLE_SEPOLIA } from "@/lib/mantle";
import { ArrowDown } from "lucide-react";

export function HeroCta() {
  return (
    <div className="mt-8 flex flex-wrap gap-3">
      <Button
        size="lg"
        onClick={() =>
          document.getElementById("duel")?.scrollIntoView({ behavior: "smooth" })
        }
      >
        Start a Duel
        <ArrowDown className="h-4 w-4" />
      </Button>
      <a
        href={`${MANTLE_SEPOLIA.explorer}/address/${MANTLE_SEPOLIA.contractAddress}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Button variant="ghost" size="lg" type="button">
          View Contract
        </Button>
      </a>
    </div>
  );
}