"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowLeft, ArrowRight, ArrowUpRight, X } from "lucide-react";
import { ProjectGallery } from "@/components/projects/ProjectGallery";
import { MediaImage } from "@/components/ui/MediaImage";
import { TagList } from "@/components/ui/Tag";
import { getProjectBySlug, projects } from "@/data/projects";
import { rememberProject, useLastProject } from "@/lib/studio/preferences";
import { roomAudio } from "@/lib/studio/audio";

const EASE = [0.16, 1, 0.3, 1] as const;

interface ProjectsWindowProps {
  slug: string | null;
  onSelect: (slug: string | null) => void;
  onClose: () => void;
}

/** The laptop's projects app. Reopens to the last project a returning visitor viewed. */
export function ProjectsWindow({ slug, onSelect, onClose }: ProjectsWindowProps) {
  const lastProject = useLastProject();
  const [browsing, setBrowsing] = useState(false);
  const selected = getProjectBySlug(slug ?? (browsing ? "" : (lastProject ?? "")));
  const selectedIndex = selected ? projects.indexOf(selected) : -1;
  const next = selected ? projects[(selectedIndex + 1) % projects.length] : undefined;

  function open(target: string) {
    rememberProject(target);
    roomAudio.play("click");
    onSelect(target);
  }

  function showAll() {
    setBrowsing(true);
    roomAudio.play("click");
    onSelect(null);
  }

  return (
    <motion.section
      aria-label="Projects on the laptop"
      initial={{ opacity: 0, scale: 0.94, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, y: 10, transition: { duration: 0.2 } }}
      transition={{ duration: 0.55, delay: 0.35, ease: EASE }}
      className="absolute inset-x-3 top-16 bottom-20 z-30 flex flex-col overflow-hidden rounded-2xl border border-white/15 bg-[#0e1218]/92 shadow-2xl shadow-black/60 backdrop-blur-xl lg:inset-x-auto lg:top-1/2 lg:bottom-auto lg:left-1/2 lg:h-[min(40rem,76vh)] lg:w-[min(64rem,84vw)] lg:-translate-x-1/2 lg:-translate-y-1/2"
    >
      <div className="flex h-11 shrink-0 items-center gap-2 border-b border-white/10 px-4">
        <span aria-hidden="true" className="size-2.5 rounded-full bg-white/20" />
        <span aria-hidden="true" className="size-2.5 rounded-full bg-white/20" />
        <span aria-hidden="true" className="size-2.5 rounded-full bg-white/20" />
        <h3 className="ml-3 font-mono text-[0.6875rem] tracking-[0.16em] text-white/70 uppercase">
          {selected ? `Projects / ${selected.title}` : "Projects"}
        </h3>
        <button
          type="button"
          onClick={onClose}
          data-autofocus
          aria-label="Close the laptop"
          className="ml-auto inline-flex size-8 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white"
        >
          <X className="size-4" aria-hidden="true" />
        </button>
      </div>

      <div className="scrollbar-subtle min-h-0 flex-1 overflow-y-auto overscroll-contain">
        {selected ? (
          <article key={selected.id} className="p-5 md:p-8">
            <button
              type="button"
              onClick={showAll}
              className="inline-flex items-center gap-2 font-mono text-[0.6875rem] tracking-[0.16em] text-white/60 uppercase transition-colors hover:text-white"
            >
              <ArrowLeft className="size-3.5" aria-hidden="true" />
              All projects
            </button>
            <div className="mt-5 grid gap-6 md:grid-cols-[1.1fr_1fr] md:gap-8">
              <ProjectGallery key={selected.id} project={selected} sizes="(min-width: 1024px) 34rem, 92vw" />

              <div>
                <p className="font-mono text-[0.6875rem] tracking-[0.16em] text-accent-strong uppercase">
                  {selected.company}
                </p>
                <h4 className="mt-2 text-2xl font-semibold tracking-tight text-white md:text-3xl">{selected.title}</h4>
                <p className="mt-3 leading-relaxed text-white/75">{selected.summary}</p>
                <p className="mt-4 text-sm leading-relaxed text-white/60">
                  <span className="text-white/85">The hard part: </span>
                  {selected.challenge}
                </p>
                {selected.metrics.length > 0 && (
                  <ul className="mt-5 flex flex-wrap gap-3">
                    {selected.metrics.map((metric) => (
                      <li key={metric.label} className="rounded-xl border border-accent/25 bg-accent/10 px-3 py-2">
                        <span className="block font-mono text-base text-accent-strong">{metric.value}</span>
                        <span className="text-xs text-white/65">{metric.label}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              <section>
                <h5 className="font-mono text-[0.6875rem] tracking-[0.16em] text-white/50 uppercase">Impact</h5>
                <ul className="mt-3 space-y-2 text-sm leading-relaxed text-white/75">
                  {selected.impact.map((item) => (
                    <li key={item} className="border-l border-white/15 pl-3">
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
              <section>
                <h5 className="font-mono text-[0.6875rem] tracking-[0.16em] text-white/50 uppercase">Built with</h5>
                <TagList items={selected.technologies} className="mt-3" />
              </section>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-white/10 pt-6">
              <Link
                href={`/projects/${selected.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center gap-2 rounded-full bg-accent px-5 font-mono text-xs tracking-[0.16em] text-canvas uppercase transition-colors hover:bg-accent-strong"
              >
                Read the case study
                <ArrowUpRight className="size-4" aria-hidden="true" />
                <span className="sr-only">(opens in a new tab)</span>
              </Link>
              {next && next.id !== selected.id && (
                <button
                  type="button"
                  onClick={() => open(next.slug)}
                  className="inline-flex h-11 items-center gap-2 rounded-full border border-white/15 px-5 font-mono text-xs tracking-[0.16em] text-white uppercase transition-colors hover:border-white/35"
                >
                  Next: {next.title}
                  <ArrowRight className="size-4" aria-hidden="true" />
                </button>
              )}
            </div>
          </article>
        ) : (
          <div className="p-5 md:p-8">
            <p className="max-w-xl leading-relaxed text-white/70">
              Pick a project to see what it solved and how.
            </p>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <li key={project.id}>
                  <button
                    type="button"
                    onClick={() => open(project.slug)}
                    className="group block w-full overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] text-left transition-colors hover:border-white/25 hover:bg-white/[0.06]"
                  >
                    <span className="relative block aspect-[16/10] overflow-hidden">
                      <MediaImage
                        image={project.cover}
                        decorative
                        sizes="(min-width: 1024px) 20rem, (min-width: 640px) 45vw, 92vw"
                        className="transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                    </span>
                    <span className="block p-4">
                      <span className="block font-mono text-[0.625rem] tracking-[0.16em] text-white/50 uppercase">
                        {project.company}
                      </span>
                      <span className="mt-1 block font-medium text-white">{project.title}</span>
                      <span className="mt-1 line-clamp-2 block text-sm leading-snug text-white/60">{project.summary}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </motion.section>
  );
}
