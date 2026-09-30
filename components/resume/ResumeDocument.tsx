import { profile } from "@/data/profile";
import { resume } from "@/data/resume";
import { cn } from "@/lib/cn";

type HeadingTag = "h1" | "h2" | "h3" | "h4" | "h5";

interface ResumeDocumentProps {
  /** The phone number is only shown on the full résumé page, never on the landing experience. */
  showPhone?: boolean;
  /** Level of the name heading; section and role headings nest below it. */
  headingLevel?: 1 | 3;
  className?: string;
}

function SectionTitle({ as: Tag, children }: { as: HeadingTag; children: string }) {
  return (
    <Tag className="mt-8 border-b border-stone-900/15 pb-1.5 font-sans text-[0.6875rem] font-semibold tracking-[0.2em] text-stone-600 uppercase">
      {children}
    </Tag>
  );
}

/** Verbatim résumé content styled as a printed page. */
export function ResumeDocument({ showPhone = false, headingLevel = 3, className }: ResumeDocumentProps) {
  const { contact } = profile;
  const Title = `h${headingLevel}` as HeadingTag;
  const Section = `h${headingLevel + 1}` as HeadingTag;
  const Role = `h${headingLevel + 2}` as HeadingTag;

  return (
    <article className={cn("font-serif text-stone-800", className)}>
      <header className="border-b-2 border-stone-900 pb-5">
        <Title className="text-4xl leading-none tracking-tight text-stone-950 md:text-5xl">{profile.name}</Title>
        <p className="mt-3 font-sans text-sm font-medium text-stone-700">{resume.headline}</p>
        <p className="mt-2 flex flex-wrap gap-x-3 gap-y-1 font-sans text-[0.8125rem] text-stone-600">
          <a href={`mailto:${contact.email}`} className="underline-offset-2 hover:underline">
            {contact.email}
          </a>
          <span aria-hidden="true">|</span>
          <a
            href={contact.linkedin.url}
            target="_blank"
            rel="noopener noreferrer"
            className="underline-offset-2 hover:underline"
          >
            {contact.linkedin.display}
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
          {showPhone && (
            <>
              <span aria-hidden="true">|</span>
              <a href={`tel:+1${contact.phone.replace(/\D/g, "")}`} className="underline-offset-2 hover:underline">
                {contact.phone}
              </a>
            </>
          )}
        </p>
      </header>

      <div>
        <SectionTitle as={Section}>Summary</SectionTitle>
        <p className="mt-3 text-[0.9375rem] leading-relaxed">{resume.summary}</p>

        <SectionTitle as={Section}>Work Experience</SectionTitle>
        {resume.roles.map((role) => (
          <section key={role.id} className="mt-5">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4">
              <Role className="text-xl text-stone-950">{role.company}</Role>
              <p className="font-sans text-[0.8125rem] text-stone-600">{role.period}</p>
            </div>
            <p className="font-sans text-sm text-stone-700">
              {role.title} · {role.location}
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-[0.9375rem] leading-relaxed marker:text-stone-400">
              {role.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          </section>
        ))}

        <SectionTitle as={Section}>Technical Skills</SectionTitle>
        <dl className="mt-3 space-y-1.5 text-[0.9375rem] leading-relaxed">
          {resume.skills.map((line) => (
            <div key={line.label}>
              <dt className="inline font-sans text-sm font-semibold text-stone-950">{line.label}: </dt>
              <dd className="inline">{line.items}</dd>
            </div>
          ))}
        </dl>

        <SectionTitle as={Section}>Education</SectionTitle>
        <div className="mt-3 flex flex-wrap items-baseline justify-between gap-x-4">
          <div>
            <p className="text-lg text-stone-950">{resume.education.institution}</p>
            <p className="text-[0.9375rem]">{resume.education.degree}</p>
          </div>
          <p className="font-sans text-[0.8125rem] text-stone-600">{resume.education.period}</p>
        </div>
      </div>
    </article>
  );
}
