import type { ReactNode } from "react";
import { CheckCircle2 } from "lucide-react";
import { ArchitectureDiagram } from "@/components/projects/ArchitectureDiagram";
import { ProjectGallery } from "@/components/projects/ProjectGallery";
import { TagList } from "@/components/ui/Tag";
import { cn } from "@/lib/cn";
import type { Project } from "@/types/portfolio";

type HeadingLevel = "h2" | "h3";

interface CaseStudyProps {
  project: Project;
  /** Heading level for section titles; use "h2" when the project title is the page h1. */
  headingLevel?: HeadingLevel;
  /** Preload the cover when it is the page's largest above-the-fold element. */
  preloadCover?: boolean;
}

function Block({
  title,
  headingLevel: Heading,
  children,
  className,
}: {
  title: string;
  headingLevel: HeadingLevel;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("border-t border-line pt-8", className)}>
      <Heading className="eyebrow mb-4">{title}</Heading>
      {children}
    </section>
  );
}

export function CaseStudy({ project, headingLevel = "h3", preloadCover = false }: CaseStudyProps) {
  const prose = "leading-relaxed text-muted text-pretty";

  return (
    <div className="space-y-10">
      <ProjectGallery key={project.id} project={project} preloadCover={preloadCover} />

      <dl className="grid gap-4 sm:grid-cols-2">
        <div className="surface-card p-5">
          <dt className="font-mono text-[0.6875rem] tracking-[0.14em] text-subtle uppercase">Role</dt>
          <dd className="mt-2 text-sm leading-relaxed text-fg">{project.role}</dd>
        </div>
        <div className="surface-card p-5">
          <dt className="font-mono text-[0.6875rem] tracking-[0.14em] text-subtle uppercase">Company</dt>
          <dd className="mt-2 text-sm text-fg">{project.company}</dd>
        </div>
        {project.metrics.map((metric) => (
          <div key={metric.label} className="rounded-[var(--radius-card)] border border-accent/25 bg-accent/[0.06] p-5 sm:col-span-2">
            <dt className="text-sm text-muted">{metric.label}</dt>
            <dd className="mt-1 text-3xl font-semibold tracking-tight text-fg">{metric.value}</dd>
          </div>
        ))}
      </dl>

      <Block title="Overview" headingLevel={headingLevel}>
        <p className={cn(prose, "text-fg/90")}>{project.description}</p>
      </Block>

      <Block title="Problem" headingLevel={headingLevel}>
        <p className={prose}>{project.problem}</p>
      </Block>

      <Block title="Architecture" headingLevel={headingLevel}>
        <ArchitectureDiagram
          id={`arch-${project.slug}`}
          architecture={project.architecture}
          label={`${project.title} system design`}
        />
      </Block>

      <Block title="What made it hard" headingLevel={headingLevel}>
        <ul className="space-y-3">
          {project.challenges.map((challenge) => (
            <li key={challenge} className={cn(prose, "flex gap-3")}>
              <span aria-hidden="true" className="mt-2.5 h-px w-3 shrink-0 bg-accent" />
              {challenge}
            </li>
          ))}
        </ul>
      </Block>

      <Block title="Solution" headingLevel={headingLevel}>
        <p className={prose}>{project.solution}</p>
      </Block>

      <Block title="Skills used" headingLevel={headingLevel}>
        <TagList items={project.technologies} />
      </Block>

      <Block title="Impact" headingLevel={headingLevel}>
        <ul className="space-y-3">
          {project.impact.map((item) => (
            <li key={item} className="flex gap-3 leading-relaxed text-fg/90">
              <CheckCircle2 className="mt-1 size-4 shrink-0 text-accent" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
      </Block>

      <Block title="Decisions" headingLevel={headingLevel}>
        <ol className="space-y-3">
          {project.decisions.map((decision, index) => (
            <li key={decision} className={cn(prose, "flex gap-4")}>
              <span className="font-mono text-xs leading-7 text-accent">{String(index + 1).padStart(2, "0")}</span>
              {decision}
            </li>
          ))}
        </ol>
      </Block>
    </div>
  );
}
