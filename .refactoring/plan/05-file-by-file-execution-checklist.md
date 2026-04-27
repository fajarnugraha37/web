# File-by-File Execution Checklist for AI Agent

**Attention AI Executor:** You are tasked with refactoring this codebase. You MUST follow this checklist meticulously. Check off each file as you complete its refactoring. 

**CRITICAL RULES FOR EXECUTION:**
1. **0% Business Logic in Render:** If you see an `Array.filter`, `Array.map` (for data manipulation), or complex state logic inside a component's return statement or body, you MUST extract it into a hook in the `hooks/` directory.
2. **Type-First:** Write the `interface Props { ... }` before you write the component.
3. **No Inline Styles:** Convert all custom CSS to Tailwind utility classes. Use `className={cn(...)}` for merging.
4. **Feature Retention:** You must read the corresponding `.refactoring/before/*.md` specification before modifying any file below to ensure NO features (animations, modals, interactions) are lost.

---

## 1. Global Setup & Configuration
- [x] `app/app.css` 
  - **Action:** Refactor custom classes (e.g., `.cyber-chamfer`, `.cyber-glitch-text`) into Tailwind plugins, `@theme` variables, or standard utility combinations.
- [x] `lib/utils.ts`
  - **Action:** Ensure the `cn` utility (clsx + tailwind-merge) is correctly implemented and exported.
- [x] `types/index.ts` *(New File)*
  - **Action:** Create this file to hold global interfaces (e.g., `Blog`, `PaginationState`) extracted from various components.

## 2. Atoms (Primitives - 0% Logic)
*Target Directory: `components/atoms/`*
- [x] `components/Button.tsx` 
  - **Action:** Move to `atoms/Button.tsx`. Retain CVA variants.
- [x] `components/Icons.tsx` 
  - **Action:** Move to `atoms/Icons.tsx`. Ensure it wraps `lucide-react`.
- [x] `components/PageTransition.tsx` 
  - **Action:** Move to `atoms/PageTransition.tsx`. Keep `framer-motion` logic.
- [x] `components/ScrollProgress.tsx` 
  - **Action:** Move to `atoms/ScrollProgress.tsx`.
- [x] `components/ScrollReveal.tsx` 
  - **Action:** Move to `atoms/ScrollReveal.tsx`.
- [x] `components/ScrollToTop.tsx` 
  - **Action:** Move to `atoms/ScrollToTop.tsx`.
- [x] `components/CodeBlock.tsx` 
  - **Action:** Move to `atoms/CodeBlock.tsx`.
- [x] `app/icon.svg` 
  - **Action:** Verify it remains in `app/`. No refactoring needed.

## 3. Logic Hooks (Headless Hooks)
*Target Directory: `hooks/`*
- [x] `hooks/use-active-section.ts` -> **Action:** Verify strict typing.
- [x] `hooks/use-duckdb.ts` -> **Action:** Verify strict typing.
- [x] `hooks/use-mobile.ts` -> **Action:** Verify strict typing.
- [x] `hooks/use-pglite.ts` -> **Action:** Verify strict typing.
- [x] `hooks/usePagination.ts` *(New File)*
  - **Action:** Extract pagination logic (first, last, next, prev, slice) from `components/BlogList.tsx`.
- [x] `hooks/useBlogFilter.ts` *(New File)*
  - **Action:** Extract search and tag intersection logic from `components/BlogList.tsx`. Use `useMemo`.
- [x] `hooks/useSearchIndex.ts` *(New File)*
  - **Action:** Extract `MiniSearch` initialization and query logic from `components/SearchPalette.tsx`.

## 4. Molecules (UI Combinations)
*Target Directory: `components/molecules/`*
- [x] `components/ExpandableDescriptions.tsx` -> **Action:** Move to `molecules/`.
- [x] `components/ExpandableSummary.tsx` -> **Action:** Move to `molecules/`.
- [x] `components/MermaidDiagram.tsx` -> **Action:** Move to `molecules/`. (Ensure portal and download logic is clean).
- [x] `components/MobileNav.tsx` -> **Action:** Move to `molecules/`.
- [x] `components/TocNav.tsx` -> **Action:** Move to `molecules/`.
- [x] `components/BlogActions.tsx` -> **Action:** Move to `molecules/`.
- [x] `components/SearchPalette.tsx` 
  - **Action:** Move to `molecules/`. Delegate actual search logic to `useSearchIndex.ts`. Keep only UI overlay/modal logic here.
