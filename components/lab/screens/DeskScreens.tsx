"use client";

import { useEffect, useState, type ReactNode } from "react";
import localFont from "next/font/local";
import { MediaImage } from "@/components/ui/MediaImage";
import { earlyCareer, education, experience } from "@/data/experience";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { ViewportSize } from "@/hooks/useViewportSize";
import { formatYearMonth } from "@/lib/format";
import { quadToMatrix3d } from "@/lib/scene";
import type { StudioScreen, StudioScreenId } from "@/types/portfolio";

/** Design size of each screen's content before it is mapped onto the photographed glass. */
const DESIGN: Record<StudioScreenId, { width: number; height: number }> = {
  terminal: { width: 1248, height: 720 },
  career: { width: 1040, height: 650 },
  laptop: { width: 1000, height: 700 },
  phone: { width: 360, height: 750 },
  whiteboard: { width: 1300, height: 800 },
};

/** Bundled so the whiteboard never falls back to a printed face when Google Fonts is unreachable. */
const marker = localFont({
  src: "../../../assets/fonts/caveat-700-latin.woff2",
  weight: "700",
  display: "block",
  adjustFontFallback: false,
  fallback: ["Segoe Print", "Bradley Hand", "Comic Sans MS", "cursive"],
});

interface SceneScreensProps {
  screens: StudioScreen[];
  stage: ViewportSize;
  active: boolean;
}

/** Live screen content pinned onto the monitors, laptop, and phone of a view. */
export function SceneScreens({ screens, stage, active }: SceneScreensProps) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {screens.map((screen) => {
        const { width, height } = DESIGN[screen.id];
        const quad = screen.quad.map((point) => ({
          x: (point.x / 100) * stage.width,
          y: (point.y / 100) * stage.height,
        })) as Parameters<typeof quadToMatrix3d>[0];
        return (
          <div
            key={screen.id}
            className="absolute top-0 left-0 origin-top-left overflow-hidden"
            style={{ width, height, transform: quadToMatrix3d(quad, width, height) }}
          >
            <ScreenContent id={screen.id} active={active} />
            {screen.id !== "whiteboard" && (
              <div className="absolute inset-0 bg-[linear-gradient(125deg,rgb(255_255_255/0.07),transparent_38%)]" />
            )}
          </div>
        );
      })}
    </div>
  );
}

function ScreenContent({ id, active }: { id: StudioScreenId; active: boolean }) {
  switch (id) {
    case "terminal":
      return <TerminalScreen active={active} />;
    case "career":
      return <CareerScreen active={active} />;
    case "laptop":
      return <LaptopScreen />;
    case "phone":
      return <PhoneScreen active={active} />;
    case "whiteboard":
      return <WhiteboardSketch />;
  }
}

/** Centers of the shapes drawn on the room's whiteboard, as percentages of the whiteboard screen. */
const WHITEBOARD_LABELS: { text: string[]; x: number; y: number; size: number }[] = [
  { text: ["Client"], x: 22.2, y: 23.3, size: 46 },
  { text: ["CDN"], x: 51.6, y: 24, size: 46 },
  { text: ["Services"], x: 85.2, y: 34.9, size: 34 },
  { text: ["API", "Gateway"], x: 46.8, y: 50.1, size: 40 },
  { text: ["Webhooks"], x: 17.3, y: 56.9, size: 38 },
  { text: ["Queue"], x: 30.8, y: 75.4, size: 40 },
  { text: ["Postgres"], x: 74.5, y: 68.6, size: 36 },
  { text: ["Redis"], x: 68.4, y: 45.6, size: 32 },
  { text: ["LLM"], x: 88.9, y: 60.6, size: 32 },
  { text: ["Workers"], x: 51.3, y: 76.7, size: 32 },
];

const MARKER_TILT = [-2, 1.5, -1, 2, -1.5, 1, -2.5, 2, -1, 1.5];

function WhiteboardSketch() {
  return (
    <div className={`${marker.className} relative h-full w-full text-[#1d2f5c]`}>
      <p className="absolute top-[5.5%] left-[4%] -rotate-2 text-[40px] leading-none font-bold opacity-80">
        event-driven platform
      </p>
      {WHITEBOARD_LABELS.map((label, index) => (
        <p
          key={label.text.join(" ")}
          className="absolute -translate-x-1/2 -translate-y-1/2 text-center leading-[0.9] font-bold whitespace-nowrap opacity-90"
          style={{
            left: `${label.x}%`,
            top: `${label.y}%`,
            fontSize: label.size,
            rotate: `${MARKER_TILT[index % MARKER_TILT.length]}deg`,
          }}
        >
          {label.text.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </p>
      ))}
    </div>
  );
}

/** Advances `tick` on an interval while `running`. */
function useTicker(running: boolean, intervalMs: number) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => setTick((value) => value + 1), intervalMs);
    return () => window.clearInterval(timer);
  }, [running, intervalMs]);
  return tick;
}

