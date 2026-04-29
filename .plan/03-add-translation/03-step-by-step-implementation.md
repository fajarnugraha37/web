# Step-by-Step Implementation Guide

This guide breaks down the implementation into atomic, verifiable phases, suitable for an AI code agent.

## Phase 1: Routing & Scaffolding
1. **Create Route:** Add `/app/labs/translate/page.tsx` and `/app/labs/translate/layout.tsx`.
2. **Metadata:** Set title and description for the new lab.
3. **Navigation Updates:**
   - Update `app/page.tsx` (Laboratory Dashboard).
   - Update `components/organisms/Header.tsx` and `MobileNav.tsx`.
   - Update `components/organisms/Footer.tsx`.
   - Update `app/labs/page.tsx` (if it exists as an index).
4. **Dependencies:** Ensure `@xenova/transformers` is installed (or install it via `bun add @xenova/transformers`).

## Phase 2: Web Worker & Model Logic
1. **Worker File:** Create `public/workers/translate.worker.js` (or in a `workers/` dir that Next.js can serve).
2. **Transformers Setup:**
   - Import `pipeline` and `env`.
   - Set `env.allowLocalModels = false; env.useBrowserCache = true;`.
3. **Message Handler:**
   - Implement `self.addEventListener('message')`.
   - Handle `INIT`: load model, emit progress using the `progress` callback from `pipeline`.
   - Handle `TRANSLATE`: execute translation, handle timeout via `AbortSignal`.
   - Handle `DISPOSE`: clean up resources.

## Phase 3: Hooks & State Management
1. **`useTranslationWorker.ts`:**
   - Instantiate the Web Worker.
   - Manage React state: `isReady`, `progress`, `status` (idle, downloading, ready, error).
   - Expose `translate(text, src, tgt)` function.
   - Implement cleanup in `useEffect` cleanup function.
2. **`useTranslationParams.ts`:**
   - Manage `src` and `tgt` languages via Next.js `useRouter` and `useSearchParams`.

## Phase 4: UI Components (Atoms & Molecules)
Follow Atomic Design principles and ensure **Zero-Logic Render** (purely declarative components). Create these in `components/atoms/` and `components/molecules/`:
1. **`LanguageSelect`:** Dropdown component.
2. **`TranslationProgress`:** Determinate linear progress bar matching the terminal aesthetic.
3. **`TerminalLogViewer`:** Reuse existing or create a new accordion for the debug panel.
4. **`CharacterCounter`:** Atom for input limits with dynamic color coding.

## Phase 5: Organism Assembly & Streaming
1. **`TranslateLabContent.tsx`:** Assemble the molecules.
   - Implement the two-pane layout (Input / Output). Use the existing `useIsMobile` hook from `@/hooks/use-mobile` for DRY responsive layout adjustments (e.g., stacking panes vertically on mobile).
   - Add the Swap button logic.
   - Integrate the `useTranslationWorker` hook. Keep the render function clean of business logic.
2. **Streaming Simulation:**
   - In the Output pane, implement the `setInterval` logic to reveal words sequentially.
   - Add RTL support via dynamic `dir` attribute based on the selected target language.

## Phase 6: Guardrails, Edge Cases & Polish
1. **Memory Guards:** Implement the `navigator.deviceMemory` check on mount.
2. **Error Modals:** Build the "Input Limit Exceeded" confirmation modal.
3. **Offline Checks:** Add `window.addEventListener('offline')` and disable UI if model isn't cached.
4. **Testing & Validation:**
   - Test caching (reload page, should bypass download).
   - Test unmount (navigate away, verify memory drops).
   - Test RTL switching.
