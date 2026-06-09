"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";

export function ConnectWallet() {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted,
      }) => {
        const ready = mounted;
        const connected = ready && account && chain;

        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: { opacity: 0, pointerEvents: "none", userSelect: "none" },
            })}
          >
            {!connected ? (
              <button
                onClick={openConnectModal}
                type="button"
                className="inline-flex items-center gap-2 px-4 py-2.5 text-[14px] font-semibold bg-primary text-text neo-border rounded-[6px] neo-shadow-sm transition-all neo-btn-press neo-btn-lift hover:bg-[#e6b600]"
              >
                Connect Wallet
              </button>
            ) : (
              <div className="flex items-center gap-2">
                {chain.unsupported && (
                  <button
                    onClick={openChainModal}
                    type="button"
                    className="px-3 py-2 text-[13px] font-semibold bg-danger text-white neo-border rounded-[6px]"
                  >
                    Wrong network
                  </button>
                )}
                <button
                  onClick={openAccountModal}
                  type="button"
                  className="inline-flex items-center gap-2 px-3 py-2 text-[13px] font-mono font-semibold bg-white neo-border rounded-[6px] neo-shadow-sm hover:bg-neutral-100"
                >
                  {account.displayName}
                </button>
              </div>
            )}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}