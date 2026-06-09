import { cn } from "@/lib/cn";
import type { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  accent?: "primary" | "secondary" | "success" | "none";
  padding?: "none" | "sm" | "md" | "lg";
}

const accents = {
  primary: "border-t-[6px] border-t-primary",
  secondary: "border-t-[6px] border-t-secondary",
  success: "border-t-[6px] border-t-success",
  none: "",
};

const paddings = {
  none: "p-0",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export function Card({
  accent = "none",
  padding = "md",
  className,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn("neo-card bg-white", accents[accent], paddings[padding], className)}
      {...props}
    >
      {children}
    </div>
  );
}