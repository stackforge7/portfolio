import type { EarlyRole, Education, Experience } from "@/types/portfolio";

export const experience: Experience[] = [
  {
    id: "github",
    company: "GitHub",
    role: "Senior Software Engineer",
    location: "Remote · Raleigh, NC",
    start: "2020-07",
    end: null,
    summary:
      "Joined in 2020 and was promoted to Senior. Works on pull requests and Code View, the in-browser editor, repository automation, GitHub Apps and Actions, Codespaces, and Copilot tooling, from the React front end down to the Rails monolith.",
    progression: [
      { title: "Software Engineer", start: "2020-07" },
      { title: "Software Engineer II", start: "2021-03" },
      { title: "Software Engineer III", start: "2022-08" },
      { title: "Senior Software Engineer", start: "2024-09" },
    ],
    highlights: [
      {
        id: "gh-automation",
        title: "Developer automation platforms",
        description:
          "Architected developer automation and repository-management platforms spanning frontend, APIs, event handling, and data storage.",
        technologies: [
          "Node.js",
          "TypeScript",
          "Python",
          "React",
          "GraphQL",
          "REST",
          "Webhooks",
          "PostgreSQL",
          "MySQL",
          "Redis",
          "GitHub Actions",
        ],
      },
      {
        id: "gh-apps",
        title: "GitHub Apps & Actions integrations",
        description:
          "Built GitHub Apps and Actions integrations with authentication, async processing, caching, rate limiting, retries, and event-driven automation.",
        technologies: [
          "Node.js",
          "TypeScript",
          "Octokit",
          "GraphQL",
          "Webhooks",
          "Redis",
          "Relational databases",
        ],
      },
      {
        id: "gh-codespaces",
        title: "Codespaces workflows",
        description:
          "Worked on GitHub Codespaces workflows and cloud infrastructure; prebuilds helped reduce environment setup from roughly 45 minutes to around 10 seconds.",
        technologies: ["Python", "Docker", "Kubernetes", "GitHub Actions", "Cloud infrastructure"],
        metric: { value: "~45 min → ~10 s", label: "Codespaces setup with prebuilds" },
      },
      {
        id: "gh-copilot",
        title: "Copilot engineering workflows",
        description:
          "Built GitHub Copilot-related engineering workflows with repository-aware retrieval, tool calling, streaming responses, and automated evaluation. GitHub research reported 55% faster task completion with Copilot.",
        technologies: [
          "Python",
          "LLM APIs",
          "Repository-aware retrieval",
          "Tool calling",
          "Streaming",
          "Automated evaluation",
        ],
        metric: { value: "55%", label: "Faster task completion (GitHub research)" },
      },
      {
        id: "gh-codeview",
        title: "Code View & pull-request experiences",
        description:
          "Built GitHub Code View and pull-request experiences, improving rendering of an ~18,000-line file from around 27 seconds to under 1 second.",
        technologies: [
          "React",
          "TypeScript",
          "GraphQL",
          "REST",
          "Client caching",
          "Virtualization",
          "Lazy loading",
        ],
        metric: { value: "~27 s → <1 s", label: "Rendering an ~18,000-line file" },
      },
      {
        id: "gh-architecture",
        title: "Scalable application architecture",
        description:
          "Designed application architecture across Node.js/Python services, PostgreSQL/MySQL, Redis, React, and asynchronous processing, applying indexing, transactions, caching, background jobs, and resilient API patterns for high-volume developer workloads.",
        technologies: ["Node.js", "Python", "PostgreSQL", "MySQL", "Redis", "React", "Background jobs"],
      },
      {
        id: "gh-cloud",
        title: "Cloud-native delivery",
        description:
          "Led cloud-native delivery with GitHub Actions CI/CD, automating infrastructure, deployments, horizontal scaling, secrets management, monitoring, and production recovery across distributed services.",
        technologies: ["AWS", "Azure", "Docker", "Kubernetes", "Terraform", "GitHub Actions"],
      },
      {
        id: "gh-ownership",
        title: "End-to-end product ownership",
        description:
          "Owned products from system and API architecture through backend/frontend implementation, database design, automated testing, deployment, observability, and production support, while mentoring developers on platform and distributed-system patterns.",
        technologies: ["System design", "API design", "Automated testing", "Observability", "Mentoring"],
      },
    ],
    technologies: [
      "Node.js",
      "TypeScript",
      "Python",
      "Ruby on Rails",
      "React",
      "GraphQL",
      "REST",
      "Octokit",
      "PostgreSQL",
      "MySQL",
      "Redis",
      "Docker",
      "Kubernetes",
      "GitHub Actions",
    ],
  },
  {
    id: "microsoft",
    company: "Microsoft",
    role: "Software Engineer",
    location: "Redmond, WA",
    start: "2019-03",
    end: "2020-07",
    summary:
      "Came back full-time after a 2018 internship to work on the Microsoft Commerce Platform: services, REST APIs, and pages for catalog, cart, checkout, and orders on Azure.",
    highlights: [
      {
        id: "ms-commerce",
        title: "Full-stack commerce features",
        description:
          "Developed full-stack features for the Microsoft Commerce Platform supporting product catalog, customer accounts, shopping carts, checkout, orders, and fulfillment workflows.",
        technologies: ["C#", "ASP.NET Core", "Angular", "TypeScript", "Azure", "Azure SQL"],
      },
      {
        id: "ms-frontend",
        title: "Shopping, checkout & account workflows",
        description:
          "Built shopping, checkout, and account workflows across Angular/TypeScript frontends and ASP.NET Core REST APIs, integrating product, pricing, inventory, customer, cart, and order data.",
        technologies: ["Angular", "TypeScript", "ASP.NET Core", "REST"],
      },
      {
        id: "ms-apis",
        title: "Backend services & data",
        description:
          "Designed and implemented backend services applying authentication, validation, transactional processing, schema design, and query optimization.",
        technologies: ["C#", "ASP.NET Core", "Entity Framework Core", "Azure SQL"],
      },
      {
        id: "ms-async",
        title: "Asynchronous commerce operations",
        description:
          "Implemented Azure Functions and asynchronous workflows for order processing, inventory synchronization, notifications, and other background commerce operations.",
        technologies: ["Azure Functions", "Async workflows"],
      },
      {
        id: "ms-operations",
        title: "Delivery, testing & production support",
        description:
          "Collaborated with product, frontend, backend, and QA engineers to deliver features through CI/CD, automated testing, structured logging, and production troubleshooting.",
        technologies: ["Azure DevOps", "Docker", "Application Insights", "CI/CD"],
      },
    ],
    technologies: [
      "C#",
      "ASP.NET Core",
      "Angular",
      "TypeScript",
      "Azure",
      "Azure SQL",
      "Entity Framework Core",
      "Azure Functions",
      "Docker",
      "Azure DevOps",
      "Application Insights",
    ],
  },
];

