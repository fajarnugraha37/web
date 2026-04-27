# Comprehensive Step-by-Step Refactoring Implementation

This implementation plan exhaustively covers all existing components, hooks, libraries, and pages identified in the `.refactoring/before/` analysis to ensure zero features are left behind during the transition to Atomic Design.

## Phase 1: Setup, Configuration & Global Systems
**Goal:** Establish types, configure Tailwind CSS to absorb custom styles, and verify global setup scripts/files.
1. **Types & Config:**
   - Define global interfaces in `types/` (e.g., `Blog`, `PaginationState`, `DuckDBState`).
   - `app/app.css`: Refactor into Tailwind `@theme` configuration or `tailwind.config.ts`. Map all `--color-*`, radius, and font variables to Tailwind tokens. Replace classes like `.cyber-chamfer` with Tailwind plugins or `@utility`.
   - `lib/utils.ts`: Ensure `cn` utility (using `clsx` and `tailwind-merge`) is ready.
2. **Metadata & Static Assets:**
   - Verify `app/icon.svg`.
   - Keep `app/robots.ts`, `app/sitemap.ts`, `app/feed.xml/route.ts` as-is (data generation).
   - Ensure `scripts/pre-build.ts` correctly pre-generates search indexes and other metadata.

## Phase 2: Atoms Migration
**Goal:** Migrate primitive UI elements to the `components/atoms/` directory. They must have 0% business logic.
- `components/Button.tsx` -> `atoms/Button.tsx` (Verify CVA and `lucide-react` integration).
- `components/Icons.tsx` -> `atoms/Icons.tsx`.
- `components/PageTransition.tsx` -> `atoms/PageTransition.tsx`.
- `components/ScrollProgress.tsx` -> `atoms/ScrollProgress.tsx`.
- `components/ScrollReveal.tsx` -> `atoms/ScrollReveal.tsx`.
- `components/ScrollToTop.tsx` -> `atoms/ScrollToTop.tsx`.
- `components/CodeBlock.tsx` -> `atoms/CodeBlock.tsx`.
- *(New)* Create missing atoms if required (e.g., `atoms/Input.tsx`, `atoms/Badge.tsx`).

## Phase 3: Logic Extraction (Hooks & Libs)
**Goal:** Isolate all business logic, data fetching, and external system management into pure functions or custom hooks.
- **Existing Hooks (Verify strict typing & memoization):**
  - `hooks/use-active-section.ts`
  - `hooks/use-duckdb.ts`
  - `hooks/use-mobile.ts`
  - `hooks/use-pglite.ts`
- **New Hooks (Extracted from UI components):**
  - `hooks/usePagination.ts` (From `BlogList.tsx`)
  - `hooks/useBlogFilter.ts` (From `BlogList.tsx`)
  - `hooks/useSearch.ts` (From `SearchPalette.tsx`)
- **Existing Libs (Verify strict typing):**
  - `lib/graph-utils.ts`
  - `lib/mdx.ts`
  - `lib/pg-seed.ts`

## Phase 4: Molecules Construction
**Goal:** Assemble atoms into reusable UI combinations.
- `components/ExpandableDescriptions.tsx` -> `molecules/ExpandableDescriptions.tsx`.
- `components/ExpandableSummary.tsx` -> `molecules/ExpandableSummary.tsx`.
- `components/MermaidDiagram.tsx` -> `molecules/MermaidDiagram.tsx`.
- `components/MobileNav.tsx` -> `molecules/MobileNav.tsx`.
- `components/TocNav.tsx` -> `molecules/TocNav.tsx`.
- `components/BlogActions.tsx` -> `molecules/BlogActions.tsx`.
- `components/SearchPalette.tsx` -> `molecules/SearchPalette.tsx` (UI overlay only, logic in `useSearch`).
- `components/MDXComponents.tsx` -> `molecules/MDXComponents.tsx` (Mapping Markdown tags to Atomic components).
- **New Molecules (Extracted from Fat Components):**
  - `BlogCard.tsx`, `PaginationControls.tsx`, `TagList.tsx` (from `BlogList.tsx`).
  - `LabNodeCard.tsx` (from `app/page.tsx` hardware nodes).

