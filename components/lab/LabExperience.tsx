"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, DoorOpen, LayoutList, Maximize, Minimize, Volume2, VolumeX, X } from "lucide-react";
import { Ambient } from "@/components/lab/Ambient";
import { JournalInspector } from "@/components/lab/inspectors/JournalInspector";
import { PhoneInspector } from "@/components/lab/inspectors/PhoneInspector";
import { ProjectsWindow } from "@/components/lab/inspectors/ProjectsWindow";
import { ShelfInspector } from "@/components/lab/inspectors/ShelfInspector";
import { LabPanelContent, type PanelInspectorId } from "@/components/lab/LabPanels";
import { ScenePill } from "@/components/lab/ScenePill";
import { SceneScreens } from "@/components/lab/screens/DeskScreens";
import { MediaImage } from "@/components/ui/MediaImage";
import { profile } from "@/data/profile";
import { shelfItems, studioDoorAnchor, studioExteriorImage, studioViewOrder, studioViews } from "@/data/scene";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useFullscreen } from "@/hooks/useFullscreen";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useViewportSize, type ViewportSize } from "@/hooks/useViewportSize";
import { cn } from "@/lib/cn";
import { coverSize, focusCamera, panLimit, type CameraTransform } from "@/lib/scene";
import { roomAudio, type RoomSound } from "@/lib/studio/audio";
import { setSoundEnabled, useSoundEnabled } from "@/lib/studio/preferences";
import { navigateStudio, navigateStudioUp, parseStudioHash } from "@/lib/studio/route";
import type { StudioHotspot, StudioInspectorId, StudioRoute, StudioView, StudioViewId } from "@/types/portfolio";

const EASE = [0.16, 1, 0.3, 1] as const;
const DESKTOP_MIN_WIDTH = 1024;
const PANEL_GAP = 24;
/** Mobile sheet height as a share of the viewport, plus the space reserved for the bottom control. */
const SHEET_RATIO = 0.56;
const SHEET_OFFSET = 80;
const TITLE_ID = "studio-title";
const REST: CameraTransform = { x: 0, y: 0, scale: 1 };
const PANEL_INSPECTORS = new Set<StudioInspectorId>(["experience", "systems", "about", "resume"]);

const OPEN_SOUND: Partial<Record<StudioInspectorId, RoomSound>> = {
  projects: "click",
  about: "keys",
  contact: "lift",
  journal: "bookOpen",
  resume: "paper",
};
const CLOSE_SOUND: Partial<Record<StudioInspectorId, RoomSound>> = {
  contact: "setdown",
  journal: "bookClose",
  resume: "paper",
  shelf: "spine",
};

type PanelSide = "left" | "right";

function isPanelInspector(id: StudioInspectorId | null): id is PanelInspectorId {
  return id !== null && PANEL_INSPECTORS.has(id);
}

function panelWidth(viewportWidth: number, wide: boolean) {
  return wide ? Math.min(760, viewportWidth * 0.56) : Math.min(480, viewportWidth * 0.4);
}

/** Objects on the right of the frame get their panel on the left so they stay visible. */
function panelSide(hotspot: StudioHotspot | undefined): PanelSide {
  return (hotspot?.focus?.x ?? 0) > 55 ? "left" : "right";
}

function hotspotFor(view: StudioView, route: StudioRoute): StudioHotspot | undefined {
  const candidates = view.hotspots.filter((item) => item.to.view === view.id && item.to.inspector === route.inspector);
  return candidates.find((item) => item.to.param && item.to.param === route.param) ?? candidates[0];
}

function inspectorCamera(view: StudioView, route: StudioRoute, viewport: ViewportSize): CameraTransform {
  const hotspot = route.inspector ? hotspotFor(view, route) : undefined;
  if (!hotspot?.focus) return REST;
  let target = { x: 0, y: 0 };
  if (isPanelInspector(route.inspector)) {
    if (viewport.width >= DESKTOP_MIN_WIDTH) {
      const offset = (panelWidth(viewport.width, route.inspector === "resume") + PANEL_GAP) / 2;
      target = { x: panelSide(hotspot) === "right" ? -offset : offset, y: 0 };
    } else {
      target = { x: 0, y: (viewport.height * (1 - SHEET_RATIO) - SHEET_OFFSET) / 2 - viewport.height / 2 };
    }
  }
  return focusCamera(hotspot.focus, hotspot.focus.zoom, viewport, target);
}

