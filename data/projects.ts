import aiCopilotDocs from "@/assets/images/projects/ai-engineering-assistant/copilot-docs.jpg";
import aiCopilotProduct from "@/assets/images/projects/ai-engineering-assistant/copilot-product.jpg";
import aiEngineeringAssistantCover from "@/assets/images/projects/ai-engineering-assistant/cover.jpg";
import aiResearchBlog from "@/assets/images/projects/ai-engineering-assistant/research-blog.jpg";
import aiResearchPaper from "@/assets/images/projects/ai-engineering-assistant/research-paper.jpg";
import commerceAzureFunctions from "@/assets/images/projects/cloud-commerce-platform/azure-functions.jpg";
import cloudCommercePlatformCover from "@/assets/images/projects/cloud-commerce-platform/cover.jpg";
import commerceMicrosoft365 from "@/assets/images/projects/cloud-commerce-platform/microsoft-365-plans.jpg";
import commerceStore from "@/assets/images/projects/cloud-commerce-platform/microsoft-store.jpg";
import codespacesProduct from "@/assets/images/projects/codespaces-automation/codespaces-product.jpg";
import codespacesAutomationCover from "@/assets/images/projects/codespaces-automation/cover.jpg";
import codespacesBlog from "@/assets/images/projects/codespaces-automation/engineering-blog.jpg";
import codespacesPrebuildsDocs from "@/assets/images/projects/codespaces-automation/prebuilds-docs.jpg";
import codespacesPrebuildsLaunch from "@/assets/images/projects/codespaces-automation/prebuilds-launch.jpg";
import developerAutomationPlatformCover from "@/assets/images/projects/developer-automation-platform/cover.jpg";
import automationAppsDocs from "@/assets/images/projects/developer-automation-platform/github-apps-docs.jpg";
import automationMarketplace from "@/assets/images/projects/developer-automation-platform/marketplace-apps.jpg";
import automationWorkflowRun from "@/assets/images/projects/developer-automation-platform/workflow-run.jpg";
import automationWorkflowRuns from "@/assets/images/projects/developer-automation-platform/workflow-runs.jpg";
import codeViewBlame from "@/assets/images/projects/high-performance-code-viewer/blame-view.jpg";
import codeViewFile from "@/assets/images/projects/high-performance-code-viewer/code-view.jpg";
import highPerformanceCodeViewerCover from "@/assets/images/projects/high-performance-code-viewer/cover.jpg";
import codeViewBlog from "@/assets/images/projects/high-performance-code-viewer/engineering-blog.jpg";
import codeViewPullRequest from "@/assets/images/projects/high-performance-code-viewer/pull-request-files.jpg";
import railsBackendCover from "@/assets/images/projects/rails-pull-request-backend/cover.jpg";
import railsGraphqlBlog from "@/assets/images/projects/rails-pull-request-backend/graphql-blog.jpg";
import railsPullRequestFiles from "@/assets/images/projects/rails-pull-request-backend/pull-request-files.jpg";
import railsBlog from "@/assets/images/projects/rails-pull-request-backend/rails-blog.jpg";
import railsSite from "@/assets/images/projects/rails-pull-request-backend/rails-site.jpg";
import seleniumAbrigo from "@/assets/images/projects/selenium-test-automation/abrigo-sageworks.jpg";
import seleniumTestAutomationCover from "@/assets/images/projects/selenium-test-automation/cover.jpg";
import seleniumPageObjects from "@/assets/images/projects/selenium-test-automation/page-objects.jpg";
import seleniumWaits from "@/assets/images/projects/selenium-test-automation/waits.jpg";
import seleniumWebDriver from "@/assets/images/projects/selenium-test-automation/webdriver-docs.jpg";
import signingAspNetMfa from "@/assets/images/projects/two-factor-prescription-signing/aspnet-mfa.jpg";
import prescriptionSigningCover from "@/assets/images/projects/two-factor-prescription-signing/cover.jpg";
import signingDeaFaq from "@/assets/images/projects/two-factor-prescription-signing/dea-epcs-faq.jpg";
import signingEcfr from "@/assets/images/projects/two-factor-prescription-signing/ecfr-1311.jpg";
import signingVeradigm from "@/assets/images/projects/two-factor-prescription-signing/veradigm-eprescribe.jpg";
import type { Project } from "@/types/portfolio";

