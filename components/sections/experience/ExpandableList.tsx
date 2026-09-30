"use client";

import { Children, useId, useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

interface ExpandableListProps {
  children: ReactNode;
  initialCount?: number;
  className?: string;
}

/** Shows the first `initialCount` items; the rest stay in the DOM (for SEO) behind a toggle. */
export function ExpandableList({ children, initialCount = 3, className }: ExpandableListProps) {
  const [expanded, setExpanded] = useState(false);
  const listId = useId();
  const items = Children.toArray(children);
  const hiddenCount = items.length - initialCount;

  return (
    <div>
      <ul id={listId} className={className}>
        {items.map((item, index) => (
          <li key={index} hidden={!expanded && index >= initialCount}>
            {item}
          </li>
        ))}
      </ul>
      {hiddenCount > 0 && (
        <button
          type="button"
          aria-expanded={expanded}
          aria-controls={listId}
          onClick={() => setExpanded((value) => !value)}
          className="mt-5 inline-flex items-center gap-2 font-mono text-[0.6875rem] tracking-[0.16em] text-accent uppercase transition-colors hover:text-accent-strong"
        >
          {expanded ? "Show less" : `Show ${hiddenCount} more`}
          <ChevronDown
            className={cn("size-3.5 transition-transform duration-300", expanded && "rotate-180")}
            aria-hidden="true"
          />
        </button>
      )}
    </div>
  );
}
