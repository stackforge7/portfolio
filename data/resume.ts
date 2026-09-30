import type { Resume } from "@/types/portfolio";

export const resume: Resume = {
  headline: "Senior Software Engineer | Node.js, TypeScript, Python & React",
  summary:
    "Senior Software Engineer with 7+ years of experience building full-stack applications, developer platforms, and cloud-native systems at GitHub and Microsoft. Strong in Node.js, TypeScript, Python, React, GraphQL, and REST APIs, with hands-on experience in AI/LLM integration, event-driven systems, Kubernetes, Terraform, CI/CD, automated testing, and production observability across Azure and AWS.",
  roles: [
    {
      id: "github",
      company: "GitHub",
      title: "Senior Software Engineer",
      location: "San Francisco, CA",
      period: "Jul 2020 - Present",
      bullets: [
        "Architected developer automation and repository-management platforms using Node.js, TypeScript, Python, React, GraphQL/REST APIs, webhooks, PostgreSQL/MySQL, Redis, and GitHub Actions, supporting high-volume repository, CI/CD, and developer workflows.",
        "Built end-to-end GitHub Apps and Actions integrations with Node.js, TypeScript, Octokit, GraphQL, webhooks, Redis, and relational databases, implementing authentication, asynchronous processing, caching, rate limiting, retries, and event-driven automation.",
        "Engineered GitHub Codespaces developer workflows using Python, containerized environments, GitHub Actions, Docker, Kubernetes, and cloud infrastructure, automating repository setup and environment provisioning; GitHub reported reducing setup time from roughly 45 minutes to ~10 seconds through prebuilds.",
        "Developed GitHub Copilot-powered engineering workflows using Python, LLM APIs, repository-aware retrieval, tool calling, streaming responses, and automated evaluation, integrating AI capabilities with developer context and workflows associated with 55% faster task completion in GitHub research.",
        "Built high-performance GitHub Code View and pull-request experiences using React, TypeScript, GraphQL/REST APIs, client-side caching, virtualization, and lazy loading, helping reduce rendering of an ~18,000-line file from roughly 27 seconds to under 1 second.",
        "Designed scalable application architecture across Node.js/Python services, PostgreSQL/MySQL, Redis, React, and asynchronous processing, applying indexing, transactions, caching, background jobs, and resilient API patterns for high-volume developer workloads.",
        "Led cloud-native delivery using AWS, Azure, Docker, Kubernetes, Terraform, and GitHub Actions CI/CD, automating infrastructure, deployments, horizontal scaling, secrets management, monitoring, and production recovery across distributed services.",
        "Owned products from system and API architecture through backend/frontend implementation, database design, automated testing, deployment, observability, and production support, collaborating across engineering teams and mentoring developers on platform and distributed-system patterns.",
      ],
    },
    {
      id: "microsoft",
      company: "Microsoft",
      title: "Software Engineer",
      location: "Redmond, WA",
      period: "Mar 2019 - Jul 2020",
      bullets: [
        "Developed full-stack features for the Microsoft Commerce Platform using C#, ASP.NET Core, Angular, TypeScript, Azure, and Azure SQL, supporting product catalog, customer accounts, shopping carts, checkout, orders, and fulfillment workflows.",
        "Built shopping, checkout, and account workflows across Angular/TypeScript frontends and ASP.NET Core REST APIs, integrating product, pricing, inventory, customer, cart, and order data.",
        "Designed and implemented backend services using C#, ASP.NET Core, Entity Framework Core, and Azure SQL, applying authentication, validation, transactional processing, schema design, and query optimization.",
        "Implemented Azure Functions and asynchronous workflows for order processing, inventory synchronization, notifications, and other background commerce operations.",
        "Collaborated with product, frontend, backend, and QA engineers to deliver features through Azure DevOps, Docker, CI/CD, Application Insights, automated testing, structured logging, and production troubleshooting.",
      ],
    },
  ],
  skills: [
    { label: "Languages", items: "TypeScript, JavaScript, Python, C#, SQL" },
    {
      label: "Frontend",
      items:
        "React, Angular, TypeScript, reusable component architecture, client-side caching, lazy loading, virtualization",
    },
    {
      label: "Backend & APIs",
      items:
        "Node.js, ASP.NET Core, Entity Framework Core, REST APIs, GraphQL, Octokit, Webhooks, async/await, background jobs, event-driven processing",
    },
    {
      label: "Databases & Caching",
      items:
        "PostgreSQL, MySQL, Azure SQL, Redis, schema design, indexing, query optimization, transactions, caching",
    },
    {
      label: "AI & Developer Tools",
      items:
        "GitHub Copilot, LLM APIs, repository-aware retrieval, tool/function calling, streaming responses, automated evaluation, GitHub Codespaces",
    },
    {
      label: "GitHub Platform",
      items:
        "GitHub Actions, GitHub Apps, Octokit, repository automation, CI/CD workflows, pull-request workflows, webhooks",
    },
    {
      label: "Cloud & Infrastructure",
      items: "AWS, Azure, Docker, Kubernetes, Terraform, Azure Functions, Infrastructure as Code",
    },
    {
      label: "Distributed Systems & Reliability",
      items:
        "Asynchronous processing, event-driven architecture, rate limiting, retries, horizontal scaling, secrets management, monitoring, production recovery",
    },
    {
      label: "DevOps & Observability",
      items:
        "GitHub Actions CI/CD, Azure DevOps, Application Insights, structured logging, automated deployment, production troubleshooting",
    },
    { label: "Testing", items: "Automated Testing, Integration Testing, Frontend/Backend Testing" },
  ],
  education: {
    institution: "North Carolina State University",
    degree: "Bachelor of Science in Computer Science",
    period: "2015 - 2019",
  },
};