export const projects: Project[] = [
  {
    id: "developer-automation-platform",
    slug: "developer-automation-platform",
    title: "Developer Automation Platform",
    company: "GitHub",
    cover: {
      src: developerAutomationPlatformCover,
      alt: "Illustration of streams of events flowing into a central glowing node that routes work to smaller workers and a database.",
    },
    gallery: [
      {
        src: automationWorkflowRun,
        alt: "A successful GitHub Actions run in actions/checkout: build, proxy, container, and output jobs all green, finished in 2 minutes 20 seconds.",
        caption: "A push kicks off a workflow run. Repository events like this are what the platform reacts to.",
        source: { label: "github.com/actions/checkout", url: "https://github.com/actions/checkout/actions/runs/29759200210" },
      },
      {
        src: automationWorkflowRuns,
        alt: "The workflow runs list for actions/checkout, with checks triggered automatically by Dependabot pull requests.",
        caption: "Bots open pull requests and checks run on each one automatically.",
        source: { label: "github.com/actions/checkout/actions", url: "https://github.com/actions/checkout/actions" },
      },
      {
        src: automationMarketplace,
        alt: "GitHub Marketplace filtered to apps, listing integrations such as Google Cloud Build, CircleCI, and Slack.",
        caption: "The GitHub Marketplace, where Apps that automate repositories are listed.",
        source: { label: "github.com/marketplace", url: "https://github.com/marketplace?type=apps" },
      },
      {
        src: automationAppsDocs,
        alt: "GitHub Docs page titled GitHub Apps overview, explaining how apps act on repositories and respond to events.",
        caption: "GitHub Apps docs: fine-grained permissions and short-lived tokens for each installation.",
        source: { label: "docs.github.com", url: "https://docs.github.com/en/apps/overview" },
      },
    ],
    summary:
      "Event-driven platform for repository management and developer automation, built on GitHub Apps, webhooks, and GraphQL.",
    description:
      "A platform for automating repository management and developer workflows. GitHub Apps and Actions integrations react to repository events, apply automation, and expose state through GraphQL and REST APIs with a React interface on top.",
    problem:
      "Repository management and routine developer workflows involve repetitive manual steps across many repositories. Automating them means reacting reliably to a high volume of platform events while staying inside API rate limits.",
    role: "Senior Software Engineer: architecture, backend services, GitHub integrations, and frontend.",
    challenge:
      "Processing webhook events reliably while respecting API rate limits and keeping automation safe to retry.",
    challenges: [
      "Absorbing bursts of webhook events without dropping or duplicating work.",
      "Staying within GitHub API rate limits across GraphQL and REST calls.",
      "Authenticating GitHub Apps securely across installations.",
      "Keeping automation consistent when downstream calls fail or time out.",
    ],
    solution:
      "Webhooks are verified and handed to asynchronous processing, where Node.js and TypeScript workers act on events through Octokit. Redis backs caching and rate-limit coordination, retries absorb transient failures, and PostgreSQL and MySQL hold durable state. A React interface backed by GraphQL gives teams visibility into automation.",
    technologies: [
      "Node.js",
      "TypeScript",
      "Python",
      "React",
      "GraphQL",
      "REST",
      "Webhooks",
      "Octokit",
      "PostgreSQL",
      "MySQL",
      "Redis",
      "GitHub Actions",
    ],
    impact: [
      "Replaced repetitive repository-management steps with event-driven automation.",
      "Decoupled event intake from processing so traffic spikes queue instead of failing.",
      "Established reusable patterns for GitHub Apps and Actions integrations.",
    ],
    metrics: [],
    architecture: {
      nodes: [
        { id: "events", label: "GitHub webhooks", detail: "Repository events", kind: "event", col: 0, row: 0 },
        { id: "receiver", label: "Webhook receiver", detail: "Node.js · HMAC check", kind: "api", col: 1, row: 0 },
        { id: "queue", label: "Job queue", detail: "Retries with backoff", kind: "queue", col: 2, row: 0 },
        { id: "repos", label: "Repositories", detail: "Labels · checks · PRs", kind: "client", col: 3, row: 0 },
        { id: "api", label: "GraphQL API", detail: "Automation state", kind: "api", col: 0, row: 1 },
        { id: "workers", label: "Workers", detail: "TypeScript · Octokit", kind: "worker", col: 2, row: 1 },
        { id: "ghapi", label: "GitHub API", detail: "GraphQL · REST", kind: "api", col: 3, row: 1 },
        { id: "ui", label: "React interface", detail: "Team visibility", kind: "frontend", col: 0, row: 2 },
        { id: "db", label: "Relational DB", detail: "PostgreSQL · MySQL", kind: "database", col: 1, row: 2 },
        { id: "redis", label: "Redis", detail: "Cache · rate limits", kind: "cache", col: 2, row: 2 },
      ],
      edges: [
        { from: "events", to: "receiver", flow: "request", label: "POST" },
        { from: "receiver", to: "queue", flow: "event", label: "enqueue" },
        { from: "queue", to: "workers", flow: "event", label: "dequeue" },
        { from: "workers", to: "ghapi", flow: "request", label: "Octokit" },
        { from: "ghapi", to: "repos", flow: "request", label: "apply" },
        { from: "workers", to: "redis", flow: "data", both: true, label: "budget" },
        { from: "workers", to: "db", flow: "data", route: "hv", label: "state" },
        { from: "api", to: "db", flow: "data", route: "hv", label: "read" },
        { from: "ui", to: "api", flow: "request", label: "GraphQL" },
      ],
      groups: [
        { label: "Ingest", nodes: ["receiver", "queue"] },
        { label: "GitHub", nodes: ["repos", "ghapi"] },
        { label: "Product", nodes: ["api", "ui"] },
        { label: "Storage", nodes: ["db", "redis"] },
      ],
    },
    decisions: [
      "Acknowledge webhooks quickly and do the real work asynchronously.",
      "Make jobs idempotent so retries are always safe.",
      "Coordinate rate-limit budgets centrally in Redis rather than per worker.",
      "Use GraphQL for batched reads and REST where endpoints are simpler.",
    ],
    featured: true,
  },
  {
    id: "codespaces-automation",
    slug: "codespaces-automation",
    title: "GitHub Codespaces Automation",
    company: "GitHub",
    cover: {
      src: codespacesAutomationCover,
      alt: "Illustration of a code editor unfolding from modular blocks next to a stack of server units, with light streaming between them.",
    },
    gallery: [
      {
        src: codespacesBlog,
        alt: "GitHub engineering blog post section titled 5 minutes to 10 seconds, describing prebuilt codespaces.",
        caption: "GitHub’s own write-up of moving its engineers to Codespaces, where prebuilds took setup down to about 10 seconds.",
        source: {
          label: "github.blog",
          url: "https://github.blog/engineering/infrastructure/githubs-engineering-team-moved-codespaces/",
        },
      },
      {
        src: codespacesProduct,
        alt: "The GitHub Codespaces product page, showing a cloud editor running in the browser.",
        caption: "Codespaces: a full editor in the browser, no local setup.",
        source: { label: "github.com/features/codespaces", url: "https://github.com/features/codespaces" },
      },
      {
        src: codespacesPrebuildsDocs,
        alt: "GitHub Docs page titled About GitHub Codespaces prebuilds.",
        caption: "How prebuilds work: the codespace is assembled ahead of time, so creating one skips the slow steps.",
        source: {
          label: "docs.github.com",
          url: "https://docs.github.com/en/codespaces/prebuilding-your-codespaces/about-github-codespaces-prebuilds",
        },
      },
      {
        src: codespacesPrebuildsLaunch,
        alt: "GitHub blog post titled Codespaces for the largest repositories just got faster.",
        caption: "The public launch of prebuilds for all organizations.",
        source: {
          label: "github.blog",
          url: "https://github.blog/news-insights/product-news/codespaces-largest-repositories-faster/",
        },
      },
    ],
    summary:
      "Prebuild workflows that turn long development-environment setup into a near-instant start.",
    description:
      "Work on GitHub Codespaces workflows that prepare cloud development environments ahead of time, using Python, Docker, Kubernetes, GitHub Actions, and cloud infrastructure.",
    problem:
      "Setting up a development environment for a large codebase (cloning, installing dependencies, building) can take a long time before an engineer writes a single line of code.",
    role: "Senior Software Engineer: Codespaces workflows, automation, and infrastructure.",
    challenge:
      "Preparing reproducible environments ahead of time so starting a codespace doesn't wait on setup.",
    challenges: [
      "Keeping prepared environments in sync as the repository changes.",
      "Building development containers reproducibly.",
      "Orchestrating environment preparation on shared cloud infrastructure.",
      "Handling failures in preparation without blocking developers.",
    ],
    solution:
      "Environment preparation moves from start time to change time. GitHub Actions triggers prebuilds, Python tooling drives Docker-based development-container builds, and Kubernetes-backed cloud infrastructure runs them so new codespaces start from a ready state.",
    technologies: ["Python", "Docker", "Kubernetes", "GitHub Actions", "Cloud infrastructure"],
    impact: [
      "Prebuilds helped reduce setup from approximately 45 minutes to around 10 seconds.",
      "Engineers start from a ready environment instead of waiting on setup.",
      "Environment definitions live in code and are rebuilt automatically.",
    ],
    metrics: [{ value: "~45 min → ~10 s", label: "Environment setup with prebuilds" }],
    architecture: {
      nodes: [
        { id: "push", label: "Repository push", detail: "devcontainer.json", kind: "event", col: 0, row: 0 },
        { id: "actions", label: "GitHub Actions", detail: "Prebuild workflow", kind: "infra", col: 1, row: 0 },
        { id: "python", label: "Orchestration", detail: "Python tooling", kind: "service", col: 2, row: 0 },
        { id: "docker", label: "Docker build", detail: "Dev container image", kind: "worker", col: 3, row: 0 },
        { id: "k8s", label: "Kubernetes", detail: "Cloud infrastructure", kind: "infra", col: 2, row: 1 },
        { id: "snapshot", label: "Prebuild snapshot", detail: "Repo, deps, build", kind: "database", col: 3, row: 1 },
        { id: "dev", label: "Developer", detail: "Opens a codespace", kind: "client", col: 0, row: 2 },
        { id: "codespaces", label: "Codespaces", detail: "Create · resume", kind: "api", col: 1, row: 2 },
        { id: "ready", label: "Ready codespace", detail: "Starts in ~10 s", kind: "client", col: 2, row: 2 },
      ],
      edges: [
        { from: "push", to: "actions", flow: "event", label: "trigger" },
        { from: "actions", to: "python", flow: "request", label: "run" },
        { from: "python", to: "docker", flow: "request", label: "build" },
        { from: "docker", to: "snapshot", flow: "data", label: "store" },
        { from: "dev", to: "codespaces", flow: "request", label: "create" },
        { from: "codespaces", to: "k8s", flow: "request", label: "allocate" },
        { from: "snapshot", to: "k8s", flow: "data", label: "attach" },
        { from: "k8s", to: "ready", flow: "request", label: "boot" },
      ],
      groups: [
        { label: "Prebuild pipeline · on every push", nodes: ["push", "actions", "python", "docker"] },
        { label: "Codespace start", nodes: ["codespaces", "k8s", "ready"] },
      ],
    },
    decisions: [
      "Move expensive work from start time to change time.",
      "Treat the development environment as code.",
      "Design for graceful fallback when a prebuild isn't available.",
    ],
    featured: true,
  },
  {
    id: "ai-engineering-assistant",
    slug: "ai-engineering-assistant",
    title: "AI Engineering Assistant",
    company: "GitHub",
    cover: {
      src: aiEngineeringAssistantCover,
      alt: "Illustration of a glowing crystalline sphere drawing in panels of code and streaming a response outward.",
    },
    gallery: [
      {
        src: aiResearchBlog,
        alt: "GitHub blog research post stating developers using GitHub Copilot completed the task 55% faster.",
        caption: "The source of the 55% figure: GitHub’s controlled study of developers with and without Copilot.",
        source: {
          label: "github.blog",
          url: "https://github.blog/news-insights/research/research-quantifying-github-copilots-impact-on-developer-productivity-and-happiness/",
        },
      },
      {
        src: aiCopilotProduct,
        alt: "The GitHub Copilot product page with the headline Command your craft and the Copilot app interface.",
        caption: "GitHub Copilot today.",
        source: { label: "github.com/features/copilot", url: "https://github.com/features/copilot" },
      },
      {
        src: aiCopilotDocs,
        alt: "GitHub Docs page titled About GitHub Copilot, describing how Copilot uses repository context.",
        caption: "Copilot uses repository context, which is what this project was about.",
        source: {
          label: "docs.github.com",
          url: "https://docs.github.com/en/copilot/get-started/what-is-github-copilot",
        },
      },
      {
        src: aiResearchPaper,
        alt: "arXiv paper page: The Impact of AI on Developer Productivity: Evidence from GitHub Copilot.",
        caption: "The research paper behind the study, with the full methodology.",
        source: { label: "arxiv.org", url: "https://arxiv.org/abs/2302.06590" },
      },
    ],
    summary:
      "Copilot-related engineering workflows grounded in repository context, with tool calling, streaming, and automated evaluation.",
    description:
      "GitHub Copilot-related engineering workflows built with Python and LLM APIs. Repository-aware retrieval supplies developer context, tool calling lets the model act on it, streaming keeps responses responsive, and automated evaluation tracks quality.",
    problem:
      "LLMs are only useful to engineers when they have the right repository context, respond quickly, and produce output whose quality can be measured rather than guessed.",
    role: "Senior Software Engineer: AI-powered engineering workflows in Python.",
    challenge:
      "Retrieving relevant repository context within model limits and evaluating output quality automatically.",
    challenges: [
      "Selecting relevant code and context from large repositories.",
      "Fitting that context into model token limits.",
      "Keeping perceived latency low with streaming responses.",
      "Measuring quality with repeatable automated evaluation.",
    ],
    solution:
      "A Python workflow retrieves repository-aware context, assembles prompts, and calls LLM APIs with tool calling. Responses stream back to the developer, and automated evaluation scores outputs so changes can be compared objectively.",
    technologies: [
      "Python",
      "LLM APIs",
      "GitHub Copilot",
      "Repository-aware retrieval",
      "Tool calling",
      "Streaming",
      "Automated evaluation",
    ],
    impact: [
      "Contributed to Copilot-related workflows; GitHub research reported 55% faster task completion with Copilot.",
      "Grounded model responses in real repository context.",
      "Automated evaluation made quality changes measurable.",
    ],
    metrics: [{ value: "55%", label: "Faster task completion reported by GitHub research" }],
    architecture: {
      nodes: [
        { id: "dev", label: "Developer", detail: "Editor · github.com", kind: "client", col: 0, row: 0 },
        { id: "gateway", label: "Assistant API", detail: "Auth · streaming", kind: "api", col: 1, row: 0 },
        { id: "orchestrator", label: "Orchestrator", detail: "Python · prompts", kind: "service", col: 2, row: 0 },
        { id: "llm", label: "LLM API", detail: "Tool calling", kind: "ai", col: 3, row: 0 },
        { id: "eval", label: "Evaluation", detail: "Automated scoring", kind: "observability", col: 0, row: 1 },
        { id: "retrieval", label: "Context retrieval", detail: "Repository-aware", kind: "service", col: 2, row: 1 },
        { id: "tools", label: "Tools", detail: "Functions it can call", kind: "service", col: 3, row: 1 },
        { id: "repo", label: "Repository", detail: "Source of context", kind: "database", col: 2, row: 2 },
      ],
      edges: [
        { from: "dev", to: "gateway", flow: "request", both: true, label: "stream" },
        { from: "gateway", to: "orchestrator", flow: "request", both: true },
        { from: "orchestrator", to: "llm", flow: "request", both: true, label: "prompt" },
        { from: "llm", to: "tools", flow: "request", both: true, label: "call" },
        { from: "orchestrator", to: "retrieval", flow: "data", both: true, label: "context" },
        { from: "retrieval", to: "repo", flow: "data", both: true, label: "search" },
        { from: "eval", to: "gateway", flow: "event", route: "hv", label: "test set" },
      ],
      groups: [
        { label: "Assistant service", nodes: ["gateway", "orchestrator", "retrieval"] },
        { label: "Model", nodes: ["llm", "tools"] },
      ],
    },
    decisions: [
      "Retrieval quality matters more than prompt length.",
      "Stream early so developers see progress immediately.",
      "Run evaluation on every change instead of checking once by hand.",
    ],
    featured: true,
  },
  {
    id: "high-performance-code-viewer",
    slug: "high-performance-code-viewer",
    title: "High-Performance Code Viewer",
    company: "GitHub",
    cover: {
      src: highPerformanceCodeViewerCover,
      alt: "Illustration of a long row of code panels receding into darkness, with only the front panel lit.",
    },
    gallery: [
      {
        src: codeViewBlog,
        alt: "GitHub engineering blog post describing a roughly 18,000-line CODEOWNERS file that took nearly 27 seconds to render.",
        caption: "GitHub’s engineering post on the new Code View, including the 18,000-line file that once took about 27 seconds.",
        source: {
          label: "github.blog",
          url: "https://github.blog/engineering/architecture-optimization/crafting-a-better-faster-code-view/",
        },
      },
      {
        src: codeViewFile,
        alt: "GitHub Code View displaying parser.ts from the TypeScript repository, a 10,701-line file.",
        caption: "Code View today, opening a 10,701-line file from the TypeScript compiler.",
        source: {
          label: "github.com/microsoft/TypeScript",
          url: "https://github.com/microsoft/TypeScript/blob/v5.4.5/src/compiler/parser.ts",
        },
      },
      {
        src: codeViewPullRequest,
        alt: "The Files changed tab of a merged TypeScript pull request, showing a green diff of an Azure Pipelines file.",
        caption: "Pull request review uses the same rendering.",
        source: {
          label: "github.com/microsoft/TypeScript",
          url: "https://github.com/microsoft/TypeScript/pull/57513/files",
        },
      },
      {
        src: codeViewBlame,
        alt: "GitHub blame view for path.ts in the TypeScript repository, with commit ages and messages beside each block of lines.",
        caption: "Blame view, built on the same code viewer, showing the commit for each line.",
        source: {
          label: "github.com/microsoft/TypeScript",
          url: "https://github.com/microsoft/TypeScript/blame/v5.4.5/src/compiler/path.ts",
        },
      },
    ],
    summary:
      "Code View and pull-request experiences that render very large files in under a second.",
    description:
      "GitHub Code View and pull-request experiences built with React and TypeScript, backed by GraphQL and REST APIs, and optimized with client caching, virtualization, and lazy loading.",
    problem:
      "Very large files rendered slowly: an ~18,000-line file took around 27 seconds to display, making navigation and review painful.",
    role: "Senior Software Engineer: frontend architecture and performance.",
    challenge:
      "Rendering tens of thousands of lines while keeping scrolling, selection, and navigation responsive.",
    challenges: [
      "DOM size growing linearly with file length.",
      "Fetching only what's needed from GraphQL and REST APIs.",
      "Preserving behaviors like selection and line linking under virtualization.",
      "Avoiding redundant network requests during navigation.",
    ],
    solution:
      "Virtualized rendering keeps only visible lines in the DOM, lazy loading defers non-critical code and work, and client-side caching reuses GraphQL and REST responses across navigation.",
    technologies: [
      "React",
      "TypeScript",
      "GraphQL",
      "REST",
      "Client caching",
      "Virtualization",
      "Lazy loading",
    ],
    impact: [
      "Rendering an ~18,000-line file improved from around 27 seconds to under 1 second.",
      "Large files and pull requests stay responsive while scrolling.",
      "Cached data makes repeat navigation feel immediate.",
    ],
    metrics: [{ value: "~27 s → <1 s", label: "Rendering an ~18,000-line file" }],
    architecture: {
      nodes: [
        { id: "open", label: "Open a file", detail: "Link, tree, or search", kind: "event", col: 0, row: 0 },
        { id: "app", label: "React app", detail: "Routes · lazy chunks", kind: "frontend", col: 1, row: 0 },
        { id: "viewer", label: "Code viewer", detail: "Virtualized lines", kind: "frontend", col: 2, row: 0 },
        { id: "screen", label: "Visible lines", detail: "Only what's on screen", kind: "client", col: 3, row: 0 },
        { id: "cache", label: "Client cache", detail: "Reused on navigation", kind: "cache", col: 1, row: 1 },
        { id: "lazy", label: "Lazy features", detail: "Loaded when needed", kind: "frontend", col: 2, row: 1 },
        { id: "api", label: "GraphQL / REST", detail: "File and metadata", kind: "api", col: 1, row: 2 },
        { id: "services", label: "Backend services", detail: "Repository data", kind: "service", col: 2, row: 2 },
      ],
      edges: [
        { from: "open", to: "app", flow: "request", label: "route" },
        { from: "app", to: "viewer", flow: "request", label: "render" },
        { from: "viewer", to: "screen", flow: "request", both: true, label: "scroll" },
        { from: "viewer", to: "lazy", flow: "request", label: "on demand" },
        { from: "app", to: "cache", flow: "data", both: true, label: "lookup" },
        { from: "lazy", to: "cache", flow: "data", label: "fetch" },
        { from: "cache", to: "api", flow: "request", label: "on miss" },
        { from: "api", to: "services", flow: "data", both: true, label: "query" },
      ],
      groups: [
        { label: "In the browser", nodes: ["app", "viewer", "screen", "cache", "lazy"] },
        { label: "Server", nodes: ["api", "services"] },
      ],
    },
    decisions: [
      "Render what's visible; defer everything else.",
      "Cache on the client so navigation doesn't re-fetch.",
      "Lazy-load secondary features so the file appears first.",
    ],
    featured: true,
  },
  {
    id: "rails-pull-request-backend",
    slug: "rails-pull-request-backend",
    title: "Rails Backend for Pull Requests",
    company: "GitHub",
    cover: {
      src: railsBackendCover,
      alt: "Illustration of a glowing red ruby on a dark platform, wired to code-review panels and a database stack.",
    },
    gallery: [
      {
        src: railsBlog,
        alt: "GitHub blog post titled Building GitHub with Ruby and Rails, with the GitHub and Rails logos.",
        caption: "GitHub’s own account of its codebase: github.com has been a Ruby on Rails monolith since the beginning.",
        source: {
          label: "github.blog",
          url: "https://github.blog/engineering/architecture-optimization/building-github-with-ruby-and-rails/",
        },
      },
      {
        src: railsGraphqlBlog,
        alt: "GitHub blog post section explaining that GitHub works primarily in Ruby and built its GraphQL schema with graphql-ruby.",
        caption: "The GraphQL API is Ruby too: GitHub implemented the entire schema with graphql-ruby and batched loading with graphql-batch.",
        source: { label: "github.blog", url: "https://github.blog/developer-skills/github/the-github-graphql-api/" },
      },
      {
        src: railsPullRequestFiles,
        alt: "A merged pull request in rails/rails showing a Ruby diff in Active Record’s batches.rb with a review comment.",
        caption: "A pull request page. The diff, the review thread, and the merge status are all served by the Rails app.",
        source: { label: "github.com/rails/rails", url: "https://github.com/rails/rails/pull/52322/files" },
      },
      {
        src: railsSite,
        alt: "The Ruby on Rails homepage with the red Rails logo above a code editor.",
        caption: "Ruby on Rails, the framework underneath github.com.",
        source: { label: "rubyonrails.org", url: "https://rubyonrails.org/" },
      },
    ],
    summary: "The Ruby on Rails side of pull requests, Code View, and repository pages inside the github.com monolith.",
    description:
      "Server-side work in GitHub’s Ruby on Rails monolith behind the pull request, Code View, and repository experiences: Rails controllers and models, the graphql-ruby schema the React front end queries, and the MySQL and Git data underneath.",
    problem:
      "GitHub.com has been a Rails monolith from the start; GitHub’s engineering blog describes nearly two million lines of code and more than 1,000 engineers working in it. Pull request and file pages combine repository metadata, permissions, review state, and Git contents, and they have to stay fast inside that shared codebase.",
    role: "Senior Software Engineer: Ruby on Rails and GraphQL work behind the pull request and Code View front end.",
    challenge: "Serving nested pull request and repository data without a database query for every record.",
    challenges: [
      "Loading deeply nested pull request data without one query per record.",
      "Keeping GraphQL fields shaped around what the React front end renders.",
      "Combining Git file contents and diffs with relational data.",
      "Shipping safely in a codebase that deploys many times a day.",
    ],
    solution:
      "Rails controllers serve the pages, and graphql-ruby types expose pull request and repository data to the React front end and to API clients. Batch loaders gather records in groups, so a nested query costs a handful of SQL round-trips instead of hundreds, while file contents and diffs come from Git storage. Changes go through the monolith’s tests and review like everyone else’s.",
    technologies: ["Ruby", "Ruby on Rails", "GraphQL", "graphql-ruby", "MySQL", "REST"],
    impact: [
      "Supplied the server-side data behind the React Code View and pull request experiences.",
      "Kept nested GraphQL reads batched rather than one query per record.",
      "Worked within the shared monolith’s conventions, tests, and frequent deploys.",
    ],
    metrics: [],
    architecture: {
      nodes: [
        { id: "ui", label: "React front end", detail: "PRs · Code View", kind: "frontend", col: 0, row: 0 },
        { id: "controllers", label: "Rails controllers", detail: "Routes · permissions", kind: "api", col: 1, row: 0 },
        { id: "models", label: "Rails models", detail: "ActiveRecord", kind: "service", col: 2, row: 0 },
        { id: "mysql", label: "MySQL", detail: "Relational data", kind: "database", col: 3, row: 0 },
        { id: "gql", label: "GraphQL API", detail: "graphql-ruby schema", kind: "api", col: 1, row: 1 },
        { id: "loaders", label: "Batch loaders", detail: "No N+1 queries", kind: "service", col: 2, row: 1 },
        { id: "clients", label: "API clients", detail: "Apps · integrations", kind: "client", col: 0, row: 2 },
        { id: "git", label: "Git storage", detail: "File contents · diffs", kind: "database", col: 2, row: 2 },
      ],
      edges: [
        { from: "ui", to: "controllers", flow: "request", label: "page" },
        { from: "ui", to: "gql", flow: "request", label: "query" },
        { from: "clients", to: "gql", flow: "request", route: "hv", label: "API" },
        { from: "controllers", to: "models", flow: "request", label: "load" },
        { from: "gql", to: "loaders", flow: "request", label: "resolve" },
        { from: "models", to: "mysql", flow: "data", both: true, label: "SQL" },
        { from: "loaders", to: "mysql", flow: "data", route: "hv", label: "batched" },
        { from: "loaders", to: "git", flow: "data", both: true, label: "blobs" },
      ],
      groups: [{ label: "Rails monolith", nodes: ["controllers", "models", "gql", "loaders"] }],
    },
    decisions: [
      "Batch data loading in one place instead of in every caller.",
      "Shape the schema around what the front end actually renders.",
      "Keep changes small and reviewable in a monolith that deploys many times a day.",
    ],
    featured: false,
  },
  {
    id: "cloud-commerce-platform",
    slug: "cloud-commerce-platform",
    title: "Cloud Commerce Platform",
    company: "Microsoft",
    cover: {
      src: cloudCommercePlatformCover,
      alt: "Illustration of a floating platform where a cloud feeds services, a database, and a conveyor belt carrying packages.",
    },
    gallery: [
      {
        src: commerceStore,
        alt: "The Microsoft Store deals page on microsoft.com, listing Surface devices with prices.",
        caption: "The Microsoft Store, one of the storefronts that runs on Microsoft’s commerce systems.",
        source: { label: "microsoft.com/store", url: "https://www.microsoft.com/en-us/store/b/home" },
      },
      {
        src: commerceMicrosoft365,
        alt: "The Microsoft 365 plans page comparing Personal, Family, and Premium subscriptions with yearly prices.",
        caption: "Subscriptions like Microsoft 365 flow through the same catalog, checkout, and order lifecycle.",
        source: {
          label: "microsoft.com",
          url: "https://www.microsoft.com/en-us/microsoft-365/buy/compare-all-microsoft-365-products",
        },
      },
      {
        src: commerceAzureFunctions,
        alt: "The Azure Functions product page: execute event-driven serverless code.",
        caption: "Azure Functions handled the asynchronous side of commerce, like notifications and inventory sync.",
        source: { label: "azure.microsoft.com", url: "https://azure.microsoft.com/en-us/products/functions" },
      },
    ],
    summary:
      "Commerce services spanning catalog, carts, checkout, orders, fulfillment, and inventory on Azure.",
    description:
      "Work on the Microsoft Commerce Platform: ASP.NET Core services, REST APIs, and Angular interfaces on Azure covering the commerce lifecycle from product catalog to fulfillment.",
    problem:
      "Commerce workflows span many domains (catalog, accounts, carts, checkout, orders, fulfillment, and inventory), and each must stay consistent through transactions and failures.",
    role: "Software Engineer: backend services, REST APIs, frontend, testing, and observability.",
    challenge:
      "Keeping orders and inventory consistent across services while staying observable in production.",
    challenges: [
      "Transactional consistency across checkout and orders.",
      "Synchronizing inventory across systems.",
      "Running notifications and fulfillment steps asynchronously.",
      "Diagnosing production issues quickly.",
    ],
    solution:
      "ASP.NET Core services with Entity Framework Core and Azure SQL handle transactional workflows. Azure Functions process asynchronous work such as notifications and inventory synchronization, Azure DevOps runs CI/CD, and Application Insights provides observability for troubleshooting.",
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
    impact: [
      "Delivered services across the full commerce lifecycle.",
      "Moved slow side effects off the request path with background functions.",
      "Supported production reliability through automated testing, observability, and troubleshooting.",
    ],
    metrics: [],
    architecture: {
      nodes: [
        { id: "shopper", label: "Shopper", detail: "Store · account", kind: "client", col: 0, row: 0 },
        { id: "storefront", label: "Storefront", detail: "Angular · TypeScript", kind: "frontend", col: 1, row: 0 },
        { id: "rest", label: "REST APIs", detail: "ASP.NET Core", kind: "api", col: 2, row: 0 },
        { id: "insights", label: "App Insights", detail: "Logs · telemetry", kind: "observability", col: 3, row: 0 },
        { id: "notify", label: "Notifications", detail: "Order updates", kind: "event", col: 0, row: 1 },
        { id: "functions", label: "Azure Functions", detail: "Background jobs", kind: "worker", col: 1, row: 1 },
        { id: "domain", label: "Domain services", detail: "C# · EF Core", kind: "service", col: 2, row: 1 },
        { id: "sql", label: "Azure SQL", detail: "Transactions", kind: "database", col: 3, row: 1 },
        { id: "inventory", label: "Inventory sync", detail: "Stock across systems", kind: "service", col: 1, row: 2 },
        { id: "devops", label: "Azure DevOps", detail: "CI/CD · Docker", kind: "infra", col: 3, row: 2 },
      ],
      edges: [
        { from: "shopper", to: "storefront", flow: "request", label: "browse" },
        { from: "storefront", to: "rest", flow: "request", label: "JSON" },
        { from: "rest", to: "insights", flow: "data", label: "logs" },
        { from: "rest", to: "domain", flow: "request", label: "call" },
        { from: "domain", to: "sql", flow: "data", both: true, label: "tx" },
        { from: "domain", to: "functions", flow: "event", label: "events" },
        { from: "functions", to: "notify", flow: "event", label: "notify" },
        { from: "functions", to: "inventory", flow: "event", label: "sync" },
        { from: "devops", to: "domain", flow: "event", route: "hv", label: "deploy" },
      ],
      groups: [
        { label: "Customer-facing", nodes: ["shopper", "storefront"] },
        { label: "ASP.NET Core on Azure", nodes: ["rest", "domain"] },
        { label: "Background work", nodes: ["notify", "functions", "inventory"] },
      ],
    },
    decisions: [
      "Use database transactions where consistency matters most.",
      "Push slow side effects to background functions.",
      "Instrument early so production issues are diagnosable.",
    ],
    featured: false,
  },
  {
    id: "two-factor-prescription-signing",
    slug: "two-factor-prescription-signing",
    title: "Two-Factor Prescription Signing",
    company: "Allscripts",
    cover: {
      src: prescriptionSigningCover,
      alt: "Illustration of a prescription tablet with a glowing signature, linked to a security key and a shield with a keyhole.",
    },
    gallery: [
      {
        src: signingDeaFaq,
        alt: "The DEA Diversion Control Division EPCS Q&A page, answering which two-factor credentials are acceptable.",
        caption: "Why two factors: DEA rules for electronic prescriptions of controlled substances accept two of something you know, something you have, and something you are.",
        source: { label: "deadiversion.usdoj.gov", url: "https://www.deadiversion.usdoj.gov/faq/epcs-faq.html" },
      },
      {
        src: signingEcfr,
        alt: "The eCFR page for 21 CFR 1311.115, Additional requirements for two-factor authentication.",
        caption: "The regulation itself: 21 CFR 1311.115 spells out the two-factor requirement for signing.",
        source: {
          label: "ecfr.gov",
          url: "https://www.ecfr.gov/current/title-21/chapter-II/subchapter-A/part-1311/subpart-C/section-1311.115",
        },
      },
      {
        src: signingVeradigm,
        alt: "The Veradigm ePrescribe page titled ePrescribe, Electronic Prescribing with EPCS.",
        caption: "Allscripts’ e-prescribing product today, now under the Veradigm name, with controlled-substance signing built in.",
        source: { label: "veradigm.com", url: "https://veradigm.com/eprescribe/" },
      },
      {
        src: signingAspNetMfa,
        alt: "The Microsoft Learn article Multi-factor authentication in ASP.NET Core.",
        caption: "The framework side: Microsoft’s guide to multi-factor authentication in ASP.NET Core.",
        source: {
          label: "learn.microsoft.com",
          url: "https://learn.microsoft.com/en-us/aspnet/core/security/authentication/mfa",
        },
      },
    ],
    summary: "A web app that lets clinicians sign prescriptions electronically, confirming who they are with two-factor authentication.",
    description:
      "Built during a 2017 internship with Allscripts’ Shield team, the cloud security platform for authentication and authorization. The app lets clinicians sign prescriptions electronically, with Shield confirming each signature through two-factor authentication. C# and ASP.NET Core on the server, JavaScript in the browser, and SAML for identity.",
    problem:
      "A signature on an electronic prescription has to prove the prescriber really signed it. For controlled substances, DEA rules go further and require two-factor authentication at the moment of signing: two of something you know, something you have, and something you are.",
    role: "Software Development Intern: the signing web app and its integration with the Shield platform.",
    challenge: "Making a second authentication factor part of the signing step without slowing clinicians down.",
    challenges: [
      "Making the two-factor check part of signing itself, separate from login.",
      "Integrating with Shield for authentication and authorization.",
      "Carrying identity between systems with SAML.",
      "Keeping signing quick for clinicians who do it all day.",
    ],
    solution:
      "The clinician reviews a pending prescription in an ASP.NET Core web app and chooses to sign. The signing service asks Shield to verify two factors, their credentials and a second factor, with identity carried over SAML. Only when both check out is the prescription marked signed and recorded.",
    technologies: ["C#", "ASP.NET Core", "JavaScript", "SAML", "Two-factor authentication"],
    impact: [
      "Let clinicians sign prescriptions electronically, with their identity confirmed at the moment of signing.",
      "Built on Shield, so authentication and authorization lived in one shared platform.",
      "Learned how healthcare security rules shape software.",
    ],
    metrics: [],
    architecture: {
      nodes: [
        { id: "clinician", label: "Clinician", detail: "Reviews and signs", kind: "client", col: 0, row: 0 },
        { id: "webapp", label: "Signing web app", detail: "ASP.NET Core · JS", kind: "frontend", col: 1, row: 0 },
        { id: "signing", label: "Signing service", detail: "C#", kind: "service", col: 2, row: 0 },
        { id: "record", label: "Signed record", detail: "Who signed, and when", kind: "database", col: 3, row: 0 },
        { id: "ehr", label: "Clinical system", detail: "Pending prescriptions", kind: "service", col: 0, row: 1 },
        { id: "shield", label: "Shield", detail: "Sign-in · permissions", kind: "api", col: 2, row: 1 },
        { id: "idp", label: "Identity provider", detail: "SAML assertions", kind: "service", col: 3, row: 1 },
        { id: "factor", label: "Second factor", detail: "Held by the clinician", kind: "client", col: 2, row: 2 },
      ],
      edges: [
        { from: "clinician", to: "webapp", flow: "request", label: "sign" },
        { from: "ehr", to: "webapp", flow: "data", route: "hv", label: "Rx" },
        { from: "webapp", to: "signing", flow: "request", label: "POST" },
        { from: "signing", to: "shield", flow: "request", both: true, label: "verify" },
        { from: "shield", to: "idp", flow: "request", both: true, label: "SAML" },
        { from: "shield", to: "factor", flow: "request", both: true, label: "check" },
        { from: "signing", to: "record", flow: "data", label: "save" },
      ],
      groups: [
        { label: "Signing app", nodes: ["webapp", "signing"] },
        { label: "Shield · security platform", nodes: ["shield", "idp", "factor"] },
      ],
    },
    decisions: [
      "Ask for the second factor at the moment of signing, not only at login.",
      "Keep authentication in the shared platform rather than in each app.",
      "Use SAML for identity instead of a custom handshake.",
    ],
    featured: false,
  },
  {
    id: "selenium-test-automation",
    slug: "selenium-test-automation",
    title: "Selenium Test Automation",
    company: "Sageworks",
    cover: {
      src: seleniumTestAutomationCover,
      alt: "Illustration of a stack of test cards wired to a robotic arm pressing a button on a browser window, beside a column of green check marks.",
    },
    gallery: [
      {
        src: seleniumWebDriver,
        alt: "Selenium documentation page titled WebDriver: WebDriver drives a browser natively.",
        caption: "Selenium WebDriver drives a real browser the way a user would.",
        source: { label: "selenium.dev", url: "https://www.selenium.dev/documentation/webdriver/" },
      },
      {
        src: seleniumPageObjects,
        alt: "Selenium documentation showing a Java page object class for a sign-in page.",
        caption: "Selenium’s recommended way to organize reusable test code in Java: one class per page, so a UI change is fixed in one place.",
        source: {
          label: "selenium.dev",
          url: "https://www.selenium.dev/documentation/test_practices/encouraged/page_object_models/",
        },
      },
      {
        src: seleniumWaits,
        alt: "Selenium documentation page titled Waiting Strategies, describing race conditions as a common cause of flaky tests.",
        caption: "Why UI tests break: Selenium’s own guide names timing races as one of the main causes of flaky tests.",
        source: { label: "selenium.dev", url: "https://www.selenium.dev/documentation/webdriver/waits/" },
      },
      {
        src: seleniumAbrigo,
        alt: "Abrigo’s commercial loan origination software page, part of its Sageworks lending software.",
        caption: "Sageworks made lending and credit-risk software for banks. Abrigo sells it now.",
        source: {
          label: "abrigo.com",
          url: "https://www.abrigo.com/software/lending-and-credit-risk/sageworks-lending-software/",
        },
      },
    ],
    summary:
      "Turning manual test cases for Sageworks’ banking software into automated Java and Selenium tests, plus helpers that made the next test easier to write.",
    description:
      "William’s first job: two summers and a spring semester in QA at Sageworks, the Raleigh company behind lending and credit-risk software for banks and credit unions, now part of Abrigo. He converted manual test cases into Selenium WebDriver tests written in Java, repaired tests that had broken, and wrote shared libraries so other people’s automation took less effort.",
    problem:
      "Manual test cases need a person clicking through the same screens before every release. Automated UI tests remove that repetition, but only if they are reliable and cheap to write; otherwise they break and get ignored.",
    role: "Software Quality Assurance Intern: test automation in Java and Selenium.",
    challenge: "Turning written test steps into automated tests that stay reliable as the application changes.",
    challenges: [
      "Translating written manual steps into repeatable automated tests.",
      "Fixing tests that broke when the application changed.",
      "Pages that load at their own pace.",
      "The same setup and locator code copied into every test.",
    ],
    solution:
      "Each manual case became a Java test that drives a real browser through Selenium WebDriver. Common steps moved into a shared helper library, so a UI change is fixed in one place and a new test is mostly calls to existing helpers. Results show which cases pass and which need a closer look.",
    technologies: ["Java", "Selenium", "WebDriver", "Automated testing"],
    impact: [
      "Turned manual test cases into automated tests that run without anyone clicking through.",
      "Brought broken tests back to passing.",
      "Left shared libraries that made the next person’s automation easier.",
    ],
    metrics: [],
    architecture: {
      nodes: [
        { id: "manual", label: "Manual test cases", detail: "Written steps", kind: "event", col: 0, row: 0 },
        { id: "tests", label: "Automated tests", detail: "Java", kind: "service", col: 1, row: 0 },
        { id: "helpers", label: "Shared helpers", detail: "Reusable library", kind: "worker", col: 2, row: 0 },
        { id: "webdriver", label: "Selenium", detail: "WebDriver API", kind: "infra", col: 3, row: 0 },
        { id: "qa", label: "QA team", detail: "Reviews failures", kind: "client", col: 0, row: 1 },
        { id: "results", label: "Test results", detail: "Pass · fail", kind: "observability", col: 1, row: 1 },
        { id: "app", label: "Sageworks web app", detail: "Under test", kind: "frontend", col: 2, row: 1 },
        { id: "browser", label: "Browser", detail: "Real clicks, typing", kind: "client", col: 3, row: 1 },
      ],
      edges: [
        { from: "manual", to: "tests", flow: "event", label: "automate" },
        { from: "tests", to: "helpers", flow: "request", label: "call" },
        { from: "helpers", to: "webdriver", flow: "request", label: "commands" },
        { from: "webdriver", to: "browser", flow: "request", label: "drive" },
        { from: "browser", to: "app", flow: "request", both: true, label: "load" },
        { from: "tests", to: "results", flow: "data", label: "report" },
        { from: "results", to: "qa", flow: "event", label: "failures" },
        { from: "qa", to: "manual", flow: "event", label: "new cases" },
      ],
      groups: [
        { label: "Java test suite", nodes: ["tests", "helpers"] },
        { label: "Under test", nodes: ["app", "browser"] },
      ],
    },
    decisions: [
      "Keep page details in shared helpers, not in every test.",
      "Wait for conditions instead of sleeping for a fixed time.",
      "Fix a test that fails for the wrong reason before writing the next one.",
    ],
    featured: false,
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}