const PROMPT = "william@studio ~ %";

const TERMINAL_SCRIPT: { command: string; output: string[] }[] = [
  { command: "whoami", output: [`${profile.name}, ${profile.title}`] },
  {
    command: "cat experience.txt",
    output: experience.map(
      (role) =>
        `${role.company.padEnd(11)}${role.role.padEnd(27)}${role.start.slice(0, 4)} → ${role.end ? role.end.slice(0, 4) : "present"}`,
    ),
  },
  {
    command: "ls stack/",
    output: ["node.js  typescript  python  ruby  c#  java", "react  graphql  rails  kubernetes  terraform", "docker  redis  postgres  mysql"],
  },
  { command: "cat focus.txt", output: profile.focusAreas.map((area) => `· ${area.title}`) },
  {
    command: "cat origin.txt",
    output: ["Raleigh, NC", "NC State · B.S. Computer Science, 2015 → 2019", "first job: QA automation at Sageworks, 2015"],
  },
];

const TERMINAL_TOTAL = TERMINAL_SCRIPT.reduce((sum, step) => sum + step.command.length + 6, 0);
const TERMINAL_HOLD = 40;
/** Lines that fit below the title bar at the terminal's design size. */
const TERMINAL_ROWS = 16;

function TerminalScreen({ active }: { active: boolean }) {
  const reduceMotion = useReducedMotion();
  const tick = useTicker(active && !reduceMotion, 70);
  const budget = reduceMotion ? Infinity : tick % (TERMINAL_TOTAL + TERMINAL_HOLD);

  let remaining = budget;
  const rows: ReactNode[] = [];
  let typing = true;
  for (const [index, step] of TERMINAL_SCRIPT.entries()) {
    if (remaining <= 0) break;
    const typed = step.command.slice(0, Math.max(0, remaining));
    remaining -= step.command.length + 6;
    const done = remaining >= 0;
    rows.push(
      <div key={`c${index}`}>
        <span className="text-[#7ee0a1]">{PROMPT}</span> <span className="text-white">{typed}</span>
        {!done && <Caret />}
      </div>,
    );
    if (!done) {
      typing = false;
      break;
    }
    step.output.forEach((line, lineIndex) =>
      rows.push(
        <div key={`o${index}-${lineIndex}`} className="whitespace-pre text-[#b8c4d6]">
          {line}
        </div>,
      ),
    );
  }

  return (
    <div className="flex h-full flex-col bg-[#0b0e14] font-mono text-[26px] leading-[1.45]">
      <div className="flex items-center gap-2.5 border-b border-white/10 bg-[#11151d] px-6 py-3.5 text-[20px] text-white/50">
        <span className="size-3.5 rounded-full bg-white/15" />
        <span className="size-3.5 rounded-full bg-white/15" />
        <span className="size-3.5 rounded-full bg-white/15" />
        <span className="ml-4">zsh · studio</span>
      </div>
      <div className="flex-1 overflow-hidden px-8 py-6">
        {rows.slice(-(TERMINAL_ROWS - (typing ? 1 : 0)))}
        {typing && (
          <div>
            <span className="text-[#7ee0a1]">{PROMPT}</span> <Caret />
          </div>
        )}
      </div>
    </div>
  );
}

function Caret() {
  return <span className="ml-1 inline-block h-[1.1em] w-[0.6em] translate-y-[0.18em] animate-caret bg-white/80" />;
}

interface CareerRow {
  when: string;
  title: string;
  place: string;
  current: boolean;
}

const FULL_TIME: CareerRow[] = experience.flatMap((role) =>
  [...(role.progression ?? [{ title: role.role, start: role.start }])].reverse().map((step, index) => ({
    when: formatYearMonth(step.start),
    title: step.title,
    place: role.company,
    current: role.end === null && index === 0,
  })),
);

