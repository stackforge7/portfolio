import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";
import type { ScenePoint } from "@/types/portfolio";

interface ScenePillProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  anchor: ScenePoint;
  children: ReactNode;
  size?: "md" | "lg";
  /** Shows the object "warming up" while the view it leads to loads. */
  loading?: boolean;
}

/** Frosted label pinned to a point on a scene image. */
export function ScenePill({
  anchor,
  children,
  size = "md",
  loading = false,
  className,
  style,
  ...props
}: ScenePillProps) {
  return (
    <button
      type="button"
      aria-busy={loading || undefined}
      style={{ left: `${anchor.x}%`, top: `${anchor.y}%`, ...style }}
      className={cn(
        "glass group absolute inline-flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-full whitespace-nowrap text-white shadow-[0_8px_30px_-8px_rgb(0_0_0/0.6)] transition-[background-color,border-color,scale] duration-300 ease-out-expo hover:scale-105 hover:border-white/40 hover:bg-black/55 active:scale-[0.98]",
        size === "lg" ? "h-14 px-8 text-base font-medium" : "h-10 px-4 text-sm",
        className,
      )}
      {...props}
    >
      <span aria-hidden="true" className="relative flex size-2">
        {loading ? (
          <span className="relative inline-flex size-2 animate-ember rounded-full bg-[#ffb56b]" />
        ) : (
          <>
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent/70 motion-reduce:hidden" />
            <span className="relative inline-flex size-2 rounded-full bg-accent-strong" />
          </>
        )}
      </span>
      {children}
    </button>
  );
}
