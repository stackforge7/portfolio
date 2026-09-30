"use client";

import { useEffect, useEffectEvent, useRef, type CSSProperties, type PointerEvent } from "react";
import { AnimatePresence, motion, useSpring } from "motion/react";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  CookingPot,
  Dumbbell,
  Footprints,
  Gamepad2,
  Hand,
  Mountain,
  Plane,
  type LucideIcon,
} from "lucide-react";
import { MediaImage } from "@/components/ui/MediaImage";
import { shelfItems } from "@/data/scene";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { roomAudio, type RoomSound } from "@/lib/studio/audio";
import type { ShelfItem, ShelfItemKind } from "@/types/portfolio";

const EASE = [0.16, 1, 0.3, 1] as const;
const TURN_LIMIT = { min: -150, max: 55 };
const SOUNDS: Record<ShelfItemKind, RoomSound> = { book: "spine", diploma: "frame", hobby: "lift" };
const REST_TURN: Record<ShelfItemKind, number> = { book: 28, diploma: -8, hobby: -12 };
const LIGHT_CLOTH = new Set(["#cfc3a6", "#a9c0d3"]);
const HOBBY_ICONS: Record<string, LucideIcon> = {
  Weightlifting: Dumbbell,
  Jogging: Footprints,
  Hiking: Mountain,
  Cooking: CookingPot,
  "Video games": Gamepad2,
  Travel: Plane,
};

interface ShelfInspectorProps {
  itemId: string | null;
  onSelect: (itemId: string) => void;
  onOpenProject: (slug: string) => void;
}