function upFrom(route: StudioRoute): StudioRoute | null {
  if (route.inspector) return { view: route.view, inspector: null, param: null };
  const parent = studioViews[route.view].parent;
  return parent ? { view: parent, inspector: null, param: null } : null;
}

function lowerTitle(title: string) {
  return title.replace(/^The /, "the ");
}

interface LabExperienceProps {
  /** Current `location.hash`; the studio is open while it starts with `#studio`. */
  hash: string;
  /** Play the walk-in from the front door. */
  arrival: boolean;
  onArrived: () => void;
  onExit: () => void;
  onOpenSection: (sectionId: string) => void;
}

/**
 * The studio: photographic views in one coordinate system. Hotspots dolly the camera into
 * close-ups or open the object in the visitor's hands. Location lives in the URL hash so
 * Back, Escape, deep links, and history all work.
 */
export function LabExperience({ hash, arrival, onArrived, onExit, onOpenSection }: LabExperienceProps) {
  const route = parseStudioHash(hash);
  const open = route !== null;
  const [lastHash, setLastHash] = useState(hash);
  if (open && hash !== lastHash) setLastHash(hash);
  const shownRoute = route ?? parseStudioHash(lastHash);

  const containerRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const [leaving, setLeaving] = useState(false);

  function goUp() {
    if (!route) return;
    const target = upFrom(route);
    if (target) navigateStudioUp(target);
    else leave();
  }

  function leave() {
    if (reduceMotion) {
      onExit();
      return;
    }
    roomAudio.play("door");
    setLeaving(true);
  }

  function finishLeaving() {
    setLeaving(false);
    onExit();
  }

  useLockBodyScroll(open);
  useFocusTrap(containerRef, open, goUp);

  useEffect(() => {
    if (open) roomAudio.markInRoom();
    else roomAudio.leaveRoom();
  }, [open]);

  return (
    <AnimatePresence>
      {open && shownRoute && (
        <motion.div
          ref={containerRef}
          key="studio"
          role="dialog"
          aria-modal="true"
          aria-labelledby={TITLE_ID}
          tabIndex={-1}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="fixed inset-0 z-[80] overflow-hidden bg-canvas [container-type:size] focus:outline-none"
        >
          <Studio
            route={shownRoute}
            containerRef={containerRef}
            arrival={arrival}
            leaving={leaving}
            onArrived={onArrived}
            onLeft={finishLeaving}
            onUp={goUp}
            onLeave={leave}
            onOpenSection={onOpenSection}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface StudioProps {
  route: StudioRoute;
  containerRef: React.RefObject<HTMLDivElement | null>;
  arrival: boolean;
  leaving: boolean;
  onArrived: () => void;
  onLeft: () => void;
  onUp: () => void;
  onLeave: () => void;
  onOpenSection: (sectionId: string) => void;
}

function Studio({ route, containerRef, arrival, leaving, onArrived, onLeft, onUp, onLeave, onOpenSection }: StudioProps) {
  const viewport = useViewportSize();
  const stage = coverSize(viewport);
  const active = studioViews[route.view];
  const [loaded, setLoaded] = useState<Partial<Record<StudioViewId, boolean>>>({});
  const [pending, setPending] = useState<{ key: string; route: StudioRoute } | null>(null);
  const previous = useRef<StudioRoute | null>(null);

  function go(hotspot: StudioHotspot, view: StudioView) {
    const target: StudioRoute = {
      view: hotspot.to.view,
      inspector: hotspot.to.inspector ?? null,
      param: hotspot.to.param ?? null,
    };
    if (target.view !== route.view && !loaded[target.view]) {
      setPending({ key: `${view.id}:${hotspot.id}`, route: target });
      return;
    }
    navigateStudio(target);
  }

  function markLoaded(id: StudioViewId) {
    setLoaded((current) => (current[id] ? current : { ...current, [id]: true }));
    if (pending?.route.view === id) {
      navigateStudio(pending.route);
      setPending(null);
    }
  }

  const routeKey = `${route.view}/${route.inspector ?? ""}/${route.param ?? ""}`;
  useEffect(() => {
    const before = previous.current;
    previous.current = route;
    roomAudio.setArea(route.view);
    if (!before) return;

    if (before.view !== route.view) {
      roomAudio.play("step");
      roomAudio.play("step", 0.38);
    }
    if (before.inspector !== route.inspector) {
      const closed = before.inspector && CLOSE_SOUND[before.inspector];
      const opened = route.inspector && OPEN_SOUND[route.inspector];
      if (closed) roomAudio.play(closed);
      if (opened) roomAudio.play(opened, closed ? 0.15 : 0);
      if (route.inspector === "shelf") {
        const item = shelfItems.find((entry) => entry.id === route.param);
        roomAudio.play(item?.kind === "hobby" ? "lift" : item?.kind === "diploma" ? "frame" : "spine");
      }
    }

    const frame = requestAnimationFrame(() => {
      const container = containerRef.current;
      if (!container || route.inspector) return;
      const focusHotspot = (predicate: (hotspot: StudioHotspot) => boolean) => {
        const target = studioViews[route.view].hotspots.find(predicate);
        const element = target && container.querySelector<HTMLElement>(`[data-hotspot="${route.view}:${target.id}"]`);
        element?.focus({ preventScroll: true });
        return Boolean(element);
      };
      if (before.inspector && before.view === route.view) {
        focusHotspot((hotspot) => hotspot.to.inspector === before.inspector);
      } else if (before.view !== route.view) {
        const cameBack = studioViews[before.view].parent === route.view;
        if (!(cameBack && focusHotspot((hotspot) => hotspot.to.view === before.view && !hotspot.to.inspector))) {
          container.querySelector<HTMLElement>("#studio-view-title")?.focus({ preventScroll: true });
        }
      }
    });
    return () => cancelAnimationFrame(frame);
    // routeKey captures every route change; `route` itself is a fresh object each render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeKey]);

  const hotspot = route.inspector ? hotspotFor(active, route) : undefined;
  const limit = panLimit(viewport);
  const activeReady = Boolean(loaded[active.id]);
  const backLabel = route.inspector
    ? `Back to ${lowerTitle(active.title)}`
    : active.parent
      ? `Back to ${lowerTitle(studioViews[active.parent].title)}`
      : "Outside";
  const pendingView = pending ? studioViews[pending.route.view] : null;

  return (
    <>
      <h2 id={TITLE_ID} className="sr-only">
        {profile.name}&apos;s studio
      </h2>
      <p id="studio-view-title" tabIndex={-1} className="sr-only">
        {active.title}
      </p>
      <p role="status" aria-live="polite" className="sr-only">
        {pendingView ? `Walking to ${lowerTitle(pendingView.title)}…` : active.title}
      </p>

      {studioViewOrder.map((id) => {
        const view = studioViews[id];
        if (id !== "room" && !loaded.room) return null;
        const role = id === active.id ? "active" : id === active.parent ? "parent" : "idle";
        const camera =
          role === "active"
            ? inspectorCamera(view, route, viewport)
            : role === "parent"
              ? focusCamera(active.entry, active.entry.zoom, viewport, { x: 0, y: 0 })
              : { ...REST, scale: view.parent ? 1.12 : 1 };
        const visible = role !== "idle" && Boolean(loaded[id]);
        const interactive = role === "active" && !route.inspector && !leaving;
        const canPan = interactive && limit > viewport.width * 0.15;

        return (
          <motion.div
            key={id}
            aria-hidden={role !== "active"}
            inert={role !== "active"}
            className={cn("scene-cover", canPan && "cursor-grab active:cursor-grabbing")}
            style={{ zIndex: role === "active" ? 2 : role === "parent" ? 1 : 0 }}
            initial={{ opacity: 0, scale: id === "room" ? 1.14 : 1.12 }}
            animate={{ opacity: visible ? 1 : 0, x: camera.x, y: camera.y, scale: camera.scale }}
            transition={{
              default: { duration: 1, ease: EASE },
              opacity: { duration: role === "active" ? 0.6 : 0.5, delay: role === "active" && id !== "room" ? 0.35 : 0 },
            }}
            drag={canPan ? "x" : false}
            dragConstraints={{ left: -limit, right: limit }}
            dragElastic={0.06}
          >
            <MediaImage
              image={view.image}
              preload={id === "room"}
              loading="eager"
              sizes="(max-aspect-ratio: 16/9) 178vh, 100vw"
              quality={80}
              draggable={false}
              className="select-none"
              onLoad={() => markLoaded(id)}
            />
            <Ambient view={id} />
            {view.screens.length > 0 && <SceneScreens screens={view.screens} stage={stage} active={role === "active"} />}

            <div inert={!interactive} className={cn("transition-opacity duration-300", !interactive && "opacity-0")}>
              {view.hotspots.map((item, index) => {
                const key = `${id}:${item.id}`;
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: (arrival ? 1.1 : 0.5) + index * 0.06, ease: EASE }}
                  >
                    <ScenePill
                      anchor={item.anchor}
                      data-hotspot={key}
                      loading={pending?.key === key}
                      aria-label={`${item.label}: ${item.object}`}
                      onClick={() => go(item, view)}
                    >
                      {item.label}
                    </ScenePill>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        );
      })}

      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0 z-[3] bg-[radial-gradient(ellipse_at_center,transparent_45%,rgb(0_0_0/0.45))] transition-colors duration-700",
          route.inspector && "bg-black/35",
        )}
      />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 z-[3] h-28 bg-gradient-to-b from-black/50 to-transparent" />

      {!activeReady && (
        <div className="absolute inset-0 z-[4] flex items-center justify-center">
          <p className="glass inline-flex items-center gap-3 rounded-full px-5 py-2.5 text-sm text-white">
            <span aria-hidden="true" className="size-2 animate-ember rounded-full bg-[#ffb56b]" />
            Warming up {lowerTitle(active.title)}…
          </p>
        </div>
      )}

      <StudioControls onOpenSection={onOpenSection} onLeave={onLeave} />

      {!route.inspector && !leaving && (
        <nav
          aria-label={`Objects in ${lowerTitle(active.title)}`}
          className="absolute inset-x-0 bottom-20 z-20 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] md:hidden"
        >
          {active.hotspots.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => go(item, active)}
              className="glass h-9 shrink-0 rounded-full px-4 text-sm text-white"
            >
              {item.label}
            </button>
          ))}
        </nav>
      )}

      <AnimatePresence mode="wait">
        {route.inspector && (
          <InspectorFrame key={`${route.view}/${route.inspector}`}>
            <Inspector route={route} hotspot={hotspot} onUp={onUp} onOpenSection={onOpenSection} />
          </InspectorFrame>
        )}
      </AnimatePresence>

      <div className="absolute inset-x-0 bottom-5 z-40 flex justify-center">
        <button
          type="button"
          onClick={onUp}
          className="glass inline-flex h-11 items-center gap-2 rounded-full px-5 text-sm text-white transition-colors hover:bg-black/60"
        >
          {route.inspector || active.parent ? (
            <ArrowLeft className="size-4" aria-hidden="true" />
          ) : (
            <DoorOpen className="size-4" aria-hidden="true" />
          )}
          {backLabel}
        </button>
      </div>

      {arrival && <ExteriorLayer direction="in" onDone={onArrived} />}
      {leaving && <ExteriorLayer direction="out" onDone={onLeft} />}
    </>
  );
}

/** The front of the studio, dollying through the door on arrival or back out on leaving. */
function ExteriorLayer({ direction, onDone }: { direction: "in" | "out"; onDone: () => void }) {
  const inbound = direction === "in";
  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-50 [container-type:size]"
      initial={{ opacity: inbound ? 1 : 0 }}
      animate={{ opacity: inbound ? 0 : 1 }}
      transition={inbound ? { duration: 0.55, delay: 0.7, ease: "easeOut" } : { duration: 0.45, ease: "easeIn" }}
      onAnimationComplete={onDone}
    >
      <motion.div
        className="scene-cover"
        style={{ transformOrigin: `${studioDoorAnchor.x}% ${studioDoorAnchor.y}%` }}
        initial={{ scale: inbound ? 1 : 2.2 }}
        animate={{ scale: inbound ? 2.4 : 1 }}
        transition={{ duration: inbound ? 1.25 : 0.8, ease: inbound ? [0.5, 0, 0.3, 1] : EASE }}
      >
        <MediaImage image={studioExteriorImage} decorative sizes="(max-aspect-ratio: 16/9) 178vh, 100vw" quality={75} />
      </motion.div>
    </motion.div>
  );
}

/** Moves focus into an inspector once it mounts. */
function InspectorFrame({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const root = ref.current;
      const target = root?.querySelector<HTMLElement>("[data-autofocus], [data-inspector-root]");
      target?.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(frame);
  }, []);
  return (
    <div ref={ref} className="contents">
      {children}
    </div>
  );
}

