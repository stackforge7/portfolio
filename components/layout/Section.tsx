import type { ReactNode } from "react";
import { SplitHeading } from "@/components/ui/SplitHeading";
import { cn } from "@/lib/cn";

interface SectionProps {
  id: string;
  index: string;
  eyebrow: string;
  title: string;
  intro?: string;
  children: ReactNode;
  className?: string;
  titleClassName?: string;
}

export function Section({
  id,
  index,
  eyebrow,
  title,
  intro,
  children,
  className,
  titleClassName,
}: SectionProps) {
  const headingId = `${id}-heading`;

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      tabIndex={-1}
      className={cn("relative py-24 focus:outline-none md:py-32", className)}
    >
      <div className="container-page">
        <header className="mb-12 max-w-3xl md:mb-16">
          <p className="eyebrow flex items-center gap-3">
            <span className="text-subtle">{index}</span>
            <span aria-hidden="true" className="h-px w-8 bg-accent/40" />
            {eyebrow}
          </p>
          <SplitHeading
            id={headingId}
            text={title}
            className={cn("mt-5 text-4xl font-semibold tracking-tight text-fg md:text-6xl", titleClassName)}
          />
          {intro && <p className="mt-6 text-lg leading-relaxed text-muted text-pretty">{intro}</p>}
        </header>
        {children}
      </div>
    </section>
  );
}
