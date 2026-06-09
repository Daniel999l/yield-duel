import { keccak256, toHex } from "viem";
import type { Allocation } from "./types";

export const MANTLE_SEPOLIA = {
  id: 5003,
  name: "Mantle Sepolia",
  rpcUrl: "https://rpc.sepolia.mantle.xyz",
  explorer: "https://sepolia.mantlescan.xyz",
  contractAddress:
    process.env.NEXT_PUBLIC_YIELD_DUEL_CONTRACT ??
    "0x7a3B9c2e1f4D8A6b0E5C3f2A1d9B8e7C6D5f4A3B",
} as const;

export function generateTxHash(
  actor: "human" | "agent",
  allocation: Allocation,
  timestamp: number
): string {
  const payload = JSON.stringify({ actor, allocation, timestamp });
  const hash = keccak256(toHex(payload));
  return hash;
}

export function generateBlockNumber(timestamp: number): number {
  return 18_420_000 + Math.floor((timestamp - 1_700_000_000_000) / 2000);
}

export function explorerTxUrl(txHash: string): string {
  return `${MANTLE_SEPOLIA.explorer}/tx/${txHash}`;
}

export function explorerAddressUrl(address: string): string {
  return `${MANTLE_SEPOLIA.explorer}/address/${address}`;
}

export function shortenHash(hash: string, chars = 6): string {
  if (hash.length <= chars * 2 + 2) return hash;
  return `${hash.slice(0, chars + 2)}...${hash.slice(-chars)}`;
}