/** Newest first, matching the timeline. */
export const earlyCareer: EarlyRole[] = [
  {
    id: "microsoft-intern",
    organization: "Microsoft",
    role: "Software Engineering Intern",
    period: "Summer 2018",
    startYear: 2018,
    location: "Redmond, WA",
    story:
      "A summer on the Cloud Orchestration Platform team of Visual Studio Team Services, the service that became Azure DevOps. He came back full-time the following spring.",
    technologies: ["Cloud orchestration", "Visual Studio Team Services"],
  },
  {
    id: "allscripts",
    organization: "Allscripts",
    role: "Software Development Intern",
    period: "Summer 2017",
    startYear: 2017,
    location: "Raleigh-Durham, NC",
    story:
      "Worked with the Shield team, a cloud security platform for authentication and authorization, building a web app that lets clinicians sign prescriptions electronically using two-factor authentication.",
    technologies: ["C#", "ASP.NET Core", "JavaScript", "SAML"],
  },
  {
    id: "sageworks",
    organization: "Sageworks",
    role: "Software Quality Assurance Intern",
    period: "2015-2017",
    startYear: 2015,
    location: "Raleigh-Durham, NC",
    story:
      "His first job: two summers and a spring semester turning manual test cases into Java and Selenium tests, fixing broken ones, and writing shared helpers for the rest of the team.",
    technologies: ["Java", "Selenium", "Test automation"],
  },
];

export const education: Education[] = [
  {
    id: "bs-cs",
    degree: "Bachelor of Science",
    field: "Computer Science",
    institution: "North Carolina State University",
    startYear: 2015,
    endYear: 2019,
    story:
      "Stayed in Raleigh for college after graduating high school as valedictorian, and spent summers writing production software.",
  },
];

export function getExperienceById(id: string): Experience | undefined {
  return experience.find((item) => item.id === id);
}
