"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, X } from "lucide-react";
import { CaseStudy } from "@/components/projects/CaseStudy";
import { Dialog } from "@/components/ui/Dialog";
import type { Project } from "@/types/portfolio";

const TITLE_ID = "project-modal-title";

interface ProjectModalProps {
  project: Project | undefined;
  onClose: () => void;
}

export function ProjectModal({ project: current, onClose }: ProjectModalProps) {
  const [lastShown, setLastShown] = useState(current);
  if (current && current !== lastShown) setLastShown(current);
  const project = current ?? lastShown;

  return (
    <Dialog open={Boolean(current)} onClose={onClose} labelledBy={TITLE_ID}>
      {project && (
        <>
          <header className="sticky top-0 z-10 flex items-start justify-between gap-6 border-b border-line bg-surface/90 px-6 py-5 backdrop-blur-md md:px-10 md:py-6">
            <div>
              <p className="eyebrow">{project.company} · Case study</p>
              <h2 id={TITLE_ID} className="mt-2 text-2xl font-semibold tracking-tight text-fg md:text-3xl">
                {project.title}
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              data-autofocus
              aria-label="Close case study"
              className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-line-strong hover:text-fg"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          </header>

          <div className="px-6 py-8 md:px-10 md:py-10">
            <p className="mb-10 text-lg leading-relaxed text-fg/90 text-pretty">{project.summary}</p>
            <CaseStudy project={project} />
            <div className="mt-12 border-t border-line pt-8">
              <Link
                href={`/projects/${project.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-mono text-xs tracking-[0.16em] text-accent uppercase transition-colors hover:text-accent-strong"
              >
                Open full case study
                <ArrowUpRight className="size-3.5" aria-hidden="true" />
                <span className="sr-only">(opens in a new tab)</span>
              </Link>
            </div>
          </div>
        </>
      )}
    </Dialog>
  );
}
