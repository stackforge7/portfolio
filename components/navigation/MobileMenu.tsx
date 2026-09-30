"use client";

import { useState, type MouseEvent } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Box, Menu, X } from "lucide-react";
import { Dialog } from "@/components/ui/Dialog";
import { sectionNav } from "@/data/navigation";
import { profile } from "@/data/profile";
import { scrollToSection } from "@/lib/scroll";

const TITLE_ID = "mobile-menu-title";

export function MobileMenu({ onEnterLab }: { onEnterLab: () => void }) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  function handleNavigate(event: MouseEvent<HTMLAnchorElement>, id: string) {
    if (!document.getElementById(id)) {
      close();
      return;
    }
    event.preventDefault();
    close();
    requestAnimationFrame(() => scrollToSection(id));
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        aria-expanded={open}
        aria-haspopup="dialog"
        className="inline-flex size-10 items-center justify-center rounded-full border border-line text-fg transition-colors hover:border-line-strong md:hidden"
      >
        <Menu className="size-4" aria-hidden="true" />
      </button>

      <Dialog open={open} onClose={close} labelledBy={TITLE_ID} variant="sheet" className="bg-canvas">
        <div className="container-page flex h-full flex-col pt-6 pb-10">
          <div className="flex items-center justify-between">
            <p id={TITLE_ID} className="font-mono text-xs tracking-[0.24em] text-fg">
              {profile.name.toUpperCase()}
            </p>
            <button
              type="button"
              onClick={close}
              aria-label="Close menu"
              data-autofocus
              className="inline-flex size-10 items-center justify-center rounded-full border border-line text-fg"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          </div>

          <nav aria-label="Mobile" className="mt-14 flex-1">
            <ul className="space-y-1">
              {sectionNav.map((item, index) => (
                <motion.li
                  key={item.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + index * 0.04, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    href={item.href}
                    onClick={(event) => handleNavigate(event, item.id)}
                    className="flex items-baseline gap-4 py-3 text-3xl font-semibold tracking-tight text-fg"
                  >
                    <span className="font-mono text-xs text-subtle">0{index + 1}</span>
                    {item.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </nav>

          <button
            type="button"
            onClick={() => {
              close();
              onEnterLab();
            }}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-accent/30 bg-accent/10 font-mono text-xs uppercase tracking-[0.16em] text-accent-strong"
          >
            <Box className="size-4" aria-hidden="true" />
            Enter the studio
          </button>
        </div>
      </Dialog>
    </>
  );
}
