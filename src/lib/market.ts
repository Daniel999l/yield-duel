import type { Allocation, AssetId, AssetMeta, MarketSignal } from "./types";

export const ASSETS: Record<AssetId, AssetMeta> = {
  USDY: {
    id: "USDY",
    name: "Ondo USDY",
    description: "Tokenized U.S. Treasury yield on Mantle RWA rails",
    baseApy: 5.12,
    volatility: 0.08,
    color: "#16A34A",
  },
  METH: {
    id: "METH",
    name: "mETH",
    description: "Mantle liquid staking. ETH yield with L2 boost",
    baseApy: 3.84,
    volatility: 0.22,
    color: "#432DD7",
  },
  MNT: {
    id: "MNT",
    name: "MNT",
    description: "Mantle ecosystem token. Governance and fee capture",
    baseApy: 2.1,
    volatility: 0.45,
    color: "#FDC800",
  },
};

export function getMarketSignals(): MarketSignal[] {
  const now = Date.now();
  const seed = Math.floor(now / 60000);

  const stableInflow = 58 + (seed % 12);
  const ethVol = 18 + (seed % 8);
  const rwaSpread = 1.2 + (seed % 5) * 0.1;

  return [
    {
      id: "stable-inflow",
      label: "Stablecoin net inflow (24h)",
      value: `+$${stableInflow}M`,
      trend: "up",
      weight: 0.35,
    },
    {
      id: "eth-vol",
      label: "ETH realized vol (7d)",
      value: `${ethVol}%`,
      trend: ethVol > 22 ? "up" : "down",
      weight: 0.25,
    },
    {
      id: "rwa-spread",
      label: "RWA yield spread vs DeFi",
      value: `+${rwaSpread.toFixed(1)}%`,
      trend: "up",
      weight: 0.25,
    },
    {
      id: "funding",
      label: "Bybit perp funding (ETH)",
      value: seed % 2 === 0 ? "-0.012%" : "+0.008%",
      trend: seed % 2 === 0 ? "down" : "up",
      weight: 0.15,
    },
  ];
}

export function simulateYield(
  allocation: Allocation,
  signals: MarketSignal[],
  actorSeed: number
): number {
  let total = 0;
  const stableBias =
    signals.find((s) => s.id === "stable-inflow")?.trend === "up" ? 0.4 : -0.1;
  const volPenalty =
    signals.find((s) => s.id === "eth-vol")?.trend === "up" ? -0.3 : 0.15;

  (Object.keys(allocation) as AssetId[]).forEach((asset) => {
    const weight = allocation[asset] / 100;
    const meta = ASSETS[asset];
    let apy = meta.baseApy;

    if (asset === "USDY") apy += stableBias;
    if (asset === "METH") apy += volPenalty;
    if (asset === "MNT") apy += (actorSeed % 3) * 0.2 - 0.2;

    const noise = ((actorSeed * 7 + asset.charCodeAt(0)) % 20) / 100 - 0.1;
    total += weight * (apy + noise);
  });

  return Math.round(total * 100) / 100;
}

export function normalizeAllocation(allocation: Allocation): Allocation {
  const total = allocation.USDY + allocation.METH + allocation.MNT;
  if (total === 0) return { USDY: 34, METH: 33, MNT: 33 };
  return {
    USDY: Math.round((allocation.USDY / total) * 100),
    METH: Math.round((allocation.METH / total) * 100),
    MNT: 100 - Math.round((allocation.USDY / total) * 100) - Math.round((allocation.METH / total) * 100),
  };
}