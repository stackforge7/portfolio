import {
  Activity,
  Bot,
  Boxes,
  Cpu,
  Database,
  Layers,
  ListOrdered,
  Monitor,
  Plug,
  Server,
  Workflow,
  Zap,
  type LucideIcon,
} from "lucide-react";
import type {
  Architecture,
  ArchitectureEdge,
  ArchitectureFlow,
  ArchitectureNode,
  ArchitectureNodeKind,
} from "@/types/portfolio";

const KIND_ICONS: Record<ArchitectureNodeKind, LucideIcon> = {
  client: Monitor,
  frontend: Layers,
  api: Plug,
  service: Server,
  queue: ListOrdered,
  worker: Cpu,
  cache: Zap,
  database: Database,
  infra: Boxes,
  ai: Bot,
  event: Workflow,
  observability: Activity,
};

const FLOW: Record<ArchitectureFlow, { color: string; label: string; speed: number; dashed: boolean }> = {
  request: { color: "#4cc9f0", label: "Request", speed: 95, dashed: false },
  event: { color: "#f5b54a", label: "Async event", speed: 60, dashed: true },
  data: { color: "#7ee0a1", label: "Data read / write", speed: 75, dashed: false },
};

const KIND_FLOW: Partial<Record<ArchitectureNodeKind, ArchitectureFlow>> = {
  queue: "event",
  event: "event",
  database: "data",
  cache: "data",
};

const NODE = { w: 196, h: 60 };
const GAP = { x: 64, y: 72 };
const PAD = { x: 24, top: 44, bottom: 24 };
const CORNER = 14;

type Point = { x: number; y: number };
type Box = { x: number; y: number; w: number; h: number };

function nodeBox(node: ArchitectureNode): Box {
  return { x: PAD.x + node.col * (NODE.w + GAP.x), y: PAD.top + node.row * (NODE.h + GAP.y), w: NODE.w, h: NODE.h };
}

const cx = (b: Box) => b.x + b.w / 2;
const cy = (b: Box) => b.y + b.h / 2;

/** Orthogonal pipe between two nodes: straight when aligned, otherwise one rounded elbow. */
function route(a: Box, b: Box, mode: "vh" | "hv"): Point[] {
  if (cy(a) === cy(b)) {
    const forward = cx(b) > cx(a);
    return [
      { x: forward ? a.x + a.w : a.x, y: cy(a) },
      { x: forward ? b.x : b.x + b.w, y: cy(b) },
    ];
  }
  if (cx(a) === cx(b)) {
    const down = cy(b) > cy(a);
    return [
      { x: cx(a), y: down ? a.y + a.h : a.y },
      { x: cx(b), y: down ? b.y : b.y + b.h },
    ];
  }
  const right = cx(b) > cx(a);
  const down = cy(b) > cy(a);
  if (mode === "hv") {
    return [
      { x: right ? a.x + a.w : a.x, y: cy(a) },
      { x: cx(b), y: cy(a) },
      { x: cx(b), y: down ? b.y : b.y + b.h },
    ];
  }
  return [
    { x: cx(a), y: down ? a.y + a.h : a.y },
    { x: cx(a), y: cy(b) },
    { x: right ? b.x : b.x + b.w, y: cy(b) },
  ];
}

function toPath(points: Point[]) {
  if (points.length === 2) return `M${points[0].x} ${points[0].y}L${points[1].x} ${points[1].y}`;
  const [start, corner, end] = points;
  const unit = (from: Point, to: Point) => ({
    x: Math.sign(to.x - from.x),
    y: Math.sign(to.y - from.y),
  });
  const into = unit(start, corner);
  const out = unit(corner, end);
  return [
    `M${start.x} ${start.y}`,
    `L${corner.x - into.x * CORNER} ${corner.y - into.y * CORNER}`,
    `Q${corner.x} ${corner.y} ${corner.x + out.x * CORNER} ${corner.y + out.y * CORNER}`,
    `L${end.x} ${end.y}`,
  ].join("");
}

function length(points: Point[]) {
  let total = 0;
  for (let i = 1; i < points.length; i++) {
    total += Math.abs(points[i].x - points[i - 1].x) + Math.abs(points[i].y - points[i - 1].y);
  }
  return total;
}

