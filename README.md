# SYS//OP: The Personal Website

[![DEPLOY_STATUS](https://img.shields.io/github/actions/workflow/status/fajarnugraha37/fajarnugraha37.github.io/deploy.yml?style=flat-square&color=00ff88&label=UPLINK)](https://github.com/fajarnugraha37/fajarnugraha37.github.io/actions)
[![LICENSE](https://img.shields.io/badge/LICENSE-MIT-00ff88?style=flat-square)](LICENSE)

> "Because you need a multi-layer WASM laboratory just to render a blog post. Allegedly."

A high-tech, low-life portfolio and laboratory environment. Built with the "boring" production stack that definitely isn't boring once you look under the hood. No heroics, just pure engineering.

---

## THE_TECH_STACK

Running on the latest stable firmware:

- **Framework:** [Next.js 16](https://nextjs.org/) (Static Export Mode)
- **Runtime:** [React 19](https://react.dev/) (Concurrent by default)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) (The one with the new engine)
- **Engine:** [Bun](https://bun.sh/) (Fast. Faster than you. Definitely faster than my internet.)
- **Persistence:** `localStorage` Buffers + WASM Database Nodes.
- **Infrastructure:** Docker + Nginx (The old guard) + GitHub Actions.

---

## LABORATORY_NODES

The site isn't just text; it's a series of experimental laboratories:

### 1. SQL_TERMINAL (PostgreSQL WASM)

- Powered by [PGlite](https://pglite.dev/).
- A full PostgreSQL instance running directly in your browser's memory.
- No backend. No cloud. Just pure client-side relational power.

### 2. DATA_ANALYTICS (DuckDB WASM)

- High-performance analytical queries on Parquet datasets.
- Fast enough to make your fans spin (if you have them).
- Visualize data without leaving the DOM.

### 3. MARKDOWN.EXE (The Advanced Editor)

- **VIM_MODE:** Because using a mouse is a failure of imagination.
- **Sync_Scroll:** Keep your source and preview in perfect alignment.
- **GitHub_Alerts:** Full support for `[!NOTE]`, `[!TIP]`, and more.
- **Exporters:** Static HTML and PDF Report generation integrated.
- **Security:** DOMPurify sanitization. High-fidelity, zero-trust.

### 4. MEDIA PROCESSOR.EXE (FFmpeg WASM)

- High-performance client-side media transcoding and signal processing.
- Features Video to GIF generation with 2-pass palette optimization.
- Audio extraction, video compression, and fast-seeking segment trimming.
- Fully multithreaded operations running entirely in the browser. Zero server uploads.

### 5. TRANSLATION NODE.EXE (ONNX Runtime / Transformers)

- Client-side NLLB-200 machine translation.
- Zero-server inference running securely in the browser.
- Supports multiple languages: English, Indonesian, Chinese (Simplified), Spanish, Arabic, Malay, Japanese, Korean, German, Dutch, Russian.
- Dynamic environment-based model loading (local filesystem in dev, CDN in production) to save bandwidth.

---

## SYSTEM_STRUCTURE

Adheres to strict **Atomic Design** principles for UI scalability:

```bash
/app          # The Routing Matrix (App Router 16)
/components   # Modular Hardware
  /atoms      # Primitives (Button, Toast, AnimatedNumber)
  /molecules  # Functional Blocks (BlogCard, Search, Tabs)
  /organisms  # Orchestrated Sections (Header, Hero, LabContent)
/content      # Encrypted Archives (MDX Blogs)
/hooks        # Headless Logic (useMarkdown, useTerminal, useFFmpegCore)
/labs         # Experimental Chambers (SQL, MD, DuckDB, FFmpeg)
/lib          # Core Utilities & Static Data
/public       # Static Assets, Datasets & Web Workers (coi-serviceworker)
/types        # Global API Contracts (Strongly Typed)
```

---

## LOCAL_UPLINK

### Prerequisites

- [Bun](https://bun.sh/) (Required. Node is legacy now.)
- A terminal with a dark background.

### 1. Initialize_System

```bash
bun install
```

### 2. Boot_Environment

```bash
bun dev
```

### 3. Build_Production_Artifacts

```bash
bun run pre-build
bun run build
```

*Note: `pre-build` generates search indices and metadata. Don't skip it. The system will know.*

---

## DEPLOYMENT_PROTOCOLS

The system auto-deploys via GitHub Actions to Pages upon every push to `main`.

**GitHub Pages & WASM Multithreading (The COOP/COEP):**
GitHub Pages does not natively support setting custom `Cross-Origin-Opener-Policy` (COOP) and `Cross-Origin-Embedder-Policy` (COEP) HTTP headers. These headers are strictly required by browsers to enable `SharedArrayBuffer`, which FFmpeg-WASM needs for multithreading.
To bypass this limitation, this project uses the [coi-serviceworker](https://github.com/gzuidhof/coi-serviceworker) library. A local service worker (`public/coi-serviceworker.js`) intercepts the initial page load and injects the necessary security headers into the browser's response, allowing full multithreading capabilities on a static host.

**The Docker Routine:**

```bash
docker-compose up --build
```

Standard Nginx config provided. Static files served at port 80. Simple. Boring. Production-ready.

---

## LICENSE

[MIT](LICENSE). Take it. Fork it. Break it. Just don't blame me when you realize rewrites are a lifestyle.

---

> // EOF_TRANSMISSION
> // SYS//OP v0.1.0-STABLE
