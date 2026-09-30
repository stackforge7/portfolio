"use client";

import { useCallback, useState } from "react";
import posthog from "posthog-js";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { ProjectModal } from "@/components/projects/ProjectModal";
import { Reveal } from "@/components/ui/Reveal";
import { replaceLocationHash, useLocationHash } from "@/hooks/useLocationHash";
import { cn } from "@/lib/cn";
import type { Project } from "@/types/portfolio";

const HASH_PREFIX = "#project-";

/** Every skill used across the projects, most-used first. */
function skillsIn(projects: Project[]) {
  const counts = new Map<string, number>();
  for (const project of projects) {
    for (const tech of project.technologies) counts.set(tech, (counts.get(tech) ?? 0) + 1);
  }
  return [...counts].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
}

export function ProjectsGallery({ projects }: { projects: Project[] }) {
  const hash = useLocationHash();
  const [skill, setSkill] = useState<string | null>(null);
  const skills = skillsIn(projects);
  const visible = skill ? projects.filter((project) => project.technologies.includes(skill)) : projects;

  const selected = hash.startsWith(HASH_PREFIX)
    ? projects.find((project) => project.slug === hash.slice(HASH_PREFIX.length))
    : undefined;

  const open = useCallback((slug: string) => replaceLocationHash(`${HASH_PREFIX}${slug}`), []);
  const close = useCallback(() => replaceLocationHash(""), []);

  function filterBySkill(nextSkill: string | null) {
    const selectedSkill = skill === nextSkill ? null : nextSkill;
    posthog.capture("projects_filtered", { selected_skill: selectedSkill ?? "all" });
    setSkill(selectedSkill);
  }

  return (
    <>
      <Reveal className="mb-10">
        <p id="project-skills-label" className="font-mono text-[0.6875rem] tracking-[0.16em] text-subtle uppercase">
          Filter by skill
        </p>
        <div role="group" aria-labelledby="project-skills-label" className="mt-4 flex flex-wrap gap-2">
          <SkillChip label="All projects" count={projects.length} pressed={skill === null} onClick={() => filterBySkill(null)} />
          {skills.map(([name, count]) => (
            <SkillChip
              key={name}
              label={name}
              count={count}
              pressed={skill === name}
              onClick={() => filterBySkill(name)}
            />
          ))}
        </div>
        <p role="status" className="mt-4 min-h-5 text-sm text-muted">
          {skill &&
            `${skill} shows up in ${visible.length} ${visible.length === 1 ? "project" : "projects"}: ${visible.map((project) => project.title).join(", ")}.`}
        </p>
      </Reveal>

      <ul className="grid gap-4 md:grid-cols-2">
        {visible.map((project, index) => {
          const wide = index === 0 || (visible.length % 2 === 0 && index === visible.length - 1);
          return (
            <Reveal
              as="li"
              key={project.id}
              delay={(index % 2) * 0.08}
              className={cn(wide && "md:col-span-2")}
            >
              <ProjectCard project={project} index={projects.indexOf(project)} onOpen={open} wide={wide} highlight={skill} />
            </Reveal>
          );
        })}
      </ul>
      <ProjectModal project={selected} onClose={close} />
    </>
  );
}

interface SkillChipProps {
  label: string;
  count: number;
  pressed: boolean;
  onClick: () => void;
}

function SkillChip({ label, count, pressed, onClick }: SkillChipProps) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={cn(
        "inline-flex h-8 items-center gap-2 rounded-full border px-3 text-[0.8125rem] transition-colors",
        pressed
          ? "border-accent/50 bg-accent/15 text-fg"
          : "border-line bg-white/[0.02] text-muted hover:border-line-strong hover:text-fg",
      )}
    >
      {label}
      <span className={cn("font-mono text-[0.6875rem]", pressed ? "text-accent-strong" : "text-subtle")}>{count}</span>
    </button>
  );
}
