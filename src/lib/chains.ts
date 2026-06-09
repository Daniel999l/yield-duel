import { defineChain } from "viem";

export const mantleSepolia = defineChain({
  id: 5003,
  name: "Mantle Sepolia",
  nativeCurrency: { name: "MNT", symbol: "MNT", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://rpc.sepolia.mantle.xyz"] },
  },
  blockExplorers: {
    default: {
      name: "Mantle Sepolia Explorer",
      url: "https://sepolia.mantlescan.xyz",
    },
  },
  testnet: true,
});

export const YIELD_DUEL_CONTRACT = process.env.NEXT_PUBLIC_YIELD_DUEL_CONTRACT as
  | `0x${string}`
  | undefined;

export function isContractConfigured(): boolean {
  const addr = YIELD_DUEL_CONTRACT;
  return !!addr && addr !== "0x0000000000000000000000000000000000000000";
}