interface InspectorProps {
  route: StudioRoute;
  hotspot: StudioHotspot | undefined;
  onUp: () => void;
  onOpenSection: (sectionId: string) => void;
}

function Inspector({ route, hotspot, onUp, onOpenSection }: InspectorProps) {
  const setParam = (param: string | null) => navigateStudio({ ...route, param }, { replace: true });

  if (isPanelInspector(route.inspector)) {
    const wide = route.inspector === "resume";
    return (
      <LabPanel label={hotspot ? `${hotspot.label}: ${hotspot.object}` : route.inspector} wide={wide} side={panelSide(hotspot)}>
        <LabPanelContent
          panel={route.inspector}
          place={hotspot ? `On the ${hotspot.object.toLowerCase()}` : "In the studio"}
          onOpenSection={onOpenSection}
        />
      </LabPanel>
    );
  }

  switch (route.inspector) {
    case "projects":
      return <ProjectsWindow slug={route.param} onSelect={setParam} onClose={onUp} />;
    case "contact":
      return <PhoneInspector onClose={onUp} />;
    case "shelf":
      return (
        <ShelfInspector
          itemId={route.param}
          onSelect={setParam}
          onOpenProject={(slug) => navigateStudio({ view: "desk", inspector: "projects", param: slug })}
        />
      );
    case "journal":
      return (
        <JournalInspector
          onOpenResume={() => navigateStudio({ view: "reading", inspector: "resume", param: null }, { replace: true })}
        />
      );
    default:
      return null;
  }
}

