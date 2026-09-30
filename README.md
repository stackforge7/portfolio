# William Glas: Developer Lab Portfolio

Personal portfolio for William Glas, Senior Software Engineer. Built with Next.js (App Router), React, TypeScript, Tailwind CSS v4, Motion, and GSAP. The interactive 3D Developer Lab (React Three Fiber) is added in later phases; the traditional portfolio is always available.

## Scripts

```bash
npm run dev        # local development
npm run build      # production build
npm run start      # serve the production build
npm run lint       # ESLint
npm run typecheck  # route type generation + tsc
```

`dev` and `build` use webpack because Turbopack's `next/font` loader crashes natively (0xC0000005) on the current Windows development machine. `dev:turbo` / `build:turbo` run Turbopack for environments where it works.

## Configuration

Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_SITE_URL` to the production origin. It drives canonical URLs, Open Graph metadata, `robots.txt`, and `sitemap.xml`.

## Structure

- `app/`: routes, metadata, `robots.ts`, `sitemap.ts`, Open Graph image, case-study pages (`/projects/[slug]`)
- `components/`: `layout/`, `navigation/`, `sections/`, `projects/`, `ui/`, and `lab/` (reserved for the 3D scene)
- `data/`: typed portfolio content (profile, experience, projects, skills, hotspots); swap for a CMS behind the same types
- `types/`: shared content models
- `hooks/`, `lib/`: shared client hooks and utilities
- `public/models/`: optional GLB models (see `lib/assets.ts`); the lab falls back to primitive geometry when absent
