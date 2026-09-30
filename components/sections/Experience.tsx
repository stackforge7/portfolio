import { GraduationCap, MapPin } from "lucide-react";
import { Section } from "@/components/layout/Section";
import { ExpandableList } from "@/components/sections/experience/ExpandableList";
import { TimelineRail } from "@/components/sections/experience/TimelineRail";
import { Reveal } from "@/components/ui/Reveal";
import { TagList } from "@/components/ui/Tag";
import { earlyCareer, education, experience } from "@/data/experience";
import { formatPeriod, yearOf } from "@/lib/format";
import type { Experience as ExperienceEntry, ExperienceHighlight } from "@/types/portfolio";

const selectedResults = experience.flatMap((entry) =>
  entry.highlights.filter((highlight) => highlight.metric),
);

function TimelineMarker() {
  return (
    <span
      aria-hidden="true"
      className="absolute top-1.5 left-0 flex size-[15px] items-center justify-center rounded-full border border-accent/50 bg-canvas md:left-48"
    >
      <span className="size-[5px] rounded-full bg-accent" />
    </span>
  );
}

function HighlightItem({ highlight }: { highlight: ExperienceHighlight }) {
  return (
    <div className="border-l border-line py-1 pl-5">
      <h4 className="font-medium text-fg">{highlight.title}</h4>
      <p className="mt-1.5 text-sm leading-relaxed text-muted">{highlight.description}</p>
      <TagList items={highlight.technologies} className="mt-3" />
    </div>
  );
}

function RoleEntry({ entry }: { entry: ExperienceEntry }) {
  const endYear = entry.end ? yearOf(entry.end) : "Present";

  return (
    <li className="relative pl-9 md:grid md:grid-cols-[12rem_1fr] md:pl-0">
      <TimelineMarker />
      <p className="font-mono text-xs tracking-[0.14em] text-subtle md:pt-1">
        {yearOf(entry.start)} → {endYear}
      </p>
      <Reveal className="mt-3 md:mt-0 md:pl-12">
        <article className="surface-card p-6 md:p-8">
          <header className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
            <div>
              <h3 className="text-2xl font-semibold tracking-tight text-fg">{entry.company}</h3>
              <p className="mt-1 text-accent-strong">{entry.role}</p>
            </div>
            <div className="text-sm text-muted md:text-right">
              <p>{formatPeriod(entry.start, entry.end)}</p>
              <p className="mt-1 inline-flex items-center gap-1.5">
                <MapPin className="size-3.5" aria-hidden="true" />
                {entry.location}
              </p>
            </div>
          </header>
          <p className="mt-6 leading-relaxed text-muted text-pretty">{entry.summary}</p>
          {entry.progression && (
            <ol
              aria-label={`Titles at ${entry.company}`}
              className="mt-5 flex flex-wrap items-center gap-2 font-mono text-[0.6875rem] tracking-[0.06em]"
            >
              {entry.progression.map((step, index) => (
                <li key={step.start} className="inline-flex items-center gap-2">
                  {index > 0 && (
                    <span aria-hidden="true" className="text-accent">
                      →
                    </span>
                  )}
                  <span className="rounded-full border border-line px-2.5 py-1 text-fg/85">
                    <span className="text-subtle">{yearOf(step.start)}</span> {step.title}
                  </span>
                </li>
              ))}
            </ol>
          )}
          <div className="mt-8">
            <ExpandableList className="space-y-6">
              {entry.highlights.map((highlight) => (
                <HighlightItem key={highlight.id} highlight={highlight} />
              ))}
            </ExpandableList>
          </div>
        </article>
      </Reveal>
    </li>
  );
}

export function Experience() {
  return (
    <Section
      id="experience"
      index="02"
      eyebrow="Experience"
      title="Building at GitHub and Microsoft."
      intro="From a QA internship in Raleigh in 2015 to senior engineer at GitHub."
    >
      <ul aria-label="Selected results" className="mb-20 grid gap-4 md:grid-cols-3">
        {selectedResults.map((highlight, index) => (
          <Reveal as="li" key={highlight.id} delay={index * 0.08} className="surface-card p-6">
            <p className="text-3xl font-semibold tracking-tight text-fg md:text-4xl">
              {highlight.metric?.value}
            </p>
            <p className="mt-2 text-sm text-muted">{highlight.metric?.label}</p>
            <p className="mt-4 font-mono text-[0.6875rem] tracking-[0.14em] text-subtle uppercase">
              {highlight.title}
            </p>
          </Reveal>
        ))}
      </ul>

      <TimelineRail>
        {experience.map((entry) => (
          <RoleEntry key={entry.id} entry={entry} />
        ))}
        <li className="relative pl-9 md:grid md:grid-cols-[12rem_1fr] md:pl-0">
          <TimelineMarker />
          <p className="font-mono text-xs tracking-[0.14em] text-subtle md:pt-1">
            {earlyCareer.at(-1)?.startYear} → {earlyCareer[0]?.startYear}
          </p>
          <Reveal className="mt-3 md:mt-0 md:pl-12">
            <article className="surface-card p-6 md:p-8">
              <h3 className="text-2xl font-semibold tracking-tight text-fg">Where it started</h3>
              <p className="mt-2 leading-relaxed text-muted text-pretty">
                Three internships while studying at NC State.
              </p>
              <ol className="mt-6 space-y-6">
                {earlyCareer.map((role) => (
                  <li key={role.id} className="border-l border-line py-1 pl-5">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                      <h4 className="font-medium text-fg">
                        {role.organization} <span className="text-accent-strong">· {role.role}</span>
                      </h4>
                      <p className="font-mono text-[0.6875rem] tracking-[0.1em] text-subtle">{role.period}</p>
                    </div>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted">{role.story}</p>
                    <TagList items={role.technologies} className="mt-3" />
                  </li>
                ))}
              </ol>
            </article>
          </Reveal>
        </li>
        {education.map((entry) => (
          <li key={entry.id} className="relative pl-9 md:grid md:grid-cols-[12rem_1fr] md:pl-0">
            <TimelineMarker />
            <p className="font-mono text-xs tracking-[0.14em] text-subtle md:pt-1">
              {entry.startYear} → {entry.endYear}
            </p>
            <Reveal className="mt-3 md:mt-0 md:pl-12">
              <div className="surface-card flex items-start gap-4 p-6 md:p-8">
                <GraduationCap className="mt-1 size-5 shrink-0 text-accent" aria-hidden="true" />
                <div>
                  <h3 className="text-xl font-semibold tracking-tight text-fg">
                    {entry.degree} in {entry.field}
                  </h3>
                  {entry.institution && <p className="mt-1 text-muted">{entry.institution}</p>}
                  {entry.story && <p className="mt-3 text-sm leading-relaxed text-muted text-pretty">{entry.story}</p>}
                </div>
              </div>
            </Reveal>
          </li>
        ))}
      </TimelineRail>
    </Section>
  );
}