interface LabPanelProps {
  label: string;
  wide: boolean;
  side: PanelSide;
  children: ReactNode;
}

function LabPanel({ label, wide, side, children }: LabPanelProps) {
  const shift = side === "right" ? 24 : -24;

  return (
    <motion.section
      data-inspector-root
      tabIndex={-1}
      aria-label={label}
      initial={{ opacity: 0, x: shift }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: shift * 0.66, transition: { duration: 0.2 } }}
      transition={{ duration: 0.5, delay: 0.3, ease: EASE }}
      className={cn(
        "scrollbar-subtle absolute inset-x-3 bottom-20 z-30 max-h-[56svh] overflow-y-auto overscroll-contain rounded-3xl p-6 shadow-2xl shadow-black/50 focus:outline-none md:p-8",
        "lg:inset-x-auto lg:top-20 lg:bottom-24 lg:max-h-none",
        side === "right" ? "lg:right-6" : "lg:left-6",
        wide
          ? "border border-stone-300 bg-[#f4efe6] lg:w-[min(47.5rem,56vw)]"
          : "glass bg-black/55 lg:w-[min(30rem,40vw)]",
      )}
    >
      {children}
    </motion.section>
  );
}

const CONTROL = "glass inline-flex size-10 items-center justify-center rounded-full text-white transition-colors hover:bg-black/60";

