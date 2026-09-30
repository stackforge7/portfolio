"use client";

import { useSyncExternalStore } from "react";

export interface ViewportSize {
  width: number;
  height: number;
}

const SERVER_SNAPSHOT = "1440x900";

function subscribe(onChange: () => void) {
  window.addEventListener("resize", onChange);
  return () => window.removeEventListener("resize", onChange);
}

function getSnapshot() {
  return `${window.innerWidth}x${window.innerHeight}`;
}

export function useViewportSize(): ViewportSize {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, () => SERVER_SNAPSHOT);
  const [width, height] = snapshot.split("x").map(Number);
  return { width, height };
}
