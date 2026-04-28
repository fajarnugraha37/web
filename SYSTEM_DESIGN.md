# System Design: Cyberpunk Portfolio & Laboratory

## 1. Architectural Vision
The application is built as a high-performance, statically exported Next.js 16 (React 19) environment. It prioritizes a deep "Cyberpunk 2077" aesthetic while maintaining strict engineering standards through Atomic Design and Headless Logic patterns.

### Key Mandates
- **Atomic Design:** Strict hierarchy; components must reside in `atoms/`, `molecules/`, or `organisms/`.
- **Headless Logic:** 100% of business and data logic must reside in custom hooks.
- **Zero-Logic Render:** Component render functions are purely declarative.
- **Data Integrity:** Professional strings (XTREMAX, GovTech, etc.) must remain literally identical to source data.

---

## 2. Component Architecture (Atomic Design)

### Atoms (`components/atoms/`)
Smallest, indivisible building blocks. Stateless and visual-only.
- **Button:** Polymorphic button with "Glitch" and "Cyber" variants.
- **AnimatedNumber:** High-intensity roulette effect with system load simulation and terminal "Success" states.
- **Icons:** Standardized `lucide-react` wrappers.
- **Toast:** Neon-themed notifications with state-driven positioning.
- **ScrollReveal/Progress:** Global interaction feedback.

### Molecules (`components/molecules/`)
Functional groups of atoms. Minimal internal UI state.
- **BlogCard:** Themed preview with metadata and hover glitch effects.
- **SearchPalette:** Keyboard-accessible command palette.
- **ExpandableSummary:** Uses `motion/react` for smooth height transitions.
- **SqlEditor:** Monaco-based editor with terminal styling.
- **MermaidDiagram:** Themed rendering with clipboard integration.

### Organisms (`components/organisms/`)
Complex UI sections orchestrating molecules and atoms.
- **Header:** Manages global navigation, Search, and MobileNav with a shared backdrop portal.
- **HomeContent:** Client-side orchestrator for the global "Boot-up" sequence.
- **HeroSection:** High-impact entrance with synchronized theme transitions.
- **SqlTerminalSection:** Interactive laboratory node for browser-side SQL exploration.

---

## 3. Styling & Aesthetic (Cyberpunk 2077)

### Design Tokens
Utilizes Tailwind CSS v4 with custom `@theme` tokens:
- **Colors:** `accent` (Neon Green), `accent-secondary` (Magenta), `accent-tertiary` (Yellow/Orange).
- **Effects:** `.cyber-chamfer` (angled corners), `.cyber-glitch-text` (RGB split animation), `.cyber-grid-bg` (retro-digital background).

### Modular CSS Strategy
To maintain a lean payload and high maintainability, the styling is decoupled into:
- **`app.css`**: Core Tailwind directives, base reset, and global utility classes.
- **`themes.css`**: Centralized theme overrides (`theme-sunset`, `theme-morning`) and dynamic color tokens.
- **`markdown.css`**: Specialized engine for MDX/Technical content rendering (prose, code blocks, alerts).

### Dynamic Theme Orchestration
- **Boot-up Sequence:** The application starts in `theme-sunset` (Orange/Magenta) and transitions to "Operational" (Neon Green) upon reaching 100% load readiness in the `HeroSection`.
- **Background Liberation:** `RootLayout` allows backgrounds to bleed full-width by removing `max-width` constraints from the `main` tag, delegating content centering to individual organisms.

---

## 4. Logic & State Management

### Headless Hooks
Extracted logic layer to ensure UI components remain clean:
- `useIsMobile`: Centralized breakpoint detection.
- `useBlogFilter`: Complex intersection logic for tags and search.
- `useMarkdownEditor` & `useMarkdownActions`: Orchestrates real-time editor speed, VIM mode, and multi-format exports.
- `useTerminal` & `usePgliteActions` / `useDuckDbActions`: Handles system terminal simulation and WASM database operations.
- `useFFmpegCore` & `useFFmpegLabActions`: Manages multithreaded FFmpeg WASM lifecycle, memory-safe file operations (Clean Slate Strategy), and dynamic media processing logic.

### Data Flow
- **Server-Side:** Pages (`app/**/page.tsx`) fetch MDX data and prepare SEO/JSON-LD.
- **Client-Side:** Data is injected into Organisms. Heavy computation (SQL/Analytics/Transcoding) is performed in WASM-based local nodes (PGlite, DuckDB, FFmpeg-MT).

---

## 5. UI Stability & Interactions

### Portals & Overlays
- **Parent Prop Method:** Centralized backdrop control in `Header.tsx` ensures reliable click-outside detection for mobile navigation.
- **React Portals:** Used for floating context menus (e.g., Markdown Lab) to prevent overflow clipping by parent containers.

### Performance & Memory Management
- **0% Logic in Render:** Prevents expensive calculations during UI updates.
- **SSG-Safe Animations:** `AnimatedNumber` and `PageTransition` use hydration checks to prevent mismatch errors.
- **DRY Breakpoints:** No redundant resize observers; all mobile logic uses a single source of truth.
- **WASM Clean Slate Strategy:** Input files are deleted from virtual memory immediately after FFmpeg execution, before output reading, to prevent Out-Of-Memory (OOM) crashes during heavy transcoding.
- **Dynamic Multithreading:** FFmpeg node dynamically scales worker threads based on `navigator.hardwareConcurrency` to maximize processing speed without starving the main thread. Cross-Origin Isolation is maintained via a local `coi-serviceworker`.