const EARLIER: CareerRow[] = [
  ...earlyCareer.map((role) => ({ when: role.period, title: role.role, place: role.organization, current: false })),
  ...education.map((entry) => ({
    when: `${entry.startYear}-${entry.endYear}`,
    title: `${entry.degree}, ${entry.field}`,
    place: "NC State",
    current: false,
  })),
];

function CareerScreen({ active }: { active: boolean }) {
  return (
    <div className="flex h-full flex-col bg-[#0d1117] px-11 pt-9 pb-8 font-sans text-white">
      <div className="flex items-baseline justify-between border-b border-white/10 pb-5">
        <p className="text-[38px] leading-none font-semibold">Career</p>
        <p className="font-mono text-[17px] text-white/45">
          {profile.name} · {profile.location}
        </p>
      </div>
      <div className="mt-6 grid flex-1 grid-cols-2 gap-10">
        <CareerColumn heading="Full-time" rows={FULL_TIME} active={active} />
        <CareerColumn heading="Internships & school" rows={EARLIER} active={active} />
      </div>
    </div>
  );
}

function CareerColumn({ heading, rows, active }: { heading: string; rows: CareerRow[]; active: boolean }) {
  return (
    <div className="flex min-w-0 flex-col">
      <p className="font-mono text-[15px] tracking-[0.14em] text-white/40 uppercase">{heading}</p>
      <ol className="relative mt-4 flex flex-1 flex-col justify-between">
        <span className="absolute top-3 bottom-3 left-[6px] w-px bg-white/12" />
        {rows.map((row) => (
          <li key={`${row.when}-${row.title}`} className="relative flex gap-5">
            <span
              className={`relative mt-[8px] size-[13px] shrink-0 rounded-full border-2 border-[#0d1117] ${row.current ? `bg-[#7ee0a1] ${active ? "animate-pulse" : ""}` : "bg-white/30"}`}
            />
            <span className="min-w-0">
              <span className={`block truncate text-[23px] leading-tight ${row.current ? "text-white" : "text-white/85"}`}>
                {row.title}
              </span>
              <span className="mt-1 block truncate font-mono text-[15px] text-white/45">
                {row.place} · {row.when}
              </span>
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function LaptopScreen() {
  return (
    <div className="flex h-full flex-col bg-[#10141b] font-sans text-white">
      <div className="flex items-center gap-2 border-b border-white/10 px-5 py-3">
        <span className="size-3 rounded-full bg-white/20" />
        <span className="size-3 rounded-full bg-white/20" />
        <span className="size-3 rounded-full bg-white/20" />
        <span className="ml-3 text-[18px] text-white/60">Projects</span>
      </div>
      <div className="grid flex-1 grid-cols-4 content-start gap-4 p-6">
        {projects.map((project) => (
          <div key={project.id} className="flex flex-col gap-2">
            <div className="relative aspect-[16/10] overflow-hidden rounded-lg border border-white/10">
              <MediaImage image={project.cover} decorative sizes="160px" />
            </div>
            <p className="truncate text-[17px] text-white/80">{project.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const HOME_TIME_ZONE = "America/New_York";
const homeClock = new Intl.DateTimeFormat("en-US", { timeZone: HOME_TIME_ZONE, hour: "numeric", minute: "2-digit" });
const homeDate = new Intl.DateTimeFormat("en-US", {
  timeZone: HOME_TIME_ZONE,
  weekday: "long",
  month: "long",
  day: "numeric",
});

/** William's local time, not the visitor's. */
function PhoneScreen({ active }: { active: boolean }) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    if (!active) return;
    const timer = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(timer);
  }, [active]);

  return (
    <div className="relative flex h-full flex-col items-center bg-[#0a0f18] bg-[radial-gradient(120%_70%_at_20%_0%,rgb(76_201_240/0.38),transparent_60%),radial-gradient(90%_60%_at_100%_100%,rgb(29_143_214/0.35),transparent_65%)] pt-24 font-sans text-white">
      <p className="relative text-[88px] leading-none font-light tracking-tight">
        {homeClock.format(now).replace(/\s?[AP]M$/, "")}
      </p>
      <p className="relative mt-3 text-[22px] text-white/80">{homeDate.format(now)}</p>
      <p className="relative mt-1 text-[18px] text-white/65">{profile.location}</p>
      <div className="relative mt-auto mb-16 w-[84%] rounded-3xl bg-black/35 px-6 py-5 backdrop-blur">
        <p className="text-[17px] text-white/55">Email</p>
        <p className="mt-1 text-[19px] font-medium break-all">{profile.contact.email}</p>
      </div>
    </div>
  );
}
