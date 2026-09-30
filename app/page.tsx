import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Experience } from "@/components/sections/Experience";
import { IntroHero } from "@/components/sections/IntroHero";
import { Projects } from "@/components/sections/Projects";

export default function HomePage() {
  return (
    <>
      <IntroHero />
      <About />
      <Experience />
      <Projects />
      <Contact />
    </>
  );
}
