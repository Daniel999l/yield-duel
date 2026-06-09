import { MANTLE_SEPOLIA } from "@/lib/mantle";

export function Footer() {
  return (
    <footer className="border-t-[3px] border-border bg-white mt-16">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[13px] text-text/60">
        <p>
          <span className="font-bold text-text">Yield Duel</span> | Autonomous RWA
          treasury on Mantle
        </p>
        <div className="flex gap-4 font-medium">
          <a
            href="https://docs.mantle.xyz/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-text hover:underline"
          >
            Docs
          </a>
          <a
            href="https://www.mantle.xyz/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-text hover:underline"
          >
            Mantle
          </a>
          <a
            href={MANTLE_SEPOLIA.explorer}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-text hover:underline"
          >
            Explorer
          </a>
        </div>
      </div>
    </footer>
  );
}