const FALLBACK_SITE_URL = "https://williamglas.dev";

function resolveSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim() || FALLBACK_SITE_URL;
  return raw.replace(/\/+$/, "");
}

export const siteConfig = {
  name: "William Glas",
  url: resolveSiteUrl(),
  title: "William Glas | Senior Software Engineer",
  description:
    "Senior Software Engineer specializing in Node.js, TypeScript, Python, React, developer platforms, AI systems, distributed systems, and cloud infrastructure.",
  locale: "en_US",
  keywords: [
    "William Glas",
    "Senior Software Engineer",
    "Node.js",
    "TypeScript",
    "Python",
    "React",
    "GraphQL",
    "Developer Platforms",
    "GitHub",
    "Microsoft",
    "AI Engineering",
    "LLM",
    "Distributed Systems",
    "Cloud Infrastructure",
    "Kubernetes",
    "Terraform",
  ],
} as const;

export function absoluteUrl(path = "/"): string {
  return `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;
}
