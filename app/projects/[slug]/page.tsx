import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { JsonLd } from "@/components/layout/JsonLd";
import { CaseStudy } from "@/components/projects/CaseStudy";
import { getProjectBySlug, projects } from "@/data/projects";
import { projectJsonLd } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};

  const path = `/projects/${project.slug}`;
  return {
    title: `${project.title} Case Study`,
    description: project.summary,
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      url: path,
      title: `${project.title} | William Glas`,
      description: project.summary,
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} | William Glas`,
      description: project.summary,
    },
  };
}

export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const index = projects.indexOf(project);
  const next = projects[(index + 1) % projects.length];

  return (
    <article className="pt-32 pb-24 md:pt-40 md:pb-32">
      <JsonLd data={projectJsonLd(project)} />
      <div className="container-page max-w-4xl">
        <Link
          href="/#projects"
          className="inline-flex items-center gap-2 font-mono text-xs tracking-[0.16em] text-muted uppercase transition-colors hover:text-fg"
        >
          <ArrowLeft className="size-3.5" aria-hidden="true" />
          All projects
        </Link>

        <header className="mt-10 mb-12">
          <p className="eyebrow">{project.company} · Case study</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-balance text-fg md:text-6xl">
            {project.title}
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-muted text-pretty md:text-xl">{project.summary}</p>
        </header>

        <CaseStudy project={project} headingLevel="h2" preloadCover />

        <nav aria-label="More case studies" className="mt-20 border-t border-line pt-10">
          <Link
            href={`/projects/${next.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group surface-card flex items-center justify-between gap-6 p-6 transition-colors hover:border-accent/30 md:p-8"
          >
            <span>
              <span className="block font-mono text-[0.6875rem] tracking-[0.14em] text-subtle uppercase">
                Next case study
              </span>
              <span className="mt-2 block text-xl font-semibold tracking-tight text-fg md:text-2xl">
                {next.title}
              </span>
              <span className="sr-only">(opens in a new tab)</span>
            </span>
            <ArrowRight
              className="size-5 shrink-0 text-muted transition-[transform,color] duration-300 group-hover:translate-x-1 group-hover:text-accent"
              aria-hidden="true"
            />
          </Link>
        </nav>
      </div>
    </article>
  );
}
