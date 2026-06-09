"use client";

import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import { injectedWallet, metaMaskWallet } from "@rainbow-me/rainbowkit/wallets";
import { createConfig, http } from "wagmi";
import { mantleSepolia } from "@/lib/chains";

// Injected + MetaMask only. No WalletConnect Cloud signup required.
const connectors = connectorsForWallets(
  [
    {
      groupName: "Recommended",
      wallets: [injectedWallet, metaMaskWallet],
    },
  ],
  { appName: "Yield Duel", projectId: "yield-duel-local" }
);

export const wagmiConfig = createConfig({
  connectors,
  chains: [mantleSepolia],
  transports: {
    [mantleSepolia.id]: http(
      process.env.NEXT_PUBLIC_MANTLE_RPC_URL ?? "https://rpc.sepolia.mantle.xyz"
    ),
  },
  ssr: true,
});