## Phase 5: Organisms Construction
**Goal:** Build the primary feature sections using Molecules, Atoms, and injected Headless Hooks.
- `components/Footer.tsx` -> `organisms/Footer.tsx`.
- **New Organisms (Extracted from `app/layout.tsx`):**
  - `Header.tsx` (Composes desktop nav, `SearchPalette`, and `MobileNav`).
- **New Organisms (Extracted from `app/page.tsx`):**
  - `HeroSection.tsx`, `TerminalSection.tsx`, `HardwareNodesSection.tsx`, `ParadigmsSection.tsx`.
- **New Organisms (Extracted from `components/BlogList.tsx`):**
  - `BlogListSection.tsx` (Composes Sidebar, BlogGrid, PaginationControls).
- **Lab Organisms:**
  - `components/KnowledgeGraph/KnowledgeGraphCanvas.tsx` -> `organisms/KnowledgeGraphCanvas.tsx`.
  - `components/SqlTerminal/SqlEditor.tsx` & `ResultMatrix.tsx` -> `organisms/SqlTerminal/` (Composed together into a `SqlTerminalSection`).

## Phase 6: Page Assembly (Templates & Routing)
**Goal:** Reassemble the Next.js App Router structure using the newly created Organisms. Ensure these pages act strictly as Server Components handling data passing and JSON-LD SEO metadata.
1. **Root Layout & Home:**
   - `app/layout.tsx` (Refactor to use `organisms/Header` and `organisms/Footer`).
   - `app/not-found.tsx`
   - `app/page.tsx` (Assemble `HeroSection`, `TerminalSection`, etc.).
2. **About & Contacts:**
   - `app/about/page.tsx`
   - `app/contacts/layout.tsx` & `app/contacts/page.tsx`
3. **Blogs:**
   - `app/blogs/page.tsx` (Uses `BlogListSection`)
   - `app/blogs/[slug]/page.tsx` (Uses `MDXComponents`, `TocNav`, `BlogActions`)
4. **Labs Environments:**
   - `app/labs/layout.tsx` & `app/labs/page.tsx`
   - `app/labs/duckdb/layout.tsx` & `app/labs/duckdb/page.tsx`
   - `app/labs/knowledge-graph/layout.tsx` & `app/labs/knowledge-graph/page.tsx`
   - `app/labs/markdown/layout.tsx` & `app/labs/markdown/page.tsx`
   - `app/labs/postgresql/layout.tsx` & `app/labs/postgresql/page.tsx`

## Potential Risks & Mitigations

### 1. Feature Loss / Accidental Simplification
- **Risk:** During the breakdown of large files (e.g., `BlogList`, `DuckDBLab`), interactive features, edge-case UI states, or animations might be lost.
- **Mitigation:** Refer explicitly to the `.refactoring/before/*.md` specs during each file's refactoring. Perform a Feature Retention Audit before replacing the old file.

### 2. Styling Regressions (Backward Compatibility)
- **Risk:** Moving from custom CSS classes to Tailwind utilities might break the highly specific "cyberpunk" aesthetic (neon glows, CRT effects, glitch text).
- **Mitigation:** Extract complex animations (`glitch-anim`) and custom properties into Tailwind Plugins or the base layer. Heavily utilize Tailwind's arbitrary values (e.g., `shadow-[0_0_10px_var(--color-cyber)]`) during migration to maintain exact visual parity.

### 3. Hydration Mismatches & Performance
- **Risk:** Aggressive use of `useMobile` for conditional rendering can cause React hydration errors. Un-memoized complex lists (like DuckDB matrices) can cause UI blocking.
- **Mitigation:** Prefer CSS-based media queries (`md:hidden`, `md:block`) for responsive layouts. Mandate `useMemo` in all new hooks (`useBlogFilter`, `usePagination`). Delay `duckdb-wasm` and `pglite` initialization until client-side mount using `useEffect`.

### 4. Client vs. Server Component Confusion
- **Risk:** Adding `"use client"` too high up the tree (e.g., in `app/layout.tsx` or `app/page.tsx`) ruins Server Component benefits (SEO, initial load speed).
- **Mitigation:** Keep `"use client"` directives strictly at the Molecule or Organism level where state or hooks are invoked. Pages must remain 100% Server Components.
