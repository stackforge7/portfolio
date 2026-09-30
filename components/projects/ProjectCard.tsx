"use client";

import type { MouseEvent, PointerEvent } from "react";
import { ArrowUpRight } from "lucide-react";
import { MediaImage } from "@/components/ui/MediaImage";
import { Tag } from "@/components/ui/Tag";
import { cn } from "@/lib/cn";
import type { Project } from "@/types/portfolio";

const VISIBLE_TECH = 5;

interface ProjectCardProps {
  project: Project;
  index: number;
  onOpen: (slug: string) => void;
  /** Spans the full grid width; uses a cinematic cover ratio. */
  wide?: boolean;
  /** A skill to surface first and emphasize among the tags. */
  highlight?: string | null;
  className?: string;
}

function isModifiedClick(event: MouseEvent) {
  return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0;
}

export function ProjectCard({ project, index, onOpen, wide = false, highlight = null, className }: ProjectCardProps) {
  const metric = project.metrics[0];
  const extraTech = project.technologies.length - VISIBLE_TECH;
  const technologies =
    highlight && project.technologies.includes(highlight)
      ? [highlight, ...project.technologies.filter((tech) => tech !== highlight)]
      : project.technologies;

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    if (isModifiedClick(event)) return;
    event.preventDefault();
    onOpen(project.slug);
  }

  function trackPointer(event: PointerEvent<HTMLElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--x", `${event.clientX - rect.left}px`);
    event.currentTarget.style.setProperty("--y", `${event.clientY - rect.top}px`);
  }

  return (
    <article
      onPointerMove={trackPointer}
      className={cn(
        "group surface-card relative isolate flex h-full flex-col overflow-hidden p-6 transition-[border-color,transform,box-shadow] duration-500 ease-out-expo hover:-translate-y-1 hover:border-accent/30 hover:shadow-[0_24px_60px_-30px_rgb(76_201_240/0.35)] has-[a:focus-visible]:border-accent/60 has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-accent/70 md:p-8",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100 [background:radial-gradient(420px_circle_at_var(--x,50%)_var(--y,0%),rgb(76_201_240/0.08),transparent_60%)]"
      />

      <div
        className={cn(
          "relative -mx-6 -mt-6 mb-6 aspect-[16/9] overflow-hidden border-b border-line md:-mx-8 md:-mt-8 md:mb-8",
          wide && "md:aspect-[21/9]",
        )}
      >
        <MediaImage
          image={project.cover}
          decorative
          sizes={wide ? "(min-width: 1216px) 1152px, 100vw" : "(min-width: 1216px) 568px, (min-width: 768px) 50vw, 100vw"}
          className="transition-transform duration-[1200ms] ease-out-expo group-hover:scale-[1.04]"
        />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-surface via-surface/10 to-transparent" />
        <span className="absolute top-4 right-4 rounded-full border border-white/15 bg-black/55 px-2.5 py-1 font-mono text-[0.625rem] tracking-[0.14em] text-white/80 uppercase backdrop-blur-md md:top-5 md:right-5">
          {project.gallery.length + 1} images
        </span>
      </div>

      <div className="flex items-center justify-between font-mono text-[0.6875rem] tracking-[0.14em] text-subtle uppercase">
        <span>
          {String(index + 1).padStart(2, "0")} · {project.company}
        </span>
        <ArrowUpRight
          className="size-4 text-muted transition-[transform,color] duration-500 ease-out-expo group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent"
          aria-hidden="true"
        />
      </div>

      <h3 className="relative mt-6 text-2xl font-semibold tracking-tight text-fg">
        <a
          href={`/projects/${project.slug}`}
          onClick={handleClick}
          aria-haspopup="dialog"
          className="after:absolute after:inset-[-100vmax] focus-visible:outline-none"
        >
          {project.title}
        </a>
      </h3>
      <p className="mt-3 leading-relaxed text-muted text-pretty">{project.summary}</p>

      <p className="mt-5 border-l border-accent/40 pl-4 text-sm leading-relaxed text-muted">
        <span className="font-mono text-[0.6875rem] tracking-[0.14em] text-subtle uppercase">Challenge · </span>
        {project.challenge}
      </p>

      <div className="mt-auto pt-8">
        {metric && (
          <p className="mb-6">
            <span className="block text-3xl font-semibold tracking-tight text-fg">{metric.value}</span>
            <span className="mt-1 block text-sm text-muted">{metric.label}</span>
          </p>
        )}
        <ul className="flex flex-wrap gap-1.5" aria-label="Skills used">
          {technologies.slice(0, VISIBLE_TECH).map((tech) => (
            <li key={tech}>
              <Tag tone={tech === highlight ? "accent" : "default"}>{tech}</Tag>
            </li>
          ))}
          {extraTech > 0 && (
            <li>
              <Tag tone="accent">+{extraTech} more</Tag>
            </li>
          )}
        </ul>
      </div>
    </article>
  );
}