/** Browse the bookshelf one belonging at a time; each can be turned in the hand. */
export function ShelfInspector({ itemId, onSelect, onOpenProject }: ShelfInspectorProps) {
  const index = Math.max(
    0,
    shelfItems.findIndex((item) => item.id === itemId),
  );
  const item = shelfItems[index];

  function step(delta: number) {
    const next = shelfItems[(index + delta + shelfItems.length) % shelfItems.length];
    roomAudio.play(SOUNDS[next.kind]);
    onSelect(next.id);
  }

  const onKeyDown = useEffectEvent((event: KeyboardEvent) => {
    const target = event.target as HTMLElement | null;
    if (target?.closest("input, textarea, select")) return;
    if (event.key === "ArrowRight") step(1);
    if (event.key === "ArrowLeft") step(-1);
  });

  useEffect(() => {
    const handler = (event: KeyboardEvent) => onKeyDown(event);
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <section aria-label="Bookshelf" className="absolute inset-0 z-30 flex flex-col items-center pt-16 pb-20 lg:flex-row lg:justify-center lg:gap-12 lg:px-10">
      <div className="flex w-full flex-1 flex-col items-center justify-center lg:max-w-xl">
        <div className="glass flex items-center gap-1 rounded-full p-1 text-white">
          <button
            type="button"
            onClick={() => step(-1)}
            aria-label="Previous item on the shelf"
            className="inline-flex size-9 items-center justify-center rounded-full transition-colors hover:bg-white/15"
          >
            <ChevronLeft className="size-4" aria-hidden="true" />
          </button>
          <p aria-live="polite" className="min-w-36 px-2 text-center font-mono text-[0.6875rem] tracking-[0.14em] uppercase">
            Shelf · {index + 1} / {shelfItems.length}
          </p>
          <button
            type="button"
            onClick={() => step(1)}
            data-autofocus
            aria-label="Next item on the shelf"
            className="inline-flex size-9 items-center justify-center rounded-full transition-colors hover:bg-white/15"
          >
            <ChevronRight className="size-4" aria-hidden="true" />
          </button>
        </div>

        <div className="relative mt-4 flex w-full flex-1 items-center justify-center [perspective:1200px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -24, scale: 0.94, transition: { duration: 0.2 } }}
              transition={{ duration: 0.55, ease: EASE, delay: 0.1 }}
            >
              <TurnableObject item={item} />
            </motion.div>
          </AnimatePresence>
        </div>
        <p className="mt-2 hidden items-center gap-2 font-mono text-[0.625rem] tracking-[0.16em] text-white/60 uppercase sm:flex">
          <Hand className="size-3.5" aria-hidden="true" />
          Drag to turn · ← → to browse
        </p>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, transition: { duration: 0.15 } }}
          transition={{ duration: 0.4, ease: EASE, delay: 0.2 }}
          className="glass scrollbar-subtle mx-3 mt-4 max-h-[34svh] w-[calc(100%-1.5rem)] overflow-y-auto rounded-3xl bg-black/55 p-6 text-white lg:mx-0 lg:mt-0 lg:max-h-[70vh] lg:w-[24rem]"
        >
          <p className="font-mono text-[0.6875rem] tracking-[0.18em] text-accent-strong uppercase">{item.subtitle}</p>
          <h3 className="mt-2 text-2xl font-semibold tracking-tight">{item.title}</h3>
          {item.author && <p className="mt-1 text-sm text-white/60">by {item.author}</p>}
          <p className="mt-2 leading-relaxed text-white/70">{item.description}</p>
          {item.entries.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-1.5">
              {item.entries.map((entry) => (
                <li
                  key={entry}
                  className="rounded-md border border-white/10 bg-white/[0.05] px-2 py-1 text-[0.8125rem] leading-none text-white/85"
                >
                  {entry}
                </li>
              ))}
            </ul>
          )}
          {item.facts && (
            <dl className="mt-5 space-y-4 border-t border-white/10 pt-4">
              {item.facts.map((fact) => (
                <div key={fact.value}>
                  {fact.image && (
                    <div className="relative mb-2.5 aspect-[16/9] overflow-hidden rounded-xl border border-white/10">
                      <MediaImage image={fact.image} sizes="(min-width: 1024px) 21rem, 90vw" />
                    </div>
                  )}
                  <dt className="font-mono text-[0.625rem] tracking-[0.16em] text-white/55 uppercase">{fact.label}</dt>
                  <dd className="mt-1 text-sm leading-snug text-white/85">{fact.value}</dd>
                </div>
              ))}
            </dl>
          )}
          {item.projects && (
            <div className="mt-5 border-t border-white/10 pt-4">
              <p className="font-mono text-[0.625rem] tracking-[0.16em] text-white/55 uppercase">Where he used these</p>
              {item.projects.length > 0 ? (
                <ul className="mt-2 space-y-1">
                  {item.projects.map((project) => (
                    <li key={project.slug}>
                      <button
                        type="button"
                        onClick={() => onOpenProject(project.slug)}
                        className="group inline-flex items-center gap-1.5 text-left text-sm text-white/85 transition-colors hover:text-white"
                      >
                        {project.title}
                        <ArrowRight
                          className="size-3.5 text-accent-strong transition-transform group-hover:translate-x-0.5"
                          aria-hidden="true"
                        />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-sm text-white/60">On his résumé, but not part of a project shown here.</p>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}

/** Lifts into the hand, turns within limits while dragged, and settles back to rest. */
function TurnableObject({ item }: { item: ShelfItem }) {
  const reduceMotion = useReducedMotion();
  const rest = REST_TURN[item.kind];
  const turn = useSpring(rest, { stiffness: 90, damping: 16 });
  const tilt = useSpring(0, { stiffness: 90, damping: 16 });
  const drag = useRef<{ x: number; y: number; start: number } | null>(null);

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    if (reduceMotion) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { x: event.clientX, y: event.clientY, start: turn.get() };
  }

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!drag.current) return;
    const next = drag.current.start + (event.clientX - drag.current.x) * 0.6;
    turn.set(Math.min(TURN_LIMIT.max, Math.max(TURN_LIMIT.min, next)));
    tilt.set(Math.max(-12, Math.min(12, -(event.clientY - drag.current.y) * 0.15)));
  }

  function release() {
    drag.current = null;
    turn.set(rest);
    tilt.set(0);
  }

  return (
    <motion.div
      role="img"
      aria-label={item.kind === "book" ? `Book: ${item.title}` : item.title}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={release}
      onPointerCancel={release}
      style={{ rotateY: turn, rotateX: tilt }}
      className="relative cursor-grab touch-pan-y select-none [transform-style:preserve-3d] active:cursor-grabbing"
    >
      {item.kind === "book" && <Book item={item} />}
      {item.kind === "diploma" && <Diploma item={item} />}
      {item.kind === "hobby" && <HobbyTray item={item} />}
    </motion.div>
  );
}

const BOOK = { width: 210, height: 300, depth: 44 };

function Book({ item }: { item: ShelfItem }) {
  const { width, height, depth } = BOOK;
  const light = LIGHT_CLOTH.has(item.color ?? "");
  const cloth: CSSProperties = {
    backgroundColor: item.color,
    backgroundImage:
      "linear-gradient(90deg, rgb(0 0 0 / 0.25), transparent 12%, transparent 88%, rgb(0 0 0 / 0.2)), repeating-linear-gradient(0deg, rgb(255 255 255 / 0.025) 0 2px, transparent 2px 4px)",
  };
  const ink = light ? "text-stone-800" : "text-[#e9d9a8]";

  return (
    <div className="relative [transform-style:preserve-3d]" style={{ width, height }}>
      <div
        className={`absolute inset-0 flex flex-col justify-between rounded-r-md p-6 font-serif ${ink}`}
        style={{ ...cloth, transform: `translateZ(${depth / 2}px)` }}
      >
        <p className="font-sans text-[0.625rem] tracking-[0.24em] uppercase opacity-80">
          {item.author ? "Favorite" : "Skills"}
        </p>
        <div>
          <div className="mb-3 h-px w-10 bg-current opacity-60" />
          <p className={item.title.length > 30 ? "text-xl leading-tight" : "text-2xl leading-tight"}>{item.title}</p>
        </div>
        <p className="font-sans text-[0.625rem] leading-relaxed opacity-75">
          {item.author ?? item.entries.slice(0, 3).join(" · ")}
        </p>
      </div>
      <div
        className="absolute inset-0 rounded-l-md"
        style={{ ...cloth, transform: `rotateY(180deg) translateZ(${depth / 2}px)` }}
      />
      <div
        className={`absolute top-0 flex items-center justify-center font-serif ${ink}`}
        style={{
          ...cloth,
          width: depth,
          height,
          left: (width - depth) / 2,
          transform: `rotateY(-90deg) translateZ(${width / 2}px)`,
        }}
      >
        <span className="text-sm whitespace-nowrap [writing-mode:vertical-rl]">{item.author ?? item.title}</span>
      </div>
      <div
        className="absolute top-1 bg-[repeating-linear-gradient(90deg,#f3ecdc_0_1px,#e2d8c2_1px_2px)]"
        style={{
          width: depth - 4,
          height: height - 8,
          left: (width - depth) / 2 + 2,
          transform: `rotateY(90deg) translateZ(${width / 2 - 3}px)`,
        }}
      />
      <div
        className="absolute left-0"
        style={{
          ...cloth,
          width,
          height: depth,
          top: (height - depth) / 2,
          transform: `rotateX(90deg) translateZ(${height / 2}px)`,
        }}
      />
    </div>
  );
}

function Diploma({ item }: { item: ShelfItem }) {
  return (
    <div className="relative w-[min(22rem,80vw)] bg-[#141414] p-3 shadow-[0_30px_60px_-20px_rgb(0_0_0/0.8)] [transform:translateZ(0)]">
      <div className="border border-black/40 bg-[#f4efe2] px-6 py-8 text-center font-serif text-stone-800">
        <p className="font-sans text-[0.5625rem] tracking-[0.3em] text-stone-500 uppercase">Bachelor of Science</p>
        <p className="mt-3 text-lg leading-snug">{item.subtitle.split(" · ")[0]}</p>
        <div className="mx-auto my-4 h-px w-16 bg-stone-400" />
        <p className="text-sm italic">Computer Science</p>
        <p className="mt-1 font-sans text-[0.625rem] tracking-[0.2em] text-stone-500 uppercase">
          {item.subtitle.split(" · ")[1]}
        </p>
        <span
          aria-hidden="true"
          className="mx-auto mt-5 block size-12 rounded-full bg-[radial-gradient(circle_at_35%_35%,#f1d58a,#b88a2e_70%)] shadow-inner"
        />
      </div>
    </div>
  );
}

function HobbyTray({ item }: { item: ShelfItem }) {
  const columns = item.entries.length > 2 ? "grid-cols-2" : "grid-cols-1";
  return (
    <div className="w-[min(17rem,76vw)] rounded-lg bg-[linear-gradient(160deg,#5a3b26,#3a2416)] p-3 shadow-[inset_0_1px_0_rgb(255_255_255/0.12),0_30px_60px_-20px_rgb(0_0_0/0.8)] [transform:translateZ(0)]">
      <div className="rounded-md bg-[#f1ebdd] px-4 py-5 text-stone-800">
        <p className="text-center font-mono text-[0.5625rem] tracking-[0.24em] text-stone-500 uppercase">{item.subtitle}</p>
        <ul className={`mt-4 grid gap-2 ${columns}`}>
          {item.entries.map((entry) => {
            const Icon = HOBBY_ICONS[entry];
            return (
              <li
                key={entry}
                className="flex flex-col items-center gap-2 rounded-md border border-stone-300 bg-white/60 px-2 py-3 text-center"
              >
                {Icon && <Icon className="size-7 text-stone-700" strokeWidth={1.5} aria-hidden="true" />}
                <span className="text-xs font-medium">{entry}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
