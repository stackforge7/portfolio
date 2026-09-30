"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { Box } from "lucide-react";
import { useExperience } from "@/components/layout/ExperienceProvider";
import { MobileMenu } from "@/components/navigation/MobileMenu";
import { useActiveSection } from "@/components/navigation/useActiveSection";
import { sectionNav } from "@/data/navigation";
import { profile } from "@/data/profile";
import { cn } from "@/lib/cn";

const SECTION_IDS = sectionNav.map((item) => item.id);

export function SiteNav() {
  const { enterLab } = useExperience();
  const active = useActiveSection(SECTION_IDS);
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 48));

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 md:px-6 md:pt-4 print:hidden">
      <motion.nav
        aria-label="Primary"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "mx-auto flex h-14 max-w-6xl items-center justify-between rounded-full border px-4 transition-[background-color,border-color,box-shadow] duration-500 md:px-5",
          scrolled
            ? "border-line bg-canvas/75 shadow-lg shadow-black/30 backdrop-blur-md"
            : "border-transparent bg-transparent",
        )}
      >
        <Link
          href="/#top"
          className="font-mono text-xs font-medium tracking-[0.24em] text-fg transition-colors hover:text-accent-strong"
        >
          {profile.name.toUpperCase()}
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {sectionNav.map((item) => {
            const isActive = active === item.id;
            return (
              <li key={item.id}>
                <Link
                  href={item.href}
                  aria-current={isActive ? "location" : undefined}
                  className={cn(
                    "relative rounded-full px-3.5 py-2 text-sm transition-colors",
                    isActive ? "text-fg" : "text-muted hover:text-fg",
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-active"
                      aria-hidden="true"
                      className="absolute inset-0 -z-10 rounded-full bg-white/[0.06]"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={enterLab}
            className="hidden items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-2 font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-accent-strong transition-colors hover:border-accent/60 hover:bg-accent/15 md:inline-flex"
          >
            <Box className="size-3.5" aria-hidden="true" />
            Studio
          </button>
          <MobileMenu onEnterLab={enterLab} />
        </div>
      </motion.nav>
    </header>
  );
}
