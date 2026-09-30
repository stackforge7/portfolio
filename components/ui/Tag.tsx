import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface TagProps {
  children: ReactNode;
  tone?: "default" | "accent";
  className?: string;
}

export function Tag({ children, tone = "default", className }: TagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-1 font-mono text-[0.6875rem] leading-none tracking-wide",
        tone === "accent"
          ? "border-accent/30 bg-accent/10 text-accent-strong"
          : "border-line bg-white/[0.025] text-muted",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function TagList({ items, className }: { items: string[]; className?: string }) {
  return (
    <ul className={cn("flex flex-wrap gap-1.5", className)}>
      {items.map((item) => (
        <li key={item}>
          <Tag>{item}</Tag>
        </li>
      ))}
    </ul>
  );
}
