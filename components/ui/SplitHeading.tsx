"use client";

import { Fragment, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { cn } from "@/lib/cn";

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface SplitHeadingProps {
  text: string;
  as?: "h1" | "h2" | "h3";
  id?: string;
  className?: string;
}

/** Heading whose words rise into view once, the first time it scrolls into the viewport. */
export function SplitHeading({ text, as: Tag = "h2", id, className }: SplitHeadingProps) {
  const ref = useRef<HTMLHeadingElement>(null);
  const words = text.split(" ");

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from("[data-word]", {
          yPercent: 105,
          opacity: 0,
          duration: 0.85,
          ease: "expo.out",
          stagger: 0.06,
          scrollTrigger: { trigger: ref.current, start: "top 88%", once: true },
        });
      });
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} id={id} className={cn("text-balance", className)}>
      {words.map((word, index) => (
        <Fragment key={`${word}-${index}`}>
          <span className="inline-block overflow-hidden pb-[0.1em] -mb-[0.1em] align-bottom">
            <span data-word className="inline-block will-change-transform">
              {word}
            </span>
          </span>
          {index < words.length - 1 && " "}
        </Fragment>
      ))}
    </Tag>
  );
}
