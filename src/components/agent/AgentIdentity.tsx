import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { AGENT_PROFILE } from "@/lib/agent";
import { MANTLE_SEPOLIA, explorerAddressUrl, shortenHash } from "@/lib/mantle";
import { Bot, ExternalLink, Fingerprint } from "lucide-react";

export function AgentIdentity() {
  const nftAddress = "0x8004a1b2c3d4e5f6789012345678901234567890";

  return (
    <section id="agent" className="space-y-4">
      <div>
        <Badge variant="secondary" className="mb-3">
          <Fingerprint className="h-3 w-3" />
          ERC-8004 Identity
        </Badge>
        <h2 className="text-[27px] font-bold tracking-tight">Meet TreasuryClaw</h2>
        <p className="mt-2 text-[15px] text-text/70 max-w-2xl">
          Every duel is adjudicated by an autonomous agent with on-chain identity,
          reputation, and a permanent decision log on Mantle.
        </p>
      </div>

      <Card padding="lg" className="grid gap-6 md:grid-cols-[auto_1fr]">
        <div className="flex h-24 w-24 items-center justify-center bg-secondary neo-border rounded-[12px] neo-shadow-lg shrink-0">
          <Bot className="h-12 w-12 text-white" strokeWidth={2} />
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-[21px] font-bold">{AGENT_PROFILE.name}</h3>
            <p className="text-[14px] text-text/70 mt-1">{AGENT_PROFILE.description}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge>{AGENT_PROFILE.standard}</Badge>
            <Badge variant="success">Mantle Sepolia</Badge>
            <Badge variant="warning">v{AGENT_PROFILE.version}</Badge>
          </div>

          <dl className="grid gap-3 sm:grid-cols-2 text-[13px]">
            <div className="p-3 bg-surface neo-border rounded-[6px]">
              <dt className="font-semibold text-text/60">Identity Contract</dt>
              <dd className="font-mono mt-1 flex items-center gap-1">
                <a
                  href={explorerAddressUrl(nftAddress)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {shortenHash(nftAddress, 8)}
                </a>
                <ExternalLink className="h-3 w-3" />
              </dd>
            </div>
            <div className="p-3 bg-surface neo-border rounded-[6px]">
              <dt className="font-semibold text-text/60">Decision Log</dt>
              <dd className="font-mono mt-1 flex items-center gap-1">
                <a
                  href={explorerAddressUrl(MANTLE_SEPOLIA.contractAddress)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {shortenHash(MANTLE_SEPOLIA.contractAddress, 8)}
                </a>
                <ExternalLink className="h-3 w-3" />
              </dd>
            </div>
          </dl>
        </div>
      </Card>
    </section>
  );
}