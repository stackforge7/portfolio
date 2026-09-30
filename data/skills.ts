import type { SkillCategory } from "@/types/portfolio";

/** The bookshelf: one book per area, each skill listed once. */
export const skillCategories: SkillCategory[] = [
  {
    id: "languages",
    title: "The everyday languages",
    context: "Used daily, in some mix",
    description:
      "Most of his GitHub work is TypeScript, front end and back end. github.com runs on Ruby, Python came with the Codespaces and Copilot work, and C# covered Allscripts and Microsoft. Java was his first, for Selenium tests at Sageworks.",
    skills: ["TypeScript", "JavaScript", "Ruby", "Python", "C#", "Java", "SQL"],
  },
  {
    id: "frontend",
    title: "Interfaces that stay fast",
    context: "React at GitHub · Angular at Microsoft",
    description:
      "Code View has to open files with tens of thousands of lines, so a lot of the work is rendering only what's on screen. React at GitHub, Angular for the shopping and checkout pages at Microsoft.",
    skills: ["React", "Angular", "Virtualization", "Lazy loading", "Client caching", "Reusable components"],
  },
  {
    id: "backend",
    title: "Services, APIs & data",
    context: "Node.js and Rails at GitHub · ASP.NET Core at Microsoft",
    description:
      "Node.js for GitHub automation, the Rails monolith for pull requests and Code View, and ASP.NET Core for Microsoft commerce. Postgres and MySQL for data that has to be correct, Redis for caches and rate limits.",
    skills: [
      "Node.js",
      "Ruby on Rails",
      "GraphQL",
      "REST",
      "ASP.NET Core",
      "Entity Framework Core",
      "PostgreSQL",
      "MySQL",
      "Azure SQL",
      "Redis",
    ],
  },
  {
    id: "github",
    title: "Building on GitHub itself",
    context: "GitHub · since 2020",
    description:
      "Apps that react to webhooks, Actions that run on every push, Octokit calls that stay inside rate limits, and Codespaces that are ready when you open them.",
    skills: ["GitHub Apps", "GitHub Actions", "Octokit", "Webhooks", "GitHub Codespaces", "Pull-request workflows"],
  },
  {
    id: "ai",
    title: "AI in the workflow",
    context: "Copilot-related work at GitHub",
    description:
      "Most of the work is around the model: finding the right repository context, streaming responses, and scoring output automatically so changes can be compared.",
    skills: [
      "GitHub Copilot",
      "LLM APIs",
      "Repository-aware retrieval",
      "Tool calling",
      "Streaming",
      "Automated evaluation",
    ],
  },
  {
    id: "cloud",
    title: "Shipping it",
    context: "AWS and Azure",
    description:
      "Containers on Kubernetes, infrastructure in Terraform, pipelines in GitHub Actions and Azure DevOps, and background jobs in Azure Functions.",
    skills: ["Docker", "Kubernetes", "Terraform", "AWS", "Azure", "Azure Functions", "Azure DevOps"],
  },
  {
    id: "reliability",
    title: "Keeping it working",
    context: "Since a QA internship in 2015",
    description:
      "His first job was writing Selenium tests at Sageworks, and he still writes tests first. Beyond that: retries that are safe to repeat, respecting rate limits, and enough logging to catch problems early.",
    skills: [
      "Automated testing",
      "Selenium",
      "Integration testing",
      "Retries",
      "Rate limiting",
      "Application Insights",
      "Structured logging",
      "Production troubleshooting",
    ],
  },
];
