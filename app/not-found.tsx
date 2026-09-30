import type { Metadata } from "next";
import Link from "next/link";
import { buttonStyles } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <section className="container-page flex min-h-[80svh] flex-col items-start justify-center pt-24">
      <p className="eyebrow">Error 404</p>
      <h1 className="mt-5 text-5xl font-semibold tracking-tight text-fg md:text-7xl">
        This path isn&apos;t in the lab.
      </h1>
      <p className="mt-6 max-w-lg text-lg text-muted">
        The page you&apos;re looking for doesn&apos;t exist or has moved.
      </p>
      <Link href="/" className={cn(buttonStyles({ size: "lg" }), "mt-10")}>
        Back to portfolio
      </Link>
    </section>
  );
}
