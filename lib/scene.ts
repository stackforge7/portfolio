import type { ScenePoint } from "@/types/portfolio";
import type { ViewportSize } from "@/hooks/useViewportSize";

export const SCENE_ASPECT = 16 / 9;

/** Size of a 16:9 stage that covers the viewport, like `object-fit: cover`. */
export function coverSize({ width, height }: ViewportSize): ViewportSize {
  return {
    width: Math.max(width, height * SCENE_ASPECT),
    height: Math.max(height, width / SCENE_ASPECT),
  };
}

export interface CameraTransform {
  x: number;
  y: number;
  scale: number;
}

function clamp(value: number, limit: number) {
  return Math.min(Math.max(value, -limit), limit);
}

/**
 * Translation and scale that bring `point` (percent of the stage) to `target`
 * (px offset from the viewport center) while keeping the stage covering the viewport.
 */
export function focusCamera(
  point: ScenePoint,
  zoom: number,
  viewport: ViewportSize,
  target: { x: number; y: number },
): CameraTransform {
  const stage = coverSize(viewport);
  const dx = (point.x / 100 - 0.5) * stage.width;
  const dy = (point.y / 100 - 0.5) * stage.height;

  return {
    x: clamp(target.x - zoom * dx, (zoom * stage.width - viewport.width) / 2),
    y: clamp(target.y - zoom * dy, (zoom * stage.height - viewport.height) / 2),
    scale: zoom,
  };
}

/**
 * CSS `matrix3d` that maps a `width`×`height` element (origin top-left) onto a quad given in
 * stage pixels, so flat HTML sits on a surface photographed at an angle.
 */
export function quadToMatrix3d(
  quad: [{ x: number; y: number }, { x: number; y: number }, { x: number; y: number }, { x: number; y: number }],
  width: number,
  height: number,
): string {
  const [p0, p1, p2, p3] = quad;
  const dx1 = p1.x - p2.x;
  const dx2 = p3.x - p2.x;
  const dx3 = p0.x - p1.x + p2.x - p3.x;
  const dy1 = p1.y - p2.y;
  const dy2 = p3.y - p2.y;
  const dy3 = p0.y - p1.y + p2.y - p3.y;

  let g = 0;
  let h = 0;
  if (dx3 !== 0 || dy3 !== 0) {
    const det = dx1 * dy2 - dx2 * dy1;
    g = (dx3 * dy2 - dx2 * dy3) / det;
    h = (dx1 * dy3 - dx3 * dy1) / det;
  }
  const a = p1.x - p0.x + g * p1.x;
  const b = p3.x - p0.x + h * p3.x;
  const d = p1.y - p0.y + g * p1.y;
  const e = p3.y - p0.y + h * p3.y;

  const values = [a / width, d / width, 0, g / width, b / height, e / height, 0, h / height, 0, 0, 1, 0, p0.x, p0.y, 0, 1];
  return `matrix3d(${values.map((value) => Number(value.toFixed(8))).join(",")})`;
}

/** How far the un-zoomed stage can be dragged horizontally on narrow screens. */
export function panLimit(viewport: ViewportSize): number {
  return Math.max(0, (coverSize(viewport).width - viewport.width) / 2);
}
