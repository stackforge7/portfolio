"use client";

import { useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, type TargetAndTransition } from "motion/react";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useIsClient } from "@/hooks/useIsClient";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";
import { cn } from "@/lib/cn";

type DialogVariant = "modal" | "sheet";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  /** id of the element that names the dialog. */
  labelledBy: string;
  children: ReactNode;
  variant?: DialogVariant;
  className?: string;
}

const EASE = [0.16, 1, 0.3, 1] as const;

const panelMotion: Record<
  DialogVariant,
  { initial: TargetAndTransition; animate: TargetAndTransition; exit: TargetAndTransition }
> = {
  modal: {
    initial: { opacity: 0, y: 28, scale: 0.985 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: 16, scale: 0.99 },
  },
  sheet: {
    initial: { opacity: 0, y: -12 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -8 },
  },
};

export function Dialog({
  open,
  onClose,
  labelledBy,
  children,
  variant = "modal",
  className,
}: DialogProps) {
  const isClient = useIsClient();
  const panelRef = useRef<HTMLDivElement>(null);

  useLockBodyScroll(open);
  useFocusTrap(panelRef, open, onClose);

  if (!isClient) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[80]">
          <motion.div
            aria-hidden="true"
            className="absolute inset-0 bg-canvas/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
          />
          <div
            className={cn(
              "pointer-events-none absolute inset-0 flex justify-center",
              variant === "modal" ? "items-end md:items-center md:p-6" : "items-start",
            )}
          >
            <motion.div
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby={labelledBy}
              tabIndex={-1}
              initial={panelMotion[variant].initial}
              animate={panelMotion[variant].animate}
              exit={panelMotion[variant].exit}
              transition={{ duration: 0.5, ease: EASE }}
              className={cn(
                "pointer-events-auto relative w-full overflow-y-auto overscroll-contain border-line-strong bg-surface shadow-2xl shadow-black/60 focus:outline-none",
                variant === "modal" &&
                  "max-h-[92svh] rounded-t-[var(--radius-card)] border md:max-h-[88svh] md:max-w-4xl md:rounded-[var(--radius-card)]",
                variant === "sheet" && "h-[100svh] border-b",
                className,
              )}
            >
              {children}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
