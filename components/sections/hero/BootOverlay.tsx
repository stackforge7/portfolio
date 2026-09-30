import type { Ref } from "react";

const BOOT_STEPS = ["Loading modules", "Preparing workspace", "Loading environment"] as const;

interface BootOverlayProps {
  ref: Ref<HTMLDivElement>;
  onSkip: () => void;
}

/** First-visit loading sequence. Hidden before paint via `html[data-booted]` on repeat visits. */
export function BootOverlay({ ref, onSkip }: BootOverlayProps) {
  return (
    <div
      ref={ref}
      aria-hidden="true"
      onClick={onSkip}
      className="boot-overlay fixed inset-0 z-[70] flex items-center justify-center bg-canvas"
    >
      <div className="w-[min(22rem,calc(100vw-3rem))] font-mono text-xs">
        <p data-boot-title className="tracking-[0.2em] text-fg">
          INITIALIZING DEVELOPER LAB<span className="animate-caret text-accent">_</span>
        </p>
        <div className="mt-5 h-px w-full overflow-hidden bg-line">
          <div data-boot-bar className="h-full origin-left scale-x-0 bg-accent" />
        </div>
        <ul className="mt-5 space-y-2 text-muted">
          {BOOT_STEPS.map((step) => (
            <li key={step} data-boot-line className="flex items-center justify-between">
              <span>{step}</span>
              <span data-boot-check className="text-accent opacity-0">
                ok
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