/** Label beside the middle of the longest segment: above horizontal pipes, right of vertical ones. */
function labelAt(points: Point[]) {
  let best = { a: points[0], b: points[1], len: -1 };
  for (let i = 1; i < points.length; i++) {
    const len = Math.abs(points[i].x - points[i - 1].x) + Math.abs(points[i].y - points[i - 1].y);
    if (len > best.len) best = { a: points[i - 1], b: points[i], len };
  }
  const mid = { x: (best.a.x + best.b.x) / 2, y: (best.a.y + best.b.y) / 2 };
  return best.a.y === best.b.y
    ? { x: mid.x, y: mid.y - 9, anchor: "middle" as const }
    : { x: mid.x + 9, y: mid.y + 3.5, anchor: "start" as const };
}

interface ArchitectureDiagramProps {
  /** Unique per page; prefixes SVG ids. */
  id: string;
  architecture: Architecture;
  label: string;
}

export function ArchitectureDiagram({ id, architecture, label }: ArchitectureDiagramProps) {
  const { nodes, edges, groups = [] } = architecture;
  const boxes = new Map(nodes.map((node) => [node.id, nodeBox(node)]));
  const names = new Map(nodes.map((node) => [node.id, node.label]));
  const cols = Math.max(...nodes.map((node) => node.col)) + 1;
  const rows = Math.max(...nodes.map((node) => node.row)) + 1;
  const width = PAD.x * 2 + cols * NODE.w + (cols - 1) * GAP.x;
  const height = PAD.top + PAD.bottom + rows * NODE.h + (rows - 1) * GAP.y;
  const flows = (Object.keys(FLOW) as ArchitectureFlow[]).filter((flow) => edges.some((edge) => edge.flow === flow));

  const pipes = edges.map((edge, index) => {
    const points = route(boxes.get(edge.from)!, boxes.get(edge.to)!, edge.route ?? "vh");
    return { edge, index, points, d: toPath(points), len: length(points), pathId: `${id}-pipe-${index}` };
  });

  return (
    <figure>
      <div className="scrollbar-subtle overflow-x-auto rounded-[var(--radius-card)] border border-line bg-[radial-gradient(circle_at_1px_1px,rgb(255_255_255/0.05)_1px,transparent_0)] bg-[length:22px_22px]">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-labelledby={`${id}-title`}
          className="block h-auto w-full min-w-[720px]"
        >
          <title id={`${id}-title`}>{label}</title>
          <defs>
            <filter id={`${id}-glow`} x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="2.4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            {flows.map((flow) => (
              <marker
                key={flow}
                id={`${id}-arrow-${flow}`}
                viewBox="0 0 8 8"
                refX="7"
                refY="4"
                markerWidth="7"
                markerHeight="7"
                orient="auto-start-reverse"
              >
                <path d="M1 1L7 4L1 7" fill="none" stroke={FLOW[flow].color} strokeWidth="1.4" strokeLinecap="round" />
              </marker>
            ))}
          </defs>

          {groups.map((group) => {
            const members = group.nodes.map((nodeId) => boxes.get(nodeId)!);
            const x = Math.min(...members.map((b) => b.x)) - 14;
            const y = Math.min(...members.map((b) => b.y)) - 30;
            const right = Math.max(...members.map((b) => b.x + b.w)) + 14;
            const bottom = Math.max(...members.map((b) => b.y + b.h)) + 14;
            return (
              <g key={group.label}>
                <rect
                  x={x}
                  y={y}
                  width={right - x}
                  height={bottom - y}
                  rx="18"
                  fill="rgb(255 255 255 / 0.018)"
                  stroke="rgb(255 255 255 / 0.13)"
                  strokeDasharray="5 5"
                />
                <text
                  x={x + 14}
                  y={y + 19}
                  fill="#7d8591"
                  fontSize="10"
                  letterSpacing="1.4"
                  className="font-mono uppercase"
                >
                  {group.label}
                </text>
              </g>
            );
          })}

          {pipes.map(({ edge, d, pathId }) => {
            const flow = FLOW[edge.flow];
            const marker = `url(#${id}-arrow-${edge.flow})`;
            return (
              <g key={pathId}>
                <path d={d} fill="none" stroke="rgb(255 255 255 / 0.07)" strokeWidth="7" strokeLinecap="round" />
                <path
                  id={pathId}
                  d={d}
                  fill="none"
                  stroke={flow.color}
                  strokeOpacity="0.4"
                  strokeWidth="1.5"
                  strokeDasharray={flow.dashed ? "5 5" : undefined}
                  markerEnd={marker}
                  markerStart={edge.both ? marker : undefined}
                />
                {!edge.both && (
                  <path
                    d={d}
                    fill="none"
                    stroke={flow.color}
                    strokeWidth="2"
                    strokeDasharray="3 13"
                    strokeLinecap="round"
                    className="animate-pipe opacity-70 motion-reduce:hidden"
                  />
                )}
              </g>
            );
          })}

          <g filter={`url(#${id}-glow)`} className="motion-reduce:hidden">
            {pipes.flatMap(({ edge, len, pathId }) => {
              const flow = FLOW[edge.flow];
              const count = Math.max(1, Math.round(len / 120));
              const dur = Math.max(0.9, len / flow.speed);
              const directions = edge.both ? [false, true] : [false];
              return directions.flatMap((reverse) =>
                Array.from({ length: count }, (_, k) => {
                  const offset = ((k + (reverse ? 0.5 : 0)) / count) * dur;
                  return (
                    <circle key={`${pathId}-${reverse ? "r" : "f"}${k}`} r="3.2" fill={flow.color}>
                      <animateMotion
                        dur={`${dur.toFixed(2)}s`}
                        begin={`-${offset.toFixed(2)}s`}
                        repeatCount="indefinite"
                        {...(reverse ? { keyPoints: "1;0", keyTimes: "0;1", calcMode: "linear" } : {})}
                      >
                        <mpath href={`#${pathId}`} />
                      </animateMotion>
                    </circle>
                  );
                }),
              );
            })}
          </g>

          {nodes.map((node) => {
            const box = boxes.get(node.id)!;
            const Icon = KIND_ICONS[node.kind];
            const tint = FLOW[KIND_FLOW[node.kind] ?? "request"].color;
            return (
              <g key={node.id}>
                <rect
                  x={box.x}
                  y={box.y}
                  width={box.w}
                  height={box.h}
                  rx="12"
                  fill="#16191f"
                  stroke="rgb(255 255 255 / 0.14)"
                />
                <rect
                  x={box.x + 12}
                  y={box.y + 16}
                  width="28"
                  height="28"
                  rx="8"
                  fill={tint}
                  fillOpacity="0.1"
                  stroke={tint}
                  strokeOpacity="0.3"
                />
                <Icon x={box.x + 18} y={box.y + 22} width={16} height={16} color={tint} strokeWidth={1.8} />
                <text x={box.x + 50} y={box.y + (node.detail ? 27 : 35)} fill="#f5f7fa" fontSize="14" fontWeight="600">
                  {node.label}
                </text>
                {node.detail && (
                  <text x={box.x + 50} y={box.y + 44} fill="#8b93a0" fontSize="11.5">
                    {node.detail}
                  </text>
                )}
              </g>
            );
          })}

          {pipes.map(({ edge, points, pathId }) => {
            if (!edge.label) return null;
            const at = labelAt(points);
            return (
              <text
                key={`${pathId}-label`}
                x={at.x}
                y={at.y}
                textAnchor={at.anchor}
                fill="#9ba3af"
                fontSize="10.5"
                className="font-mono"
              >
                {edge.label}
              </text>
            );
          })}
        </svg>
      </div>

      <figcaption className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted">
        {flows.map((flow) => (
          <span key={flow} className="inline-flex items-center gap-2">
            <svg aria-hidden="true" width="28" height="8" viewBox="0 0 28 8">
              <line
                x1="1"
                y1="4"
                x2="27"
                y2="4"
                stroke={FLOW[flow].color}
                strokeOpacity="0.55"
                strokeWidth="1.5"
                strokeDasharray={FLOW[flow].dashed ? "4 3" : undefined}
              />
              <circle cx="14" cy="4" r="3" fill={FLOW[flow].color} />
            </svg>
            {FLOW[flow].label}
          </span>
        ))}
        <span className="text-subtle">Moving dots show which way data flows.</span>
      </figcaption>

      <ol className="sr-only">
        {edges.map((edge: ArchitectureEdge, index) => (
          <li key={index}>
            {names.get(edge.from)} {edge.both ? "↔" : "→"} {names.get(edge.to)}: {FLOW[edge.flow].label.toLowerCase()}
            {edge.label ? `, ${edge.label}` : ""}
          </li>
        ))}
      </ol>
    </figure>
  );
}
