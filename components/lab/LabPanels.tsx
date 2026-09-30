"use client";

import Link from "next/link";
import { ArrowRight, FileText, GraduationCap } from "lucide-react";
import { ResumeDocument } from "@/components/resume/ResumeDocument";
import { earlyCareer, education, experience } from "@/data/experience";
import { profile } from "@/data/profile";
import { skillCategories } from "@/data/skills";
import { formatPeriod } from "@/lib/format";

export type PanelInspectorId = "experience" | "systems" | "about" | "resume";

export interface LabPanelProps {
  panel: PanelInspectorId;
  /** Where the panel was opened from, used for the eyebrow. */
  place: string;
  /** Closes the studio and scrolls the portfolio to a section. */
  onOpenSection: (sectionId: string) => void;
}

const SYSTEMS_CATEGORIES = new Set(["github", "cloud", "reliability"]);

function PanelHeader({ eyebrow, title, intro }: { eyebrow: string; title: string; intro?: string }) {
  return (
    <header>
      <p className="font-mono text-[0.6875rem] tracking-[0.18em] text-accent-strong uppercase">{eyebrow}</p>
      <h3 className="mt-3 text-3xl font-semibold tracking-tight text-white md:text-4xl">{title}</h3>
      {intro && <p className="mt-3 leading-relaxed text-white/70 text-pretty">{intro}</p>}
    </header>
  );
}

function SectionLink({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group mt-8 inline-flex items-center gap-2 font-mono text-xs tracking-[0.16em] text-white/70 uppercase transition-colors hover:text-white"
    >
      {label}
      <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true" />
    </button>
  );
}

function ExperiencePanel({ place, onOpenSection }: Omit<LabPanelProps, "panel">) {
  return (
    <>
      <PanelHeader
        eyebrow={place}
        title="Experience"
        intro="7+ years at Microsoft and GitHub, after internships starting in 2015."
      />
      <ol className="mt-6 space-y-4">
        {experience.map((role) => (
          <li key={role.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="flex flex-wrap items-baseline justify-between gap-x-3">
              <h4 className="text-xl font-semibold text-white">{role.company}</h4>
              <p className="font-mono text-[0.6875rem] tracking-[0.1em] text-white/50">
                {formatPeriod(role.start, role.end)}
              </p>
            </div>
            <p className="text-sm text-accent-strong">
              {role.role} · {role.location}
            </p>
            {role.progression && (
              <p className="mt-1 font-mono text-[0.6875rem] leading-relaxed text-white/50">
                {role.progression.map((step) => `${step.start.slice(0, 4)} ${step.title}`).join(" → ")}
              </p>
            )}
            <ul className="mt-4 space-y-2.5">
              {role.highlights.map((highlight) => (
                <li key={highlight.id} className="border-l border-white/15 pl-3 text-sm leading-snug text-white/75">
                  <span className="text-white">{highlight.title}</span>
                  {highlight.metric && (
                    <span className="mt-1 block font-mono text-xs text-accent-strong">
                      {highlight.metric.value} · {highlight.metric.label}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
      <p className="mt-4 text-sm leading-relaxed text-white/60">
        Before that:{" "}
        {earlyCareer
          .map((role) => `${role.organization} (${role.period})`)
          .reverse()
          .join(" · ")}
        .
      </p>
      <SectionLink label="Full timeline" onClick={() => onOpenSection("experience")} />
    </>
  );
}

function SystemsPanel({ place, onOpenSection }: Omit<LabPanelProps, "panel">) {
  const categories = skillCategories.filter((category) => SYSTEMS_CATEGORIES.has(category.id));
  return (
    <>
      <PanelHeader
        eyebrow={place}
        title="Systems that stay up"
        intro="How his services get built, deployed, and kept running on AWS and Azure."
      />
      <p className="mt-6 rounded-2xl border border-accent/25 bg-accent/10 p-4 text-sm leading-relaxed text-white/80">
        <span className="block font-mono text-lg text-accent-strong">~45 min → ~10 s</span>
        GitHub reported Codespaces prebuilds reducing environment setup from roughly 45 minutes to about 10 seconds.
      </p>
      <div className="mt-6 space-y-5">
        {categories.map((category) => (
          <section key={category.id}>
            <h4 className="font-mono text-[0.6875rem] tracking-[0.16em] text-white/55 uppercase">{category.title}</h4>
            <ul className="mt-2 flex flex-wrap gap-1.5">
              {category.skills.map((skill) => (
                <li
                  key={skill}
                  className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 text-[0.8125rem] leading-none text-white/85"
                >
                  {skill}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      <SectionLink label="See it in the projects" onClick={() => onOpenSection("projects")} />
    </>
  );
}

function AboutPanel({ place, onOpenSection }: Omit<LabPanelProps, "panel">) {
  return (
    <>
      <PanelHeader eyebrow={place} title={`About ${profile.name.split(" ")[0]}`} />
      <div className="mt-5 space-y-4 leading-relaxed text-white/75">
        {profile.about.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      <ul className="mt-6 grid gap-3 sm:grid-cols-2">
        {profile.focusAreas.map((area) => (
          <li key={area.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <h4 className="font-medium text-white">{area.title}</h4>
            <p className="mt-1.5 text-sm leading-snug text-white/60">{area.description}</p>
          </li>
        ))}
      </ul>
      {education.map((entry) => (
        <div key={entry.id} className="mt-3 flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <GraduationCap className="mt-0.5 size-5 shrink-0 text-accent-strong" aria-hidden="true" />
          <div>
            <h4 className="font-medium text-white">{entry.institution}</h4>
            <p className="text-sm text-white/60">
              {entry.degree} in {entry.field} · {entry.startYear}-{entry.endYear}
            </p>
          </div>
        </div>
      ))}
      <SectionLink label="Read more" onClick={() => onOpenSection("about")} />
    </>
  );
}

function ResumePanel() {
  return (
    <>
      <ResumeDocument headingLevel={3} />
      <div className="mt-8 flex flex-wrap gap-3 border-t border-stone-900/15 pt-6 font-sans">
        <Link
          href="/resume"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-11 items-center gap-2 rounded-full bg-stone-900 px-6 font-mono text-xs tracking-[0.16em] text-stone-50 uppercase transition-colors hover:bg-stone-700"
        >
          <FileText className="size-4" aria-hidden="true" />
          Full résumé page
          <span className="sr-only">(opens in a new tab)</span>
        </Link>
      </div>
    </>
  );
}

export function LabPanelContent({ panel, place, onOpenSection }: LabPanelProps) {
  switch (panel) {
    case "experience":
      return <ExperiencePanel place={place} onOpenSection={onOpenSection} />;
    case "systems":
      return <SystemsPanel place={place} onOpenSection={onOpenSection} />;
    case "about":
      return <AboutPanel place={place} onOpenSection={onOpenSection} />;
    case "resume":
      return <ResumePanel />;
  }
}
