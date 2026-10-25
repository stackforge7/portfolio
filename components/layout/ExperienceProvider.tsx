"use client";

import { createContext, use, useCallback, useMemo, useRef, useState, type ReactNode } from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, MotionConfig } from "motion/react";
import { FlaskConical } from "lucide-react";
import posthog from "posthog-js";
import { useLocationHash } from "@/hooks/useLocationHash";
import { posthogLog } from "@/lib/posthog-log";
import { scrollToSection } from "@/lib/scroll";
import { roomAudio } from "@/lib/studio/audio";
import { isSoundEnabled } from "@/lib/studio/preferences";
import { exitStudio, navigateStudio, parseStudioHash } from "@/lib/studio/route";
import type { StudioRoute } from "@/types/portfolio";

const LabExperience = dynamic(
  () => import("@/components/lab/LabExperience").then((mod) => mod.LabExperience),
  { ssr: false },
);

export type ExperienceMode = "intro" | "portfolio" | "lab";

/** A place in the studio to walk to after arriving. */
export type StudioTarget = Pick<StudioRoute, "view"> & Partial<Omit<StudioRoute, "view">>;

interface ExperienceContextValue {
  mode: ExperienceMode;
  /** Whether the interactive studio is ready to mount. */
  labAvailable: boolean;
  enterLab: () => void;
  /** Walks in through the front door, then on to `target`. */
  enterLabAt: (target: StudioTarget) => void;
  exitLab: () => void;
  skipToPortfolio: () => void;
}

const ExperienceContext = createContext<ExperienceContextValue | null>(null);

const LAB_AVAILABLE = true;
/** Lets the studio's focus restore and scroll unlock settle before scrolling the page. */
const SECTION_SCROLL_DELAY_MS = 60;
const NOTICE_DURATION_MS = 4200;
/** Walk-in pacing for shortcuts: arrive, cross to the view, then pick the object up. */
const WALK_TO_VIEW_MS = 1500;
const WALK_TO_OBJECT_MS = 1200;

function inStudio() {
  return parseStudioHash(window.location.hash) !== null;
}

export function ExperienceProvider({ children }: { children: ReactNode }) {
  const hash = useLocationHash();
  // Client navigations use pushState, which fires no event; re-rendering on pathname re-reads the hash.
  usePathname();
  const labOpen = parseStudioHash(hash) !== null;
  const [visited, setVisited] = useState(false);
  const [arrival, setArrival] = useState(false);
  const [noticeVisible, setNoticeVisible] = useState(false);
  const noticeTimer = useRef<number | undefined>(undefined);
  const walkTimers = useRef<number[]>([]);
  const mode: ExperienceMode = labOpen ? "lab" : visited ? "portfolio" : "intro";

  const clearWalk = useCallback(() => {
    walkTimers.current.forEach((timer) => window.clearTimeout(timer));
    walkTimers.current = [];
  }, []);

  const skipToPortfolio = useCallback(() => {
    setVisited(true);
    scrollToSection("about");
  }, []);

  const enterLabAt = useCallback(
    (target?: StudioTarget) => {
      if (!LAB_AVAILABLE) {
        window.clearTimeout(noticeTimer.current);
        setNoticeVisible(true);
        noticeTimer.current = window.setTimeout(() => setNoticeVisible(false), NOTICE_DURATION_MS);
        return;
      }

      clearWalk();
      setVisited(true);
      roomAudio.enterRoom(isSoundEnabled());
      if (inStudio()) {
        if (target) navigateStudio(target);
        return;
      }

      posthog.capture("studio_entered");
      posthogLog.info("studio_entered", { feature: "interactive_studio" });

      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!reduceMotion) {
        setArrival(true);
        roomAudio.play("door");
        roomAudio.play("step", 0.7);
        roomAudio.play("step", 1.05);
      }
      navigateStudio({ view: "room" });
      if (!target) return;
      if (reduceMotion) {
        navigateStudio(target, { replace: true });
        return;
      }

      const walk = (delay: number, next: StudioTarget) => {
        walkTimers.current.push(
          window.setTimeout(() => {
            if (inStudio()) navigateStudio(next);
          }, delay),
        );
      };
      const crosses = target.view !== "room";
      if (crosses) walk(WALK_TO_VIEW_MS, { view: target.view });
      if (target.inspector) walk(crosses ? WALK_TO_VIEW_MS + WALK_TO_OBJECT_MS : WALK_TO_VIEW_MS, target);
    },
    [clearWalk],
  );

  const enterLab = useCallback(() => enterLabAt(), [enterLabAt]);

  const exitLab = useCallback(() => {
    clearWalk();
    setArrival(false);
    exitStudio();
  }, [clearWalk]);

  const openSectionFromLab = useCallback(
    (sectionId: string) => {
      clearWalk();
      setArrival(false);
      exitStudio(() => window.setTimeout(() => scrollToSection(sectionId), SECTION_SCROLL_DELAY_MS));
    },
    [clearWalk],
  );

  const onArrived = useCallback(() => setArrival(false), []);

  const value = useMemo<ExperienceContextValue>(
    () => ({ mode, labAvailable: LAB_AVAILABLE, enterLab, enterLabAt, exitLab, skipToPortfolio }),
    [mode, enterLab, enterLabAt, exitLab, skipToPortfolio],
  );

  return (
    <ExperienceContext value={value}>
      <MotionConfig reducedMotion="user">
        {children}
        {LAB_AVAILABLE && (
          <LabExperience
            hash={hash}
            arrival={arrival}
            onArrived={onArrived}
            onExit={exitLab}
            onOpenSection={openSectionFromLab}
          />
        )}
        <div
          role="status"
          aria-live="polite"
          className="pointer-events-none fixed inset-x-0 bottom-6 z-[90] flex justify-center px-4"
        >
          <AnimatePresence>
            {noticeVisible && (
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="flex max-w-md items-start gap-3 rounded-2xl border border-line-strong bg-surface-raised/95 px-4 py-3 text-sm text-muted shadow-xl shadow-black/40 backdrop-blur"
              >
                <FlaskConical className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
                <span>
                  <span className="text-fg">The interactive studio isn’t ready yet.</span>{" "}
                  Everything is on this page.
                </span>
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </MotionConfig>
    </ExperienceContext>
  );
}

export function useExperience(): ExperienceContextValue {
  const context = use(ExperienceContext);
  if (!context) throw new Error("useExperience must be used within ExperienceProvider");
  return context;
}
