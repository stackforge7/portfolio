import { experience } from "@/data/experience";
import { profile } from "@/data/profile";
import { absoluteUrl, siteConfig } from "@/lib/site";
import type { Project } from "@/types/portfolio";

type JsonLd = Record<string, unknown>;

export function serializeJsonLd(data: JsonLd): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function personJsonLd(): JsonLd {
  const current = experience.find((item) => item.end === null);

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: profile.title,
    description: profile.summary,
    url: siteConfig.url,
    email: `mailto:${profile.contact.email}`,
    sameAs: [profile.contact.linkedin.url],
    worksFor: current ? { "@type": "Organization", name: current.company } : undefined,
    knowsAbout: [
      "Node.js",
      "TypeScript",
      "Python",
      "React",
      "GraphQL",
      "Developer Platforms",
      "Distributed Systems",
      "Cloud Infrastructure",
      "AI / LLM Engineering",
    ],
  };
}

export function websiteJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.title,
    url: siteConfig.url,
    description: siteConfig.description,
  };
}

export function projectJsonLd(project: Project): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.summary,
    url: absoluteUrl(`/projects/${project.slug}`),
    keywords: project.technologies.join(", "),
    author: { "@type": "Person", name: profile.name, url: siteConfig.url },
  };
}