- [x] `components/MDXComponents.tsx` -> **Action:** Move to `molecules/`.
- [x] `components/BlogCard.tsx` *(New File)*
  - **Action:** Extract the individual blog post card rendering from `components/BlogList.tsx`.
- [x] `components/PaginationControls.tsx` *(New File)*
  - **Action:** Extract the pagination UI (buttons, page numbers) from `components/BlogList.tsx`.
- [x] `components/TagList.tsx` *(New File)*
  - **Action:** Extract the sidebar tag filtering UI from `components/BlogList.tsx`.

## 5. Organisms (Distinct Sections)
*Target Directory: `components/organisms/`*
- [x] `components/Footer.tsx` -> **Action:** Move to `organisms/`.
- [x] `components/Header.tsx` *(New File)*
  - **Action:** Extract the `header` element from `app/layout.tsx`. Compose `MobileNav` and `SearchPalette` inside it.
- [x] `components/HeroSection.tsx`, `components/TerminalSection.tsx`, `components/HardwareNodesSection.tsx`, `components/ParadigmsSection.tsx` *(New Files)*
  - **Action:** Extract these massive sections from `app/page.tsx` into distinct organisms.
- [x] `components/BlogListSection.tsx` *(New File)*
  - **Action:** This replaces `components/BlogList.tsx`. Compose `TagList`, `BlogCard` list, and `PaginationControls` here. Inject `usePagination` and `useBlogFilter` hooks.
- [x] `components/KnowledgeGraph/KnowledgeGraphCanvas.tsx` -> **Action:** Move to `organisms/KnowledgeGraphCanvas.tsx`.
- [x] `components/SqlTerminalSection.tsx` *(New File)*
  - **Action:** Combine `components/SqlTerminal/SqlEditor.tsx` and `components/SqlTerminal/ResultMatrix.tsx` into a single organism.

## 6. Pages & Layouts (Server Components / Data Injectors)
*Target Directory: `app/`*
*Rule: These files must act primarily as data fetchers and layouts. They inject data into Organisms.*
- [x] `app/layout.tsx` -> **Action:** Clean up. Import `organisms/Header` and `organisms/Footer`.
- [x] `app/page.tsx` -> **Action:** Clean up. Import and arrange `HeroSection`, `TerminalSection`, etc.
- [x] `app/about/page.tsx` -> **Action:** Verify it correctly uses `molecules/ExpandableSummary`.
- [x] `app/blogs/page.tsx` -> **Action:** Update to use `organisms/BlogListSection`.
- [x] `app/blogs/[slug]/page.tsx` -> **Action:** Update to use new `molecules/MDXComponents` and `molecules/TocNav`.
- [x] `app/contacts/layout.tsx` & `app/contacts/page.tsx` -> **Action:** Verify layout logic.
- [x] `app/labs/layout.tsx` & `app/labs/page.tsx` -> **Action:** Verify layout logic.
- [x] `app/labs/duckdb/layout.tsx` & `app/labs/duckdb/page.tsx` 
  - **Action:** Refactor `page.tsx` to use the new `organisms/SqlTerminalSection`. Extract massive data ingestion logic into a hook if necessary.
- [x] `app/labs/knowledge-graph/layout.tsx` & `app/labs/knowledge-graph/page.tsx` -> **Action:** Verify layout logic.
- [x] `app/labs/markdown/layout.tsx` & `app/labs/markdown/page.tsx` 
  - **Action:** Refactor `page.tsx`. Ensure Editor and Preview are split cleanly. Extract file management state to a custom hook (`hooks/useMarkdownEditor.ts`).
- [x] `app/labs/postgresql/layout.tsx` & `app/labs/postgresql/page.tsx` 
  - **Action:** Refactor `page.tsx` to use the new `organisms/SqlTerminalSection`.
- [x] `app/not-found.tsx` -> **Action:** Verify layout.

## 7. Scripts & Data (No UI changes)
- [x] `scripts/pre-build.ts`
- [x] `app/robots.ts`
- [x] `app/sitemap.ts`
- [x] `app/feed.xml/route.ts`
- [x] `lib/graph-utils.ts`
- [x] `lib/mdx.ts`
- [x] `lib/pg-seed.ts`

## Final Review Step
Before declaring the refactor complete, the executing AI MUST:
1. [x] Run a build check (`bun run build` or equivalent).
2. [x] Ensure no file remains in the root `components/` directory (everything must be in `atoms/`, `molecules/`, or `organisms/`).
3. [x] Verify all `<button>` and `<input>` elements use the standard `atoms/Button` and standard CSS.