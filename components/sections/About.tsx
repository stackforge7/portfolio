import { Boxes, Cloud, Network, Sparkles, type LucideIcon } from "lucide-react";
import { Section } from "@/components/layout/Section";
import { MediaImage } from "@/components/ui/MediaImage";
import { Reveal } from "@/components/ui/Reveal";
import { workspaceImage } from "@/data/media";
import { profile } from "@/data/profile";

const portrait = profile.photo ?? workspaceImage;

const FOCUS_ICONS: Record<string, LucideIcon> = {
  "developer-platforms": Boxes,
  "ai-systems": Sparkles,
  "distributed-systems": Network,
  "cloud-infrastructure": Cloud,
};

export function About() {
  return (
    <Section id="about" index="01" eyebrow="About" title="A bit about me.">
      <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-20">
        <div className="space-y-6 text-lg leading-relaxed text-muted text-pretty">
          {profile.about.map((paragraph, index) => (
            <Reveal key={paragraph.slice(0, 24)} delay={index * 0.08}>
              <p className={index === 0 ? "text-fg/90" : undefined}>{paragraph}</p>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1} className="space-y-4">
          <figure className="group surface-card relative aspect-[4/3] overflow-hidden">
            <MediaImage
              image={portrait}
              sizes="(min-width: 1024px) 28rem, (min-width: 768px) 80vw, 100vw"
              className="object-[50%_30%] transition-transform duration-[1200ms] ease-out-expo group-hover:scale-[1.03]"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-canvas/90 via-canvas/10 to-transparent"
            />
            <figcaption className="absolute inset-x-0 bottom-0 flex items-center justify-between p-5 font-mono text-[0.6875rem] tracking-[0.14em] text-muted uppercase">
              <span>{profile.photo ? profile.name : "The workspace"}</span>
              <span className="text-accent">{profile.title}</span>
            </figcaption>
          </figure>
          <dl className="surface-card divide-y divide-line">
            {profile.stats.map((stat) => (
              <div key={stat.label} className="flex items-baseline justify-between gap-6 px-6 py-5">
                <dt className="text-sm text-muted">{stat.label}</dt>
                <dd className="text-2xl font-semibold tracking-tight text-fg">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>

      <ul className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {profile.focusAreas.map((area, index) => {
          const Icon = FOCUS_ICONS[area.id] ?? Boxes;
          return (
            <Reveal
              as="li"
              key={area.id}
              delay={index * 0.06}
              className="surface-card group p-6 transition-colors duration-300 hover:border-line-strong"
            >
              <Icon
                className="size-5 text-accent transition-transform duration-500 ease-out-expo group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
              <h3 className="mt-5 font-medium text-fg">{area.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{area.description}</p>
            </Reveal>
          );
        })}
      </ul>

      <div className="mt-20 border-t border-line pt-12">
        <Reveal>
          <h3 className="font-mono text-xs tracking-[0.16em] text-subtle uppercase">How I like to work</h3>
        </Reveal>
        <ul className="mt-8 grid gap-x-12 gap-y-10 md:grid-cols-2">
          {profile.principles.map((principle, index) => (
            <Reveal as="li" key={principle.id} delay={index * 0.06} className="flex gap-5">
              <span className="pt-1 font-mono text-sm text-accent">{String(index + 1).padStart(2, "0")}</span>
              <div>
                <h4 className="text-lg font-medium text-fg">{principle.title}</h4>
                <p className="mt-2 leading-relaxed text-muted text-pretty">{principle.description}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </Section>
  );
}
