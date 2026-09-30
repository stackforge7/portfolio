"use client";

import { useState, type KeyboardEvent } from "react";
import { motion } from "motion/react";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { MediaImage } from "@/components/ui/MediaImage";
import { cn } from "@/lib/cn";
import type { Project, ProjectScreenshot } from "@/types/portfolio";

interface ProjectGalleryProps {
  project: Project;
  /** Preload the cover when it is the page's largest above-the-fold element. */
  preloadCover?: boolean;
  sizes?: string;
  className?: string;
}

const COVER_CAPTION = "Illustration. The other images are screenshots of real public pages.";

/** The illustrated cover first, then real screenshots framed in a browser window with their source. */
export function ProjectGallery({
  project,
  preloadCover = false,
  sizes = "(min-width: 896px) 832px, 100vw",
  className,
}: ProjectGalleryProps) {
  const [index, setIndex] = useState(0);
  const total = project.gallery.length + 1;
  const shot: ProjectScreenshot | null = index === 0 ? null : project.gallery[index - 1];

  function go(delta: number) {
    setIndex((current) => (current + delta + total) % total);
  }

  function onKeyDown(event: KeyboardEvent) {
    if (event.key === "ArrowRight") go(1);
    else if (event.key === "ArrowLeft") go(-1);
    else return;
    event.preventDefault();
  }

  const arrow =
    "absolute top-1/2 z-10 inline-flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/55 text-white backdrop-blur-md transition-colors hover:border-white/35 hover:bg-black/75";

  return (
    <figure
      aria-roledescription="carousel"
      aria-label={`${project.title} images`}
      onKeyDown={onKeyDown}
      className={cn("space-y-4", className)}
    >
      <div className="relative aspect-[16/10] overflow-hidden rounded-[var(--radius-card)] border border-line bg-[#0b0e13]">
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35 }}
          className="absolute inset-0 flex flex-col"
        >
          {shot ? (
            <>
              <div className="flex h-8 shrink-0 items-center gap-3 border-b border-white/10 bg-[#161a21] px-3">
                <span aria-hidden="true" className="flex gap-1.5">
                  <span className="size-2.5 rounded-full bg-[#ff5f57]/80" />
                  <span className="size-2.5 rounded-full bg-[#febc2e]/80" />
                  <span className="size-2.5 rounded-full bg-[#28c840]/80" />
                </span>
                <span className="mx-auto max-w-[70%] truncate rounded-md bg-white/[0.06] px-3 py-0.5 font-mono text-[0.6875rem] text-white/60">
                  {shot.source.label}
                </span>
                <span aria-hidden="true" className="w-[42px]" />
              </div>
              <div className="relative min-h-0 flex-1">
                <MediaImage image={shot} sizes={sizes} className="object-top" />
              </div>
            </>
          ) : (
            <div className="relative flex-1">
              <MediaImage image={project.cover} preload={preloadCover} sizes={sizes} />
            </div>
          )}
        </motion.div>

        <span className="absolute bottom-3 left-3 z-10 rounded-full border border-white/15 bg-black/60 px-2.5 py-1 font-mono text-[0.625rem] tracking-[0.14em] text-white/80 uppercase backdrop-blur-md">
          {shot ? "Screenshot" : "Illustration"}
        </span>
        <span className="absolute right-3 bottom-3 z-10 rounded-full border border-white/15 bg-black/60 px-2.5 py-1 font-mono text-[0.625rem] tracking-[0.14em] text-white/80 backdrop-blur-md">
          {index + 1} / {total}
        </span>

        <button type="button" onClick={() => go(-1)} aria-label="Previous image" className={cn(arrow, "left-3")}>
          <ChevronLeft className="size-5" aria-hidden="true" />
        </button>
        <button type="button" onClick={() => go(1)} aria-label="Next image" className={cn(arrow, "right-3")}>
          <ChevronRight className="size-5" aria-hidden="true" />
        </button>
      </div>

      <figcaption aria-live="polite" className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <span className="max-w-2xl text-sm leading-relaxed text-muted text-pretty">
          {shot ? shot.caption : COVER_CAPTION}
        </span>
        {shot && (
          <a
            href={shot.source.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex shrink-0 items-center gap-1.5 font-mono text-[0.6875rem] tracking-[0.12em] text-accent uppercase transition-colors hover:text-accent-strong"
          >
            Source: {shot.source.label}
            <ArrowUpRight className="size-3.5" aria-hidden="true" />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        )}
      </figcaption>

      <div role="group" aria-label="Choose an image" className="grid grid-cols-5 gap-2 sm:gap-3">
        {[project.cover, ...project.gallery].map((image, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Image ${i + 1} of ${total}: ${image.alt}`}
            aria-current={i === index ? "true" : undefined}
            className={cn(
              "relative aspect-[16/10] overflow-hidden rounded-lg border transition-[opacity,border-color] duration-200",
              i === index ? "border-accent opacity-100" : "border-line opacity-55 hover:opacity-90",
            )}
          >
            <MediaImage image={image} decorative sizes="160px" className={i === 0 ? undefined : "object-top"} />
          </button>
        ))}
      </div>
    </figure>
  );
}
