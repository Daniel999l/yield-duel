"use client";

import { Badge } from "@/components/ui/Badge";
import { ConnectWallet } from "@/components/wallet/ConnectWallet";
import { Swords, Zap } from "lucide-react";
import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b-[3px] border-border bg-surface">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-11 w-11 items-center justify-center bg-primary neo-border rounded-[6px] neo-shadow-sm group-hover:neo-btn-lift transition-transform">
            <Swords className="h-5 w-5 text-text" strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-[20px] font-bold leading-none tracking-tight">Yield Duel</p>
            <p className="text-[12px] font-medium text-text/70 mt-0.5">
              Human vs AI · Mantle RWA
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <Badge variant="secondary" className="hidden sm:inline-flex">
            <Zap className="h-3 w-3" />
            Mantle Sepolia
          </Badge>
          <ConnectWallet />
        </div>
      </div>
    </header>
  );
}