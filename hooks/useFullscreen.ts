"use client";

import { useSyncExternalStore } from "react";

function subscribe(onChange: () => void) {
  document.addEventListener("fullscreenchange", onChange);
  return () => document.removeEventListener("fullscreenchange", onChange);
}

/** Fullscreen state for the page; `supported` is false where the API is missing (e.g. iPhone Safari). */
export function useFullscreen() {
  const active = useSyncExternalStore(subscribe, () => Boolean(document.fullscreenElement), () => false);
  const supported = useSyncExternalStore(subscribe, () => Boolean(document.fullscreenEnabled), () => false);

  function toggle() {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void document.documentElement.requestFullscreen().catch(() => undefined);
  }

  return { active, supported, toggle };
}
