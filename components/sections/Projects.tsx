import { Section } from "@/components/layout/Section";
import { ProjectsGallery } from "@/components/projects/ProjectsGallery";
import { projects } from "@/data/projects";

const orderedProjects = [...projects].sort((a, b) => Number(b.featured) - Number(a.featured));

export function Projects() {
  return (
    <Section
      id="projects"
      index="03"
      eyebrow="Projects"
      title="Things I’ve built."
      intro="Work from GitHub and Microsoft, plus my internships at Allscripts and Sageworks. Pick a skill to see where I used it."
    >
      <ProjectsGallery projects={orderedProjects} />
    </Section>
  );
}
