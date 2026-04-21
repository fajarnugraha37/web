# SYS//OP — Personal Website

> "Documentation is infrastructure. If it's not documented, it's debt."
> The dev who wrote this README instead of shipping features.

A statically exported **Next.js 15** personal website, **Tailwind CSS v4**, and themed like it escaped Night City.

---

## Tech Stack

| Layer | Tech | Why |
|---|---|---|
| Framework | Next.js 15 (static export) | Because you need a framework to render text. Allegedly. |
| Runtime | Bun | Faster than npm. Faster than yarn. (at this time) |
| Styling | Tailwind CSS | Utility-first, Decision-last. |
| Fonts | Orbitron, JetBrains Mono, Share Tech Mono | N/A |
| Animation | Motion | N/A |
| Local Serving | Nginx + Docker | For when `bun dev` is too mainstream |
| CI/CD | GitHub Actions → GitHub Pages | Free hosting. Use it before they paywAll it. |

---

## Prerequisites

Make sure you have these installed:

- **Bun** ≥ 1.1 — <https://bun.sh>
- **Docker** + **Docker Compose** ≥ v2 — <https://docs.docker.com/get-started/get-docker/>
- **Git**
- **Node.js** ≥ 20 *(optional, only if Bun betrays you)*

---

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/fajarnugraha37/web.git
cd web
```

### 2. Install dependencies

```bash
bun install
```

### 3. Start the dev server

```bash
bun run dev
```

Open [http://localhost:3000/web](http://localhost:3000/web).

> **Note:** If you see a 404 error on `/`, don't worry because the root page is in `/web`

---

## Available Scripts

| Command | What It Does |
|---|---|
| `bun run dev` | Starts the dev server |
| `bun run build` | Exports the static site to `./out` |
| `bun run lint` | Runs ESLint |
| `bun run clean` | Nukes the `.next` cache  |

---

## Project Structure

```
(root)/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Global layout: nav, fonts, body wrapper
│   ├── page.tsx            # Home / hero section
│   ├── not-found.tsx       # 404 page (cyberpunk, naturally)
│   ├── about/              # Career & education logs
│   ├── blogs/              # Markdown-powered blog system
│   ├── contacts/           # Contact form (wired to the void)
│   └── globals.css         # Tailwind + custom cyberpunk design tokens
├── components/             # Reusable UI components (Button, BlogList, etc.)
├── content/                # Markdown blog posts (gray-matter parsed)
├── lib/                    # Utilities
├── hooks/                  # Custom React hooks
├── .github/workflows/      # CI/CD pipeline
│   └── deploy.yml          # Build & deploy to GitHub Pages via Bun
├── Dockerfile              # Multi-stage: Bun build → Nginx serve
├── nginx.conf              # Nginx config: serves /web prefix
├── docker-compose.yml      # One command to rule them all
├── next.config.ts          # basePath: '/web', output: 'export'
├── package.json            # Scripts and deps
└── bun.lock                # Lockfile. Don't touch it. Just commit it.
```

---

## Docker — Serving the Static Site with Nginx

The Docker setup builds the static export with Bun and serves it via Nginx on the `/web` path — **identical to the GitHub Pages deployment**.

### Build and run

```bash
docker compose up --build
```

Then open: [http://localhost:3000/web](http://localhost:3000/web)

The first build will take a while because `re2` has a postinstall script that takes roughly the same time as brewing coffee.

### Tear it down

```bash
docker compose down
```

### What's inside the Docker setup

| File | Role |
|---|---|
| `Dockerfile` | Stage 1: Bun installs & builds. Stage 2: Nginx serves `./out` |
| `nginx.conf` | Serves static files under `/web`, redirects `/` → `/web`, gzip + caching |
| `docker-compose.yml` | Exposes port `3000` → Nginx port `80` |
| `.dockerignore` | Keeps `node_modules`, `.next`, `.git` out of the build context |

---

## GitHub Pages Deployment

### How it works

1. GitHub Actions triggers on `push` to `main`
2. `oven-sh/setup-bun@v2` installs Bun
3. `bun install --frozen-lockfile` installs deps (yes, frozen, because discipline)
4. `bun run build` exports the static site to `./out`
5. `actions/upload-pages-artifact` uploads the `./out` directory
6. `actions/deploy-pages` publishes it to GitHub Pages

The site is served at: `https://fajarnugraha37.github.com/web`

### Environment & Config

| Key | Value | Reason |
|---|---|---|
| `basePath` | `/web` | GitHub Pages repo path prefix |
| `output` | `export` | Static export, no server needed |
| `images.unoptimized` | `true` | Required for static export |

---

## Design System

The site runs a Cyberpunk 2077-adjacent dark theme. Here's the color palette:

| Token | Value | Called |
|---|---|---|
| `--color-background` | `#0a0a0f` | The Void |
| `--color-accent` | `#00ff88` | Neon Green |
| `--color-accent-secondary` | `#ff00ff` | Magenta Overdose |
| `--color-accent-tertiary` | `#00d4ff` | Corporate Blue |
| `--color-destructive` | `#ff3366` | Error Red |
| `--color-border` | `#2a2a3a` | Not-quite-black |

Special effects available as CSS utilities:

- `.cyber-chamfer` / `.cyber-chamfer-sm` / `.cyber-chamfer-reverse` — clipped corners
- `.cyber-glitch-text` — RGB-split glitch animation (use with `data-text` attribute)
- `.cyber-grid-bg` — Circuit board grid background
- `.animate-blink` — Terminal cursor blink
- `.glow-btn` / `.glow-btn-secondary` — Neon hover glow
- `.neon-text` — Green text glow

---

## Blog Content

Blog posts live in `content/` as Markdown files with frontmatter:

```markdown
---
title: "Why I Rewrote It In Rust"
date: "2024-09-01"
description: "Performance is a feature. Rewrites are a lifestyle."
tags: ["rust", "performance", "hubris"]
---

Your actual content here...
```

Parsed via `gray-matter` + `next-mdx-remote`. Add a file, commit, push. Done.

---

## Contributing

This is a personal portfolio. Contributing is a strong word.

But if you spot a bug, a typo that makes me look bad, or a dependency that has been CVE'd into oblivion, open an issue.

---

## License

MIT. Do what you want. Just don't use it to build something boring.

---

> *"Boring production. Honest plans. Systems that don't require heroic measures."*
> This portfolio was built with those principles in mind and zero heroics. Mostly.
