# Codebase Summary

This repository is a Next.js 16 (React 19) application built with Tailwind CSS v4 and Bun. It functions as a personal portfolio and a "laboratory" environment featuring advanced web capabilities.

## PERSONA

- Approach: Systematic, stateless, defensive, and highly skeptical of your own generated code.
- Rule: Never hallucinate CLI commands. If unsure, ask for the --help output from the user.
- Planning: Before writing code, create a comprehensive plan in `plan/iteration-xxxx.md`. Assume the AI agent generating the code is cheap and prone to forgetting context.
- To prevent Context Overwriting and Unintentional Simplification:

  1. READ BEFORE WRITE: You MUST read the entire content of an existing file before modifying it.

  2. FEATURE RETENTION AUDIT: Before overwriting a large file (`write_file`), explicitly list all existing functions/buttons (e.g., Rename, Move, Copy, Delete) in your scratchpad. You MUST guarantee 100% of these features exist in the final output.

  3. NO BLIND OVERWRITES: If a file is large, prefer localized edits. If full overwrite is necessary, verify your generated code against the retention audit checklist.
  
## CODE STYLE & RULES

- MODULARITY & DRY (ANTI-GIANT FILES): STRICTLY avoid writing massive, monolithic files or "God functions."
  - Break down complex UI components and backend logic into small, single-responsibility, reusable modules.
  - Do Not Repeat Yourself (DRY) – extract shared logic into utilities, services, or hooks.
  - *Why this matters:* Giant single files overload the AI's context window, directly causing the "accidental simplification/feature deletion" bugs. If a file is getting too large, refactor it into smaller files immediately.
- NO DIY (Do It Yourself): Avoid custom implementations if a capable, actively maintained 3rd-party library exists. STRICTLY PROHIBITED to use deprecated or unmaintained libraries.
- NO SILENT FAILURES: You must never swallow errors
- STRUCTURED LOGGING: logs must be structured and include relevant context
- UI BOUNDARIES: The Next.js frontend must defensively handle empty states, loading states, and massive payloads (e.g., using virtualized lists or infinite scrolling for large directories).

## Architecture

- **App Router:** Utilizes Next.js App Router for UI routing (`/app`).
- **Static Export:** The application is built for static export to be served via Nginx or GitHub Pages.
- **Tools & Libraries:**
  - `bun.js`
  - `Next.js 16`
  - `React 19`
  - `Tailwind CSS v4`
  - `@electric-sql/pglite` for a WASM PostgreSQL database running in the browser.
  - `@duckdb/duckdb-wasm` for analytical queries directly in the browser.
  - VIM mode and advanced Markdown editing capabilities using `CodeMirror`.
- **Development Environemnt:** Windows and Powershell

## Key Components

- **`/app`**: Main UI and routing layer.
- **`/components`**: Reusable React components.
- **`/content`**: Markdown/MDX blog posts.
- **`/labs`**: Experimental features like the SQL Terminal, Markdown Editor, and DuckDB analytics.
- **`/lib` & `/hooks`**: Core utilities and React hooks.

## Deployment

- CI/CD managed via GitHub Actions (`.github/workflows/deploy.yml`).
- Dockerized deployment supported via `docker-compose.yml` and `nginx.conf`.
- Built artifacts are output to the `/out` directory.
- Built using **Bun**.
- Run `bun install` to install dependencies.
- Run `bun dev` to start the development server.
- Run `bun run build` (which includes `pre-build` scripts for metadata generation) to build the production static export.
