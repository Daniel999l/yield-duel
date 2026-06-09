"use client";

import { ASSETS } from "@/lib/market";
import type { Allocation, AssetId } from "@/lib/types";
import { cn } from "@/lib/cn";

interface AllocationSliderProps {
  allocation: Allocation;
  onChange: (asset: AssetId, value: number) => void;
  disabled?: boolean;
}

const ORDER: AssetId[] = ["USDY", "METH", "MNT"];

export function AllocationSlider({
  allocation,
  onChange,
  disabled,
}: AllocationSliderProps) {
  return (
    <div className="space-y-5">
      {ORDER.map((assetId) => {
        const asset = ASSETS[assetId];
        return (
          <div key={assetId} className="space-y-2">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[15px] font-semibold">{asset.name}</p>
                <p className="text-[12px] text-text/60">{asset.description}</p>
              </div>
              <span
                className={cn(
                  "font-mono text-[17px] font-bold px-3 py-1 neo-border rounded-[6px]",
                  "bg-white neo-shadow-sm min-w-[4.5rem] text-center"
                )}
              >
                {allocation[assetId]}%
              </span>
            </div>
            <input
              type="range"
              min={5}
              max={85}
              step={1}
              value={allocation[assetId]}
              onChange={(e) => onChange(assetId, Number(e.target.value))}
              disabled={disabled}
              aria-label={`${asset.name} allocation`}
              className="w-full cursor-pointer disabled:opacity-50"
            />
            <div className="flex justify-between text-[12px] font-mono text-text/50">
              <span>Base APY {asset.baseApy}%</span>
              <span>Vol {Math.round(asset.volatility * 100)}%</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}