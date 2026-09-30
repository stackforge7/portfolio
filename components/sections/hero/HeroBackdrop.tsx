"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { ScenePill } from "@/components/lab/ScenePill";
import { MediaImage } from "@/components/ui/MediaImage";
import { studioDoorAnchor, studioExteriorImage } from "@/data/scene";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const SPRING = { stiffness: 50, damping: 20, mass: 0.8 };
/** Portrait screens shift the stage so the studio, not the open sky, stays in frame. */
const STAGE_CLASS = "scene-cover [@media(max-aspect-ratio:4/3)]:[translate:-58%_-50%]";

/**
 * Full-bleed studio exterior with subtle pointer parallax, legibility gradients,
 * and an "Enter" control pinned to the studio's glass door.
 */
export function HeroBackdrop({ onEnter }: { onEnter: () => void }) {
  const reduceMotion = useReducedMotion();
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const pointerX = useSpring(rawX, SPRING);
  const pointerY = useSpring(rawY, SPRING);
  const imageX = useTransform(pointerX, (v) => v * -18);
  const imageY = useTransform(pointerY, (v) => v * -12);

  useEffect(() => {
    if (reduceMotion || !window.matchMedia("(pointer: fine)").matches) return;

    function onPointerMove(event: PointerEvent) {
      rawX.set(event.clientX / window.innerWidth - 0.5);
      rawY.set(event.clientY / window.innerHeight - 0.5);
    }

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", onPointerMove);
  }, [reduceMotion, rawX, rawY]);

  return (
    <>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <motion.div style={{ x: imageX, y: imageY }} className="absolute -inset-6 [container-type:size]">
          <div className={STAGE_CLASS}>
            <MediaImage image={studioExteriorImage} decorative preload sizes="(max-aspect-ratio: 16/9) 178vh, 100vw" quality={80} />
          </div>
        </motion.div>

        <div className="absolute inset-0 bg-gradient-to-b from-canvas/70 via-canvas/40 to-canvas/20 md:hidden" />
        <div className="absolute inset-0 hidden bg-gradient-to-r from-canvas/75 via-canvas/25 to-transparent md:block" />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-canvas/60 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-canvas to-transparent" />
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 hidden overflow-hidden md:block"
      >
        <motion.div style={{ x: imageX, y: imageY }} className="absolute -inset-6 [container-type:size]">
          <div className={STAGE_CLASS}>
            <div data-hero-item className="absolute inset-0">
              <ScenePill
                anchor={studioDoorAnchor}
                size="lg"
                tabIndex={-1}
                onClick={onEnter}
                className="pointer-events-auto"
              >
                Enter
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </ScenePill>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}