function StudioControls({ onOpenSection, onLeave }: { onOpenSection: (id: string) => void; onLeave: () => void }) {
  const soundOn = useSoundEnabled();
  const fullscreen = useFullscreen();

  function toggleSound() {
    setSoundEnabled(!soundOn);
    roomAudio.setEnabled(!soundOn);
  }

  return (
    <div className="absolute inset-x-0 top-0 z-40 flex items-center justify-between gap-3 p-4 md:p-6">
      <p className="font-mono text-[0.6875rem] tracking-[0.24em] text-white/80 uppercase max-sm:invisible">
        {profile.name} <span className="text-white/45">· Studio</span>
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={toggleSound}
          aria-pressed={soundOn}
          aria-label="Room sound"
          title={soundOn ? "Room sound on" : "Room sound off"}
          className={CONTROL}
        >
          {soundOn ? <Volume2 className="size-4" aria-hidden="true" /> : <VolumeX className="size-4" aria-hidden="true" />}
        </button>
        {fullscreen.supported && (
          <button
            type="button"
            onClick={fullscreen.toggle}
            aria-pressed={fullscreen.active}
            aria-label="Fullscreen"
            title={fullscreen.active ? "Exit fullscreen" : "Fullscreen"}
            className={CONTROL}
          >
            {fullscreen.active ? <Minimize className="size-4" aria-hidden="true" /> : <Maximize className="size-4" aria-hidden="true" />}
          </button>
        )}
        <button
          type="button"
          onClick={() => onOpenSection("about")}
          className="glass inline-flex h-10 items-center gap-2 rounded-full px-4 font-mono text-[0.6875rem] tracking-[0.14em] text-white uppercase transition-colors hover:bg-black/60"
        >
          <LayoutList className="size-3.5" aria-hidden="true" />
          <span className="hidden sm:inline">Classic portfolio</span>
          <span className="sm:hidden">Portfolio</span>
        </button>
        <button type="button" onClick={onLeave} aria-label="Leave the studio" data-autofocus className={CONTROL}>
          <X className="size-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
