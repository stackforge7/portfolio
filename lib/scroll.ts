/** Smoothly scrolls to a section by id (instantly under reduced motion) and moves focus to it. */
export function scrollToSection(id: string): boolean {
  const target = document.getElementById(id);
  if (!target) return false;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  target.focus({ preventScroll: true });
  window.history.pushState(null, "", `#${id}`);
  return true;
}
