# Plan: State Management & React Query Refactoring

## 1. Objective
Migrate dispersed component-level state and complex logic hooks into a structured, highly performant architecture using **Zustand** (for client-side state) and **React Query** (for asynchronous server/API state).

## 2. Architectural Decisions & Scope

### 2.1. Markdown Editor Workspace
- **Action:** Split the massive `useMarkdownEditor` hook into two focused Zustand stores.
- **Store 1: `useMarkdownDocStore`**
  - Manages `files`, `activeFileId`, `activeContent`.
  - Uses `persist` middleware (to `localStorage`).
  - Implements **throttling/debouncing** before writing to `localStorage` to prevent UI jitter during typing.
- **Store 2: `useMarkdownUIStore`**
  - Manages transient UI states: `viewMode`, `showToc`, `isFullScreen`, and modal toggles (`searchModalOpen`, `assetsModalOpen`, etc.).
  - Excluded from `localStorage` persistence.
- **Data Fetch/Sync:** 
  - Uses React Query `useMutation` for the "Save Post" action to `/api/labs/markdown`.
  - Uses React Query `useQuery` to fetch existing posts and hydrate them into the `useMarkdownDocStore`.

### 2.2. Database Laboratories (PGlite & DuckDB)
- **Action:** Refactor `use-pglite`, `usePgliteActions`, `use-duckdb`, and `useDuckDbActions`.
- **WASM Instance Management:** 
  - Complex objects like `PGlite` or `AsyncDuckDB` instances will **NOT** be stored in Zustand to prevent serialization errors. They will be managed via module-level refs/singletons within custom hooks.
- **Store: `useSqlStore` / `useDuckDbStore`**
  - Store serializable UI state: `status` (initializing, ready, executing, error), `lastError`.
  - **Query History:** Implement strictly separated histories (`pgQueryHistory` vs `duckDbQueryHistory`) stored via Zustand's `persist` middleware.

### 2.3. Translation Lab (Web Worker Pipeline)
- **Action:** Centralize the highly complex web worker state currently in `useTranslationWorker`.
- **Store: `useTranslationStore`**
  - Manages translation params (source/target langs) and overall engine status.
- **Performance & Resilience:**
  - **Throttling:** Implementation of throttled state updates for high-frequency `progressItems` and `logs` coming from the web worker.
  - **No Persistence for Streams:** Logs and progress status will be explicitly excluded from `localStorage` to prevent memory bloat.
  - **Error Resilience:** Differentiation between "Fatal Initialization Errors" (which lock the UI) and "Inference Errors" (which only reject the specific translation promise and revert the engine status back to `ready` so the UI remains usable).

### 2.4. Media Laboratory (FFmpeg)
- **Action:** Refactor `useFFmpegCore` and `useFFmpegLabActions`.
- **Store: `useFfmpegStore`**
  - Consolidates settings (`resolution`, `preset`, `mode`, `trimStart`, `gifQuality`).
  - Manages execution status and logs.
- **Instance Management:** Like the database labs, the actual `FFmpeg` instance remains out of Zustand.

### 2.5. Asset Management Modal
- **Action:** Fully migrate asset fetching and mutations in `AssetsPickerModal` to **React Query**.
- **Implementation:**
  - `useQuery` for fetching `['assets']`.
  - `useMutation` for upload and delete operations.
  - Utilize `queryClient.invalidateQueries({ queryKey: ['assets'] })` on success to automatically refresh the list, eliminating the need for local state array management.

## 3. Phased Implementation Plan

1.  **Phase 1: React Query Setup & Assets Modal**
    - Install/Setup React Query Provider.
    - Refactor `AssetsPickerModal` and related API interactions.
2.  **Phase 2: Markdown Editor Refactoring**
    - Create `useMarkdownDocStore` and `useMarkdownUIStore`.
    - Rewire `MarkdownPlaygroundContent` and its child molecules.
    - Integrate React Query for saving/fetching markdown files.
3.  **Phase 3: Database Labs Refactoring**
    - Create Zustand stores for Postgres and DuckDB.
    - Implement separated, persistent query histories.
4.  **Phase 4: Translation Lab Refactoring**
    - Create `useTranslationStore`.
    - Implement robust error handling and throttled log updates.
5.  **Phase 5: FFmpeg Lab Refactoring & Cleanup**
    - Create `useFfmpegStore`.
    - Final QA across all modules to ensure no performance regressions.

## 4. Verification
- Verify that typing in the Markdown editor is smooth (throttled save).
- Verify that terminal history persists on refresh and is isolated between PG and DuckDB.
- Verify that an error during translation does not permanently lock the Translate button.
- Verify that uploading/deleting an asset instantly reflects in the UI via React Query invalidation.