"use client";

import { useSyncExternalStore } from "react";

function subscribe(callback: () => void) {
  window.addEventListener("hashchange", callback);
  window.addEventListener("popstate", callback);
  return () => {
    window.removeEventListener("hashchange", callback);
    window.removeEventListener("popstate", callback);
  };
}

/** Current `location.hash` (including `#`), or `""` during SSR. */
export function useLocationHash(): string {
  return useSyncExternalStore(
    subscribe,
    () => window.location.hash,
    () => "",
  );
}

/**
 * Replaces the hash in place (no history entry, no scroll or router focus handling)
 * and notifies `useLocationHash` subscribers. Pass `""` to clear it.
 */
export function replaceLocationHash(hash: string) {
  const { pathname, search } = window.location;
  const suffix = hash ? `#${hash.replace(/^#/, "")}` : "";
  window.history.replaceState(window.history.state, "", `${pathname}${search}${suffix}`);
  window.dispatchEvent(new HashChangeEvent("hashchange"));
}
