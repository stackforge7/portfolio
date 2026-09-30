import { ArrowUpRight, FileText, Mail, Phone } from "lucide-react";
import { Section } from "@/components/layout/Section";
import { ButtonLink, buttonStyles } from "@/components/ui/Button";
import { LinkedInIcon } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/Reveal";
import { profile } from "@/data/profile";

const { contact, resume } = profile;
const phoneHref = `tel:+1${contact.phone.replace(/\D/g, "")}`;

const details = [
  { label: "Email", value: contact.email, href: `mailto:${contact.email}`, icon: Mail, external: false },
  {
    label: "LinkedIn",
    value: contact.linkedin.display,
    href: contact.linkedin.url,
    icon: LinkedInIcon,
    external: true,
  },
  { label: "Phone", value: contact.phone, href: phoneHref, icon: Phone, external: false },
];

export function Contact() {
  return (
    <Section
      id="contact"
      index="04"
      eyebrow="Contact"
      title="Let's build something useful."
      titleClassName="uppercase md:text-7xl"
      intro="I’m open to senior front-end and full-stack roles, or just a chat about developer tools. Email is the fastest way to reach me."
      className="isolate overflow-hidden"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 bottom-0 -z-10 h-[32rem] w-[48rem] translate-x-1/3 translate-y-1/3 rounded-full bg-[radial-gradient(circle,rgb(76_201_240/0.1),transparent_65%)]"
      />

      <Reveal className="flex flex-wrap gap-3">
        <ButtonLink href={`mailto:${contact.email}`} size="lg">
          <Mail className="size-4" aria-hidden="true" />
          Email William
        </ButtonLink>
        <ButtonLink
          href={contact.linkedin.url}
          target="_blank"
          rel="noopener noreferrer"
          variant="secondary"
          size="lg"
        >
          <LinkedInIcon className="size-4" />
          LinkedIn
          <span className="sr-only">(opens in a new tab)</span>
        </ButtonLink>
        {resume.href ? (
          <ButtonLink href={resume.href} target="_blank" rel="noopener noreferrer" variant="secondary" size="lg">
            <FileText className="size-4" aria-hidden="true" />
            {resume.label}
            <span className="sr-only">(opens in a new tab)</span>
          </ButtonLink>
        ) : (
          <button
            type="button"
            disabled
            className={buttonStyles({ variant: "secondary", size: "lg" })}
            aria-describedby="resume-status"
          >
            <FileText className="size-4" aria-hidden="true" />
            Resume
            <span id="resume-status" className="rounded-full bg-white/10 px-2 py-0.5 text-[0.625rem] normal-case tracking-normal">
              Coming soon
            </span>
          </button>
        )}
      </Reveal>

      <Reveal delay={0.1}>
        <dl className="mt-16 grid gap-4 md:grid-cols-3">
          {details.map(({ label, value, href, icon: Icon, external }) => (
            <div key={label} className="surface-card group relative p-6 transition-colors hover:border-line-strong">
              <dt className="flex items-center gap-2 font-mono text-[0.6875rem] tracking-[0.14em] text-subtle uppercase">
                <Icon className="size-3.5" aria-hidden="true" />
                {label}
              </dt>
              <dd className="mt-3">
                <a
                  href={href}
                  {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="inline-flex items-center gap-1.5 break-all text-fg transition-colors hover:text-accent-strong"
                >
                  {value}
                  {external && <ArrowUpRight className="size-3.5 shrink-0" aria-hidden="true" />}
                  {external && <span className="sr-only">(opens in a new tab)</span>}
                </a>
              </dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </Section>
  );
}
