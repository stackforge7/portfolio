"use client";

import { useRef, type ReactNode } from "react";
import { motion, useScroll, useSpring } from "motion/react";

/** Vertical timeline whose accent line draws in as the list scrolls through the viewport. */
export function TimelineRail({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 60%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  return (
    <div ref={ref} className="relative">
      <div aria-hidden="true" className="absolute top-2 bottom-2 left-[7px] w-px bg-line md:left-[calc(12rem+7px)]" />
      <motion.div
        aria-hidden="true"
        style={{ scaleY }}
        className="absolute top-2 bottom-2 left-[7px] w-px origin-top bg-gradient-to-b from-accent via-accent/60 to-accent/10 md:left-[calc(12rem+7px)]"
      />
      <ol className="space-y-14 md:space-y-20">{children}</ol>
    </div>
  );
}
