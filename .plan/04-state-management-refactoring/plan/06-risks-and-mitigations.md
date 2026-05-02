# Risks & Mitigations

## 1. WASM Instance Memory Leaks
- **Risk:** Storing heavy WASM instances (PGlite, DuckDB, FFmpeg) incorrectly can cause memory leaks, especially if the component unmounts and remounts, initializing a new instance without destroying the old one.
- **Mitigation:**
  - Enforce the Singleton pattern. Keep instances in `lib/db/*` or use strict `useRef` with cleanup functions in the hooks.
  - NEVER store WASM instances in Zustand.
  - Implement a "Clean Slate Strategy" (already present in FFmpeg, ensure it works with the new store) where input files are deleted immediately after execution to free up WASM Heap before reading outputs.

## 2. React Re-render Thrashing
- **Risk:** High-frequency events (like translation progress, FFmpeg logs, or rapid typing in the markdown editor) updating the global Zustand store can cause the entire application to re-render, tanking performance.
- **Mitigation:**
  - **Selectors:** Use strict selectors when consuming Zustand state in components (e.g., `const logs = useTranslationStore(state => state.logs)` instead of `const store = useTranslationStore()`).
  - **Throttling:** Implement `lodash/throttle` (or custom debounce logic) within the Zustand action dispatchers for high-frequency events.
  - **Transient State:** Exclude rapidly changing arrays (logs, progress) from `zustand/middleware/persist`.

## 3. Hydration Mismatches
- **Risk:** Using `localStorage` for state persistence can cause React hydration errors if the initial server render differs from the client render (because the server doesn't know about `localStorage`).
- **Mitigation:**
  - Use a hydration guard component or standard Zustand pattern (checking a custom `hasHydrated` flag before rendering the persisted UI state).
  - Defer rendering of strictly local state until `useEffect` runs.

## 4. Race Conditions in Data Fetching
- **Risk:** Saving a markdown draft locally while simultaneously fetching from the server could overwrite user input.
- **Mitigation:**
  - Rely on React Query's built-in `isFetching` and `isMutating` flags to disable inputs during critical network boundaries.
  - Prioritize "Local Draft" over "Remote Data" unless a fresh load is explicitly requested by the user.

## 5. UI/Logic Coupling Leakage
- **Risk:** During refactoring, business logic might accidentally slip back into the render function to "save time."
- **Mitigation:**
  - Strictly enforce 0% logic in render. Use custom hooks for all data and mutation logic. If a component needs to calculate a value, do it in a `useMemo` block inside a hook, not in the JSX return statement.
