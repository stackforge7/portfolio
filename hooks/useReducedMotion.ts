"use client";

import { useReducedMotion as useMotionReducedMotion } from "motion/react";

/** `true` when the user prefers reduced motion. Safe to read only in effects, handlers, or motion values. */
export function useReducedMotion(): boolean {
  return useMotionReducedMotion() ?? false;
}
