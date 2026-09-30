"use client";

import { useEffect } from "react";
import { RotateCcw } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/Button";

export default function Error({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="container-page flex min-h-[80svh] flex-col items-start justify-center pt-24">
      <p className="eyebrow">Unexpected error</p>
      <h1 className="mt-5 text-4xl font-semibold tracking-tight text-fg md:text-6xl">
        Something went wrong.
      </h1>
      <p className="mt-6 max-w-lg text-lg text-muted">
        This section failed to render. Try again, or head back to the portfolio.
      </p>
      <div className="mt-10 flex flex-wrap gap-3">
        <Button size="lg" onClick={() => retry()}>
          <RotateCcw className="size-4" aria-hidden="true" />
          Try again
        </Button>
        <ButtonLink href="/" size="lg" variant="secondary">
          Back to portfolio
        </ButtonLink>
      </div>
    </section>
  );
}
