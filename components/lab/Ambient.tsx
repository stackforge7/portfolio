import type { CSSProperties } from "react";
import type { StudioViewId } from "@/types/portfolio";

interface Region {
  x: number;
  y: number;
  width: number;
  height: number;
  count: number;
}

interface Glow {
  x: number;
  y: number;
  size: number;
  color: string;
}

const WARM = "rgb(255 190 120 / 0.22)";
const COOL = "rgb(76 201 240 / 0.14)";

/** Where dust drifts through light and where light sources gently breathe, per view. */
const AMBIENT: Record<StudioViewId, { motes: Region[]; glows: Glow[] }> = {
  room: {
    motes: [
      { x: 2, y: 36, width: 13, height: 22, count: 9 },
      { x: 88, y: 6, width: 11, height: 40, count: 7 },
    ],
    glows: [
      { x: 7, y: 46, size: 22, color: WARM },
      { x: 56, y: 45, size: 20, color: COOL },
    ],
  },
  desk: {
    motes: [{ x: 1, y: 22, width: 18, height: 34, count: 12 }],
    glows: [
      { x: 8, y: 34, size: 26, color: WARM },
      { x: 50, y: 36, size: 40, color: "rgb(76 201 240 / 0.07)" },
    ],
  },
  shelf: {
    motes: [{ x: 28, y: 32, width: 48, height: 40, count: 10 }],
    glows: [
      { x: 47, y: 38, size: 34, color: WARM },
      { x: 47, y: 72, size: 34, color: WARM },
    ],
  },
  reading: {
    motes: [{ x: 30, y: 0, width: 22, height: 45, count: 10 }],
    glows: [
      { x: 39, y: 8, size: 30, color: WARM },
      { x: 80, y: 20, size: 36, color: COOL },
    ],
  },
};

/** Deterministic 0-1 value so the layout is stable across renders. */
function seeded(n: number) {
  const value = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return value - Math.floor(value);
}

export function Ambient({ view }: { view: StudioViewId }) {
  const { motes, glows } = AMBIENT[view];

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {glows.map((glow, index) => (
        <span
          key={`g${index}`}
          className="absolute -translate-x-1/2 -translate-y-1/2 animate-breathe rounded-full mix-blend-screen"
          style={{
            left: `${glow.x}%`,
            top: `${glow.y}%`,
            width: `${glow.size}%`,
            aspectRatio: "1",
            background: `radial-gradient(circle, ${glow.color}, transparent 65%)`,
            animationDelay: `${-index * 2.3}s`,
          }}
        />
      ))}
      {motes.flatMap((region, regionIndex) =>
        Array.from({ length: region.count }, (_, index) => {
          const seed = regionIndex * 100 + index;
          const style = {
            left: `${region.x + seeded(seed) * region.width}%`,
            top: `${region.y + seeded(seed + 0.5) * region.height}%`,
            width: `${2 + seeded(seed + 1) * 2}px`,
            height: `${2 + seeded(seed + 1) * 2}px`,
            animationDuration: `${10 + seeded(seed + 2) * 9}s`,
            animationDelay: `${-seeded(seed + 3) * 18}s`,
            "--mote-dx": `${(seeded(seed + 4) - 0.5) * 60}px`,
            "--mote-dy": `${-20 - seeded(seed + 5) * 50}px`,
          } as CSSProperties;
          return (
            <span
              key={`m${seed}`}
              className="absolute animate-mote rounded-full bg-[rgb(255_236_200/0.75)] blur-[0.5px] motion-reduce:hidden"
              style={style}
            />
          );
        }),
      )}
    </div>
  );
}
