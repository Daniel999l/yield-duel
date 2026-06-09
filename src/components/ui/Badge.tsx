import { cn } from "@/lib/cn";

type BadgeVariant = "default" | "success" | "warning" | "danger" | "secondary";

const variants: Record<BadgeVariant, string> = {
  default: "bg-neutral-100 text-text",
  success: "bg-success/15 text-success border-success",
  warning: "bg-warning/15 text-warning border-warning",
  danger: "bg-danger/15 text-danger border-danger",
  secondary: "bg-secondary/15 text-secondary border-secondary",
};

export function Badge({
  variant = "default",
  className,
  children,
}: {
  variant?: BadgeVariant;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2.5 py-0.5 text-[12px] font-semibold uppercase tracking-wide",
        "border-2 border-border rounded-[4px]",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}