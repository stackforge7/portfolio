"use client";

import { useEffect, useEffectEvent, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { earlyCareer, experience } from "@/data/experience";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useViewportSize } from "@/hooks/useViewportSize";
import { cn } from "@/lib/cn";
import { formatPeriod } from "@/lib/format";
import { roomAudio } from "@/lib/studio/audio";
import type { CompanyName, Project } from "@/types/portfolio";

const TURN = { duration: 0.75, ease: [0.45, 0, 0.2, 1] as const };
const SINGLE_PAGE_MAX_WIDTH = 900;

interface JournalPage {
  id: string;
  content: ReactNode;
}

interface JournalEntry {
  project: Project;
  /** Index of the entry's first page. */
  page: number;
}

const ENTRIES: JournalEntry[] = projects.map((project, index) => ({ project, page: 2 + index * 2 }));

interface JournalInspectorProps {
  onOpenResume: () => void;
}

/** Project notes as a physical book: two-page spreads with real page turns and a searchable contents list. */
export function JournalInspector({ onOpenResume }: JournalInspectorProps) {
  const reduceMotion = useReducedMotion();
  const { width } = useViewportSize();
  const perView = width < SINGLE_PAGE_MAX_WIDTH ? 1 : 2;

  const [current, setCurrent] = useState(0);
  const [turn, setTurn] = useState<{ from: number; to: number } | null>(null);
  const shown = perView === 2 ? current - (current % 2) : current;
  const pages = buildPages(ENTRIES, { onOpenResume, onJump: goTo });
  const last = pages.length - perView;

  function goTo(target: number) {
    const aligned = Math.max(0, Math.min(last, perView === 2 ? target - (target % 2) : target));
    if (aligned === shown || turn) return;
    roomAudio.play("page");
    if (reduceMotion) {
      setCurrent(aligned);
      return;
    }
    setTurn({ from: shown, to: aligned });
  }

  function finishTurn() {
    if (!turn) return;
    setCurrent(turn.to);
    setTurn(null);
  }

  const onKeyDown = useEffectEvent((event: KeyboardEvent) => {
    const target = event.target as HTMLElement | null;
    if (target?.closest("input, textarea, select")) return;
    if (event.key === "ArrowRight") goTo(shown + perView);
    if (event.key === "ArrowLeft") goTo(shown - perView);
  });

  useEffect(() => {
    const handler = (event: KeyboardEvent) => onKeyDown(event);
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const rangeLabel =
    perView === 2 ? `Pages ${shown + 1}-${shown + 2} / ${pages.length}` : `Page ${shown + 1} / ${pages.length}`;

  return (
    <section
      aria-label="Notes: the project journal"
      className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-5 px-3 pt-16 pb-20 lg:flex-row lg:items-center lg:gap-8 lg:px-8"
    >
      <motion.div
        initial={{ opacity: 0, y: 40, rotateX: 12 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        exit={{ opacity: 0, y: 30, transition: { duration: 0.25 } }}
        transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="flex w-full flex-col items-center lg:w-auto"
      >
        <Book pages={pages} shown={shown} perView={perView} turn={turn} onTurnComplete={finishTurn} />
        <div className="mt-4 flex items-center gap-4 text-white">
          <button
            type="button"
            onClick={() => goTo(shown - perView)}
            disabled={shown === 0}
            aria-label="Previous page"
            className="glass inline-flex size-10 items-center justify-center rounded-full transition-colors hover:bg-black/60 disabled:opacity-40"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
          </button>
          <div className="text-center">
            <p aria-live="polite" className="font-mono text-[0.6875rem] tracking-[0.14em] uppercase">
              {rangeLabel}
            </p>
            <p className="mt-0.5 hidden text-[0.6875rem] text-white/60 sm:block">← → to turn the page</p>
          </div>
          <button
            type="button"
            onClick={() => goTo(shown + perView)}
            disabled={shown >= last}
            data-autofocus
            aria-label="Next page"
            className="glass inline-flex size-10 items-center justify-center rounded-full transition-colors hover:bg-black/60 disabled:opacity-40"
          >
            <ArrowRight className="size-4" aria-hidden="true" />
          </button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, transition: { duration: 0.2 } }}
        transition={{ duration: 0.5, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="hidden lg:block"
      >
        <ContentsPanel entries={ENTRIES} onJump={goTo} />
      </motion.div>
    </section>
  );
}

interface BookProps {
  pages: JournalPage[];
  shown: number;
  perView: 1 | 2;
  turn: { from: number; to: number } | null;
  onTurnComplete: () => void;
}

function Book({ pages, shown, perView, turn, onTurnComplete }: BookProps) {
  const page = (index: number) => pages[index]?.content ?? null;

  if (perView === 1) {
    const forward = turn ? turn.to > turn.from : true;
    return (
      <div className="relative h-[min(34rem,calc(100svh-15rem))] w-[min(26rem,calc(100vw-1.5rem))] [perspective:1800px]">
        <Paper side="single">{page(turn ? (forward ? turn.to : turn.from) : shown)}</Paper>
        {turn && (
          <motion.div
            key={`${turn.from}-${turn.to}`}
            className="absolute inset-0 origin-left [transform-style:preserve-3d]"
            initial={{ rotateY: forward ? 0 : -180 }}
            animate={{ rotateY: forward ? -180 : 0 }}
            transition={TURN}
            onAnimationComplete={onTurnComplete}
          >
            <Face>
              <Paper side="single">{page(forward ? turn.from : turn.to)}</Paper>
            </Face>
            <Face back>
              <Paper side="single" />
            </Face>
          </motion.div>
        )}
      </div>
    );
  }

  const forward = turn ? turn.to > turn.from : true;
  const left = turn ? (forward ? turn.from : turn.to) : shown;
  const right = turn ? (forward ? turn.to + 1 : turn.from + 1) : shown + 1;

  return (
    <div className="relative rounded-md bg-[#3b2a1c] p-2.5 shadow-[0_40px_80px_-30px_rgb(0_0_0/0.9)]">
      <div className="relative flex h-[min(36rem,calc(100svh-14rem))] w-[min(56rem,58vw)] [perspective:2400px]">
        <div className="relative h-full w-1/2">
          <Paper side="left">{page(left)}</Paper>
        </div>
        <div className="relative h-full w-1/2">
          <Paper side="right">{page(right)}</Paper>
        </div>
        <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-1/2 w-10 -translate-x-1/2 bg-[linear-gradient(90deg,transparent,rgb(0_0_0/0.18),transparent)]" />
        {turn && (
          <motion.div
            key={`${turn.from}-${turn.to}`}
            className={cn(
              "absolute inset-y-0 w-1/2 [transform-style:preserve-3d]",
              forward ? "left-1/2 origin-left" : "left-0 origin-right",
            )}
            initial={{ rotateY: 0 }}
            animate={{ rotateY: forward ? -180 : 180 }}
            transition={TURN}
            onAnimationComplete={onTurnComplete}
          >
            <Face>
              <Paper side={forward ? "right" : "left"}>{page(forward ? turn.from + 1 : turn.from)}</Paper>
            </Face>
            <Face back>
              <Paper side={forward ? "left" : "right"}>{page(forward ? turn.to : turn.to + 1)}</Paper>
            </Face>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function Face({ back = false, children }: { back?: boolean; children: ReactNode }) {
  return (
    <div
      className="absolute inset-0 [backface-visibility:hidden]"
      style={back ? { transform: "rotateY(180deg)" } : undefined}
    >
      {children}
    </div>
  );
}

/** Smallest text scale before a page falls back to scrolling. */
const MIN_PAGE_ZOOM = 0.72;

function Paper({ side, children }: { side: "left" | "right" | "single"; children?: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const page = ref.current;
    const frame = page?.parentElement;
    if (!page || !frame) return;
    const fit = () => {
      let zoom = 1;
      page.style.zoom = "";
      for (let pass = 0; pass < 3 && page.scrollHeight > page.clientHeight + 1 && zoom > MIN_PAGE_ZOOM; pass++) {
        zoom = Math.max(MIN_PAGE_ZOOM, zoom * (page.clientHeight / page.scrollHeight));
        page.style.zoom = String(zoom);
      }
    };
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(frame);
    return () => observer.disconnect();
  }, [children]);

  return (
    <div
      ref={ref}
      className={cn(
        "absolute inset-0 overflow-y-auto overscroll-contain bg-[#f6f1e6] px-7 py-8 font-serif text-stone-800 [scrollbar-color:rgb(120_113_108/0.35)_transparent] [scrollbar-width:thin] md:px-10 md:py-10",
        side === "left" && "rounded-l-sm shadow-[inset_-18px_0_24px_-18px_rgb(0_0_0/0.35)]",
        side === "right" && "rounded-r-sm shadow-[inset_18px_0_24px_-18px_rgb(0_0_0/0.35)]",
        side === "single" && "rounded-sm shadow-[inset_12px_0_20px_-16px_rgb(0_0_0/0.35),0_30px_60px_-24px_rgb(0_0_0/0.8)]",
      )}
    >
      {children}
    </div>
  );
}

function PageFooter({ label, number }: { label: string; number: number }) {
  return (
    <div className="mt-8 flex items-center justify-between border-t border-stone-300 pt-3 font-sans text-[0.625rem] tracking-[0.14em] text-stone-500 uppercase">
      <span>{label}</span>
      <span>{String(number).padStart(2, "0")}</span>
    </div>
  );
}

function PageEyebrow({ children }: { children: ReactNode }) {
  return <p className="font-sans text-[0.625rem] tracking-[0.2em] text-stone-500 uppercase">{children}</p>;
}

function buildPages(
  entries: JournalEntry[],
  actions: { onOpenResume: () => void; onJump: (page: number) => void },
): JournalPage[] {
  const pages: JournalPage[] = [
    {
      id: "title",
      content: (
        <div className="flex h-full flex-col text-center">
          <PageEyebrow>Notes · Volume 01</PageEyebrow>
          <div className="my-auto">
            <h3 className="text-4xl leading-tight text-stone-900">What William has built</h3>
            <p className="mt-4 text-lg text-stone-600 italic">Project notes, and why things were built the way they were.</p>
          </div>
          <PageFooter label="The project journal" number={1} />
        </div>
      ),
    },
    {
      id: "contents",
      content: (
        <div className="flex h-full flex-col">
          <PageEyebrow>Contents</PageEyebrow>
          <h3 className="mt-3 text-3xl leading-tight text-stone-900">Start anywhere</h3>
          <ol className="mt-6 space-y-2">
            {entries.map((entry) => (
              <li key={entry.project.id}>
                <button
                  type="button"
                  onClick={() => actions.onJump(entry.page)}
                  className="flex w-full items-baseline gap-2 text-left transition-colors hover:text-stone-950"
                >
                  <span>{entry.project.title}</span>
                  <span aria-hidden="true" className="flex-1 border-b border-dotted border-stone-400" />
                  <span className="font-sans text-xs text-stone-500">{String(entry.page + 1).padStart(2, "0")}</span>
                </button>
              </li>
            ))}
            <li>
              <button
                type="button"
                onClick={() => actions.onJump(2 + entries.length * 2)}
                className="flex w-full items-baseline gap-2 text-left transition-colors hover:text-stone-950"
              >
                <span>Where these came from</span>
                <span aria-hidden="true" className="flex-1 border-b border-dotted border-stone-400" />
                <span className="font-sans text-xs text-stone-500">{String(3 + entries.length * 2).padStart(2, "0")}</span>
              </button>
            </li>
          </ol>
          <PageFooter label="Contents" number={2} />
        </div>
      ),
    },
  ];

  entries.forEach(({ project, page }, index) => {
    pages.push({
      id: `${project.id}-a`,
      content: (
        <div className="flex min-h-full flex-col">
          <PageEyebrow>
            Entry {String(index + 1).padStart(2, "0")} · {project.company}
          </PageEyebrow>
          <h3 className="mt-3 text-3xl leading-tight text-stone-900">{project.title}</h3>
          <p className="mt-4 text-lg leading-relaxed text-stone-700 italic">{project.summary}</p>
          <h4 className="mt-6 font-sans text-[0.6875rem] font-semibold tracking-[0.18em] text-stone-500 uppercase">The problem</h4>
          <p className="mt-2 leading-relaxed">{project.problem}</p>
          <h4 className="mt-5 font-sans text-[0.6875rem] font-semibold tracking-[0.18em] text-stone-500 uppercase">My part</h4>
          <p className="mt-2 leading-relaxed">{project.role}</p>
          <div className="mt-auto">
            <PageFooter label={project.title} number={page + 1} />
          </div>
        </div>
      ),
    });
    pages.push({
      id: `${project.id}-b`,
      content: (
        <div className="flex min-h-full flex-col">
          <h4 className="font-sans text-[0.6875rem] font-semibold tracking-[0.18em] text-stone-500 uppercase">How it works</h4>
          <p className="mt-2 leading-relaxed">{project.solution}</p>
          <h4 className="mt-5 font-sans text-[0.6875rem] font-semibold tracking-[0.18em] text-stone-500 uppercase">Decisions</h4>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 leading-relaxed marker:text-stone-400">
            {project.decisions.slice(0, 3).map((decision) => (
              <li key={decision}>{decision}</li>
            ))}
          </ul>
          {project.metrics.length > 0 && (
            <p className="mt-5 rounded-sm border-l-2 border-stone-800 bg-stone-900/5 px-3 py-2 font-sans text-sm">
              {project.metrics.map((metric) => `${metric.value} · ${metric.label}`).join(" · ")}
            </p>
          )}
          <Link
            href={`/projects/${project.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-1.5 self-start font-sans text-xs font-semibold tracking-[0.14em] text-stone-900 uppercase underline-offset-4 hover:underline"
          >
            Full case study
            <ArrowUpRight className="size-3.5" aria-hidden="true" />
            <span className="sr-only">(opens in a new tab)</span>
          </Link>
          <div className="mt-auto">
            <PageFooter label={project.company} number={page + 2} />
          </div>
        </div>
      ),
    });
  });

  const closing = 2 + entries.length * 2;
  pages.push(
    {
      id: "origins",
      content: (
        <div className="flex min-h-full flex-col">
          <PageEyebrow>Afterword</PageEyebrow>
          <h3 className="mt-3 text-3xl leading-tight text-stone-900">Where these came from</h3>
          <ol className="mt-6 space-y-6">
            {experience.map((role) => {
              const titles = role.progression
                ? `${role.progression[0].title} → ${role.progression[role.progression.length - 1].title}`
                : role.role;
              return (
                <li key={role.id}>
                  <p className="text-xl text-stone-900">{role.company}</p>
                  <p className="mt-0.5 font-sans text-xs text-stone-500">
                    {titles} · {formatPeriod(role.start, role.end)}
                  </p>
                  <EntryLinks
                    entries={entries.filter((entry) => entry.project.company === role.company)}
                    onJump={actions.onJump}
                  />
                </li>
              );
            })}
            <li>
              <p className="text-xl text-stone-900">Internships</p>
              <p className="mt-0.5 font-sans text-xs text-stone-500">
                {earlyCareer.map((role) => role.organization).reverse().join(", ")} · while at NC State
              </p>
              <EntryLinks
                entries={entries.filter((entry) => !experience.some((role) => role.company === entry.project.company))}
                onJump={actions.onJump}
              />
            </li>
          </ol>
          <div className="mt-auto">
            <PageFooter label="Afterword" number={closing + 1} />
          </div>
        </div>
      ),
    },
    {
      id: "record",
      content: (
        <div className="flex min-h-full flex-col">
          <PageEyebrow>The full record</PageEyebrow>
          <p className="mt-4 text-lg leading-relaxed text-stone-700 italic">{profile.tagline}</p>
          <p className="mt-4 leading-relaxed">
            The printed résumé next to this notebook has everything in one place.
          </p>
          <button
            type="button"
            onClick={actions.onOpenResume}
            className="mt-6 inline-flex h-11 items-center gap-2 self-start rounded-full bg-stone-900 px-6 font-sans text-xs font-semibold tracking-[0.14em] text-stone-50 uppercase transition-colors hover:bg-stone-700"
          >
            Read the résumé
          </button>
          <p className="mt-6 text-sm text-stone-600">
            Or write to{" "}
            <a href={`mailto:${profile.contact.email}`} className="underline underline-offset-2">
              {profile.contact.email}
            </a>
            .
          </p>
          <div className="mt-auto">
            <PageFooter label="The project journal" number={closing + 2} />
          </div>
        </div>
      ),
    },
  );

  return pages;
}

function EntryLinks({ entries, onJump }: { entries: JournalEntry[]; onJump: (page: number) => void }) {
  return (
    <ul className="mt-2.5 space-y-1">
      {entries.map((entry) => (
        <li key={entry.project.id}>
          <button
            type="button"
            onClick={() => onJump(entry.page)}
            className="flex w-full items-baseline gap-2 text-left text-sm transition-colors hover:text-stone-950"
          >
            <span>{entry.project.title}</span>
            <span aria-hidden="true" className="flex-1 border-b border-dotted border-stone-300" />
            <span className="font-sans text-xs text-stone-500">{String(entry.page + 1).padStart(2, "0")}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}

const TOPICS: ("All" | CompanyName)[] = ["All", ...new Set(projects.map((project) => project.company))];

function ContentsPanel({ entries, onJump }: { entries: JournalEntry[]; onJump: (page: number) => void }) {
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState<(typeof TOPICS)[number]>("All");
  const needle = query.trim().toLowerCase();
  const matches = entries.filter(({ project }) => {
    if (topic !== "All" && project.company !== topic) return false;
    if (!needle) return true;
    return [project.title, project.summary, project.problem, ...project.technologies]
      .join(" ")
      .toLowerCase()
      .includes(needle);
  });

  return (
    <div className="glass flex max-h-[min(40rem,calc(100svh-10rem))] w-[22rem] flex-col rounded-3xl bg-[#2a1f16]/55 p-6 text-white">
      <p className="font-mono text-[0.625rem] tracking-[0.2em] text-white/60 uppercase">Notes · Volume 01</p>
      <h3 className="mt-2 text-4xl font-semibold tracking-tight">Contents</h3>
      <label htmlFor="journal-search" className="mt-5 block text-xs text-white/70">
        Search the journal
      </label>
      <input
        id="journal-search"
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="A project, a technology…"
        className="mt-2 h-11 rounded-xl border border-white/20 bg-white/[0.07] px-4 text-sm text-white placeholder:text-white/40 focus:border-white/45 focus:outline-none"
      />
      <label htmlFor="journal-topic" className="mt-4 block text-xs text-white/70">
        Where
      </label>
      <select
        id="journal-topic"
        value={topic}
        onChange={(event) => setTopic(event.target.value as (typeof TOPICS)[number])}
        className="mt-2 h-11 rounded-xl border border-white/20 bg-white/[0.07] px-3 text-sm text-white focus:border-white/45 focus:outline-none [&>option]:bg-[#1b1510]"
      >
        {TOPICS.map((value) => (
          <option key={value} value={value}>
            {value === "All" ? "Everywhere" : value}
          </option>
        ))}
      </select>
      <p aria-live="polite" className="mt-4 text-xs text-white/60">
        {matches.length} {matches.length === 1 ? "entry" : "entries"}
      </p>
      <ul className="scrollbar-subtle mt-2 min-h-0 flex-1 space-y-1 overflow-y-auto overscroll-contain pr-1">
        {matches.map(({ project, page }) => (
          <li key={project.id}>
            <button
              type="button"
              onClick={() => onJump(page)}
              className="w-full rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-white/10"
            >
              <span className="flex items-baseline justify-between gap-3">
                <span className="font-mono text-[0.625rem] tracking-[0.16em] text-white/55 uppercase">
                  {project.company}
                </span>
                <span className="font-mono text-xs text-white/55">{page + 1}</span>
              </span>
              <span className="mt-1 block font-medium">{project.title}</span>
              <span className="mt-0.5 line-clamp-2 block text-sm leading-snug text-white/65">{project.summary}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
