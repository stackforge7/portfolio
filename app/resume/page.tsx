import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ResumeDocument } from "@/components/resume/ResumeDocument";
import { profile } from "@/data/profile";

export const metadata: Metadata = {
  title: "Résumé",
  description: `Résumé of ${profile.name}, ${profile.headline}.`,
  alternates: { canonical: "/resume" },
};

export default function ResumePage() {
  return (
    <div className="container-page pt-28 pb-24 print:max-w-none print:p-0">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 print:hidden">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-mono text-xs tracking-[0.16em] text-muted uppercase transition-colors hover:text-fg"
          >
            <ArrowLeft className="size-3.5" aria-hidden="true" />
            Back to portfolio
          </Link>
        </div>
        <div className="rounded-[1.5rem] bg-[#f7f3ec] p-7 shadow-2xl shadow-black/40 sm:p-10 md:p-14 print:rounded-none print:bg-white print:p-0 print:shadow-none">
          <ResumeDocument headingLevel={1} showPhone />
        </div>
      </div>
    </div>
  );
}
