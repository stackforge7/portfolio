import type { StudioInspectorId, StudioRoute, StudioViewId } from "@/types/portfolio";

const PREFIX = "#studio";
const VIEWS: StudioViewId[] = ["room", "desk", "shelf", "reading"];
const INSPECTORS: StudioInspectorId[] = [
  "experience",
  "systems",
  "about",
  "projects",
  "contact",
  "shelf",
  "journal",
  "resume",
];

/** Extra fields kept in `history.state` next to the Next.js router's own. */
interface StudioHistoryState {
  /** Number of studio entries pushed since the page's own entry. */
  studioDepth?: number;
  /** Hash of the entry this one was pushed from. */
  studioFrom?: string;
}

export function parseStudioHash(hash: string): StudioRoute | null {
  if (hash !== PREFIX && !hash.startsWith(`${PREFIX}/`)) return null;
  const [view, inspector, param] = hash.slice(PREFIX.length + 1).split("/");
  const safeView = VIEWS.includes(view as StudioViewId) ? (view as StudioViewId) : "room";
  const safeInspector = INSPECTORS.includes(inspector as StudioInspectorId)
    ? (inspector as StudioInspectorId)
    : null;
  return {
    view: safeView,
    inspector: safeInspector,
    param: safeInspector && param ? decodeURIComponent(param) : null,
  };
}

export function formatStudioHash(route: Partial<StudioRoute> & Pick<StudioRoute, "view">): string {
  const parts = [route.view === "room" && !route.inspector ? "" : route.view];
  if (route.inspector) parts.push(route.inspector);
  if (route.inspector && route.param) parts.push(encodeURIComponent(route.param));
  const suffix = parts.filter(Boolean).join("/");
  return suffix ? `${PREFIX}/${suffix}` : PREFIX;
}

function currentState(): StudioHistoryState & Record<string, unknown> {
  return (window.history.state as Record<string, unknown> | null) ?? {};
}

function write(hash: string, state: Record<string, unknown>, replace: boolean) {
  const { pathname, search } = window.location;
  const url = `${pathname}${search}${hash}`;
  if (replace) window.history.replaceState(state, "", url);
  else window.history.pushState(state, "", url);
  window.dispatchEvent(new HashChangeEvent("hashchange"));
}

/** Moves to a studio location. Pushing adds a history entry so Back walks out step by step. */
export function navigateStudio(
  route: Partial<StudioRoute> & Pick<StudioRoute, "view">,
  { replace = false }: { replace?: boolean } = {},
) {
  const hash = formatStudioHash(route);
  if (hash === window.location.hash) return;
  const state = currentState();
  if (replace) {
    write(hash, { ...state }, true);
    return;
  }
  const inStudio = parseStudioHash(window.location.hash) !== null;
  write(hash, { studioDepth: inStudio ? (state.studioDepth ?? 0) + 1 : 1, studioFrom: window.location.hash }, false);
}

/** Goes up to `route`, reusing history when the current entry was opened from there. */
export function navigateStudioUp(route: Partial<StudioRoute> & Pick<StudioRoute, "view">) {
  if (currentState().studioFrom === formatStudioHash(route)) {
    window.history.back();
    return;
  }
  navigateStudio(route, { replace: true });
}

/** Leaves the studio, unwinding its history entries when possible. */
export function exitStudio(onExited?: () => void) {
  const depth = currentState().studioDepth ?? 0;
  if (depth > 0) {
    if (onExited) window.addEventListener("popstate", () => onExited(), { once: true });
    window.history.go(-depth);
    return;
  }
  write("", { ...currentState(), studioDepth: undefined, studioFrom: undefined }, true);
  onExited?.();
}
