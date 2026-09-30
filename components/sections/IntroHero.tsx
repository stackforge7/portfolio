"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ArrowDown, ArrowRight } from "lucide-react";
import { useExperience } from "@/components/layout/ExperienceProvider";
import { BootOverlay } from "@/components/sections/hero/BootOverlay";
import { HeroBackdrop } from "@/components/sections/hero/HeroBackdrop";
import { Button } from "@/components/ui/Button";
import { profile } from "@/data/profile";
import { getProjectBySlug } from "@/data/projects";
import { useLastProject } from "@/lib/studio/preferences";

gsap.registerPlugin(useGSAP);

const BOOT_STORAGE_KEY = "lab-booted";

function markBooted() {
  document.documentElement.dataset.booted = "1";
  try {
    sessionStorage.setItem(BOOT_STORAGE_KEY, "1");
  } catch {
    // Storage can be unavailable (privacy mode); the overlay simply replays next visit.
  }
}

export function IntroHero() {
  const { enterLab, enterLabAt, skipToPortfolio } = useExperience();
  const lastSlug = useLastProject();
  const lastProject = lastSlug ? getProjectBySlug(lastSlug) : undefined;
  const rootRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useGSAP(
    () => {
      if (document.documentElement.dataset.booted) return;

      const heroItems = gsap.utils.toArray<HTMLElement>("[data-hero-item]");
      timelineRef.current = gsap
        .timeline({ defaults: { ease: "expo.out" }, onComplete: markBooted })
        .set(heroItems, { opacity: 0, y: 28 })
        .from("[data-boot-title]", { opacity: 0, y: 6, duration: 0.4 })
        .to("[data-boot-bar]", { scaleX: 1, duration: 1, ease: "power2.inOut" }, "<")
        .from("[data-boot-line]", { opacity: 0, x: -8, duration: 0.3, stagger: 0.2 }, "<0.1")
        .to("[data-boot-check]", { opacity: 1, duration: 0.2, stagger: 0.2 }, "<0.2")
        .to(overlayRef.current, { opacity: 0, duration: 0.45, ease: "power2.out" }, "+=0.05")
        .to(heroItems, { opacity: 1, y: 0, duration: 0.9, stagger: 0.07 }, "<0.1");
    },
    { scope: rootRef },
  );

  const skipBoot = () => timelineRef.current?.progress(1);

  return (
    <div ref={rootRef}>
      <BootOverlay ref={overlayRef} onSkip={skipBoot} />
      <section
        id="top"
        aria-labelledby="hero-heading"
        className="relative isolate flex min-h-svh items-start overflow-hidden pt-28 pb-28 md:pt-32"
      >
        <HeroBackdrop onEnter={enterLab} />

        <div className="container-page">
          <div className="max-w-xl">
            <p
              data-hero-item
              className="inline-flex items-center gap-2 rounded-full border border-line bg-white/[0.02] px-3 py-1.5 font-mono text-[0.6875rem] tracking-[0.14em] text-muted uppercase"
            >
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent/60" />
                <span className="relative inline-flex size-1.5 rounded-full bg-accent" />
              </span>
              GitHub · previously Microsoft
            </p>

            <h1
              id="hero-heading"
              data-hero-item
              className="mt-7 text-6xl leading-[0.9] font-semibold tracking-[-0.04em] text-fg drop-shadow-[0_2px_24px_rgb(0_0_0/0.35)] sm:text-7xl md:text-8xl lg:text-[7.25rem]"
            >
              {profile.name}
            </h1>

            <p data-hero-item className="mt-6 text-xl font-medium text-fg/90 md:text-2xl">
              {profile.title}
            </p>

            <p data-hero-item className="mt-3 font-mono text-sm text-muted">
              {profile.coreStack.map((tech, index) => (
                <span key={tech}>
                  {index > 0 && (
                    <span aria-hidden="true" className="px-2 text-accent">
                      •
                    </span>
                  )}
                  {tech}
                </span>
              ))}
            </p>

            <p data-hero-item className="mt-6 max-w-md text-lg leading-relaxed text-fg/75 text-pretty">
              {profile.tagline}
            </p>

            <div data-hero-item className="mt-9 flex flex-wrap items-center gap-3">
              <Button size="lg" onClick={enterLab}>
                Enter the studio
                <ArrowRight
                  className="size-4 transition-transform duration-300 group-hover/button:translate-x-0.5"
                  aria-hidden="true"
                />
              </Button>
              <Button
                size="lg"
                variant="secondary"
                onClick={skipToPortfolio}
                className="bg-canvas/40 backdrop-blur-md"
              >
                Skip Experience
              </Button>
            </div>

            <button
              type="button"
              data-hero-item
              onClick={() =>
                enterLabAt({ view: "desk", inspector: "projects", param: lastProject?.slug ?? null })
              }
              className="group mt-5 inline-flex items-center gap-2 text-sm text-fg/75 transition-colors hover:text-fg"
            >
              {lastProject ? (
                <>
                  Welcome back. Pick up where you left off
                  <span className="text-fg/50">({lastProject.title})</span>
                </>
              ) : (
                "See what he’s built"
              )}
              <ArrowRight
                className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </button>
          </div>
        </div>

        <div className="container-page absolute inset-x-0 bottom-8 z-20 flex items-center justify-between font-mono text-[0.6875rem] tracking-[0.16em] text-fg/70 uppercase">
          <a
            data-hero-item
            href="#about"
            onClick={(event) => {
              event.preventDefault();
              skipToPortfolio();
            }}
            className="ml-auto inline-flex items-center gap-2 transition-colors hover:text-fg"
          >
            Scroll to portfolio
            <ArrowDown className="size-3.5" aria-hidden="true" />
          </a>
        </div>
      </section>
    </div>
  );
}
