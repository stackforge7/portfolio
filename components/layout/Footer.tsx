import { Mail } from "lucide-react";
import { LinkedInIcon } from "@/components/ui/icons";
import { profile } from "@/data/profile";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line print:hidden">
      <div className="container-page flex flex-col gap-6 py-10 text-sm text-subtle md:flex-row md:items-center md:justify-between">
        <p>
          © {year} {profile.name}. {profile.title}.
        </p>
        <ul className="flex items-center gap-2">
          <li>
            <a
              href={`mailto:${profile.contact.email}`}
              aria-label={`Email ${profile.name}`}
              className="inline-flex size-10 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-line-strong hover:text-fg"
            >
              <Mail className="size-4" aria-hidden="true" />
            </a>
          </li>
          <li>
            <a
              href={profile.contact.linkedin.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${profile.name} on LinkedIn (opens in a new tab)`}
              className="inline-flex size-10 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-line-strong hover:text-fg"
            >
              <LinkedInIcon className="size-4" />
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
