import type { Profile } from "@/types/portfolio";

export const profile: Profile = {
  name: "William Glas",
  title: "Senior Software Engineer",
  headline: "Senior Software Engineer | Node.js, TypeScript, Python & React",
  location: "Raleigh, NC",
  coreStack: ["Node.js", "TypeScript", "Python", "React"],
  tagline:
    "I build tools developers use every day. I work at GitHub now, and before that I was at Microsoft.",
  summary:
    "Senior Software Engineer with 7+ years of experience building full-stack applications, developer platforms, and cloud-native systems at GitHub and Microsoft. Strong in Node.js, TypeScript, Python, React, GraphQL, and REST APIs, with hands-on experience in AI/LLM integration, event-driven systems, Kubernetes, Terraform, CI/CD, automated testing, and production observability across Azure and AWS.",
  about: [
    "I grew up in Raleigh, North Carolina. My first software job was automating test cases at Sageworks the summer I finished high school, and I’ve been writing code for a living ever since. Today I’m a senior engineer at GitHub.",
    "In college I spent my summers interning. At Allscripts I built a prescription signing flow with two-factor authentication, and at Microsoft I worked on the team behind Visual Studio Team Services. I joined Microsoft full-time after finishing my CS degree at NC State, then moved to GitHub in 2020 and was promoted to Senior there.",
    "At GitHub I work on things developers use all day: pull requests, Code View, the in-browser editor, repository automation, Apps and Actions, Codespaces, and Copilot tooling. I work across the stack, from React and TypeScript to Node.js, Python, and the Rails monolith, plus the Docker and Kubernetes setup it all runs on.",
    "I care about accessible interfaces, tests I can trust, systems that recover on their own, and code reviews where someone learns something. I like working on teams that check whether what we shipped actually helped.",
  ],
  stats: [
    { value: "7+", label: "Years shipping production software" },
    { value: "GitHub", label: "Since 2020 · Senior since 2024" },
    { value: "Microsoft", label: "Intern 2018 · Engineer 2019-2020" },
    { value: "NC State", label: "B.S. Computer Science, 2015-2019" },
  ],
  focusAreas: [
    {
      id: "developer-platforms",
      title: "Developer Platforms",
      description:
        "GitHub Apps, Actions integrations, repository automation, and Codespaces.",
    },
    {
      id: "ai-systems",
      title: "AI / LLM Systems",
      description:
        "Copilot workflows that use repository context, with tool calling, streaming, and evaluation.",
    },
    {
      id: "distributed-systems",
      title: "Distributed Systems",
      description:
        "Event-driven services with async jobs, caching, rate limits, and retries.",
    },
    {
      id: "cloud-infrastructure",
      title: "Cloud Infrastructure",
      description:
        "Docker, Kubernetes, Terraform, and CI/CD on Azure and AWS.",
    },
  ],
  principles: [
    {
      id: "tests",
      title: "Tests first",
      description:
        "My first job was writing test automation, and the habit stuck. Good tests let a team change things without worrying about what breaks.",
    },
    {
      id: "accessibility",
      title: "Accessible by default",
      description:
        "Keyboard, screen reader, and reduced-motion support ship with the feature.",
    },
    {
      id: "impact",
      title: "Measure the change",
      description:
        "If we can't tell whether a change helped, we're guessing.",
    },
    {
      id: "people",
      title: "Grow the team",
      description:
        "Mentoring and careful code review make the whole team better.",
    },
  ],
  contact: {
    email: "willglas31@outlook.com",
    phone: "(857) 355-4705",
    linkedin: {
      url: "https://www.linkedin.com/in/will-glas-056a94143",
      display: "linkedin.com/in/will-glas-056a94143",
    },
  },
  resume: {
    href: "/resume",
    label: "Résumé",
  },
  photo: null,
};
