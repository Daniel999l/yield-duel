import { cn } from "@/lib/cn";

export function ProgressBar({
  segments,
  className,
}: {
  segments: { value: number; color: string; label: string }[];
  className?: string;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <div
        className="flex h-8 w-full overflow-hidden neo-border rounded-[6px]"
        role="img"
        aria-label={segments.map((s) => `${s.label} ${s.value}%`).join(", ")}
      >
        {segments.map((seg) => (
          <div
            key={seg.label}
            className="h-full transition-all duration-500 border-r-2 border-border last:border-r-0"
            style={{ width: `${seg.value}%`, backgroundColor: seg.color }}
            title={`${seg.label}: ${seg.value}%`}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-3">
        {segments.map((seg) => (
          <div key={seg.label} className="flex items-center gap-1.5 text-[13px] font-medium">
            <span
              className="h-3 w-3 neo-border rounded-[3px]"
              style={{ backgroundColor: seg.color }}
            />
            <span>{seg.label}</span>
            <span className="font-mono font-semibold">{seg.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}