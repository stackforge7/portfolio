"use client";

import { useSyncExternalStore } from "react";

const SOUND_KEY = "studio-sound";
const LAST_PROJECT_KEY = "studio-last-project";
const CHANGE_EVENT = "studio-preferences";

/** Room sound stays off until the visitor turns it on. */
export const SOUND_DEFAULT_ON = false;

function read(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Storage can be unavailable (privacy mode); the preference lasts for this page view.
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

function subscribe(onChange: () => void) {
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

export function isSoundEnabled(): boolean {
  const stored = read(SOUND_KEY);
  return stored === null ? SOUND_DEFAULT_ON : stored === "on";
}

export function setSoundEnabled(enabled: boolean) {
  write(SOUND_KEY, enabled ? "on" : "off");
}

export function useSoundEnabled(): boolean {
  return useSyncExternalStore(subscribe, isSoundEnabled, () => SOUND_DEFAULT_ON);
}

export function getLastProject(): string | null {
  return read(LAST_PROJECT_KEY);
}

export function rememberProject(slug: string) {
  write(LAST_PROJECT_KEY, slug);
}

/** The project a returning visitor last opened on the laptop, or `null`. */
export function useLastProject(): string | null {
  return useSyncExternalStore(subscribe, getLastProject, () => null);
}
