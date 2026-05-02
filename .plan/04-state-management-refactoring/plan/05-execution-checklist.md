# Execution Checklist & Workflow

## Phase 1: Infrastructure Setup
- [x] Initialize React Query Provider in `app/layout.tsx`.
- [x] Install `zustand` and `@tanstack/react-query`.
- [x] Create `lib/store/` directory for Zustand stores.
- [x] Create `hooks/queries/` directory for React Query hooks.

## Phase 2: Assets Picker Migration (React Query Pilot)
- [x] Create `hooks/queries/useAssetsQuery.ts`.
  - [x] Implement `useAssets` (GET).
  - [x] Implement `useUploadAsset` (POST) with cache invalidation.
  - [x] Implement `useDeleteAsset` (DELETE) with cache invalidation.
- [x] Refactor `components/molecules/AssetsPickerModal.tsx` to remove local fetch logic and use the new hooks.
- [x] Test upload, delete, and automatic UI updates.

## Phase 3: Markdown Editor Refactoring (The Core)
- [x] Create `lib/store/useMarkdownDocStore.ts` with `persist` middleware and throttled content updates.
- [x] Create `lib/store/useMarkdownUIStore.ts`.
- [x] Create `hooks/queries/useMarkdownQuery.ts` for server sync.
- [x] Refactor `hooks/useMarkdownEditor.ts` to act merely as a bridge or remove it entirely in favor of direct store access.
- [x] Refactor `hooks/useMarkdownActions.ts` to use `useMarkdownUIStore` for modal states.
- [x] Wired `MarkdownPlaygroundContent.tsx` to new stores.
- [x] Dismantle `MarkdownPlaygroundContent.tsx` into smaller Organisms (`Sidebar`, `Editor`, `Preview`).
- [x] Test local typing (ensure no lag) and local storage persistence.

## Phase 4: Database Labs (Zustand + Singletons)
- [x] Create `lib/db/pglite-client.ts` and `lib/db/duckdb-client.ts` to hold WASM singletons.
- [x] Create `lib/store/useSqlStore.ts` for execution status and separated query histories.
- [x] Refactor `hooks/use-pglite.ts` and `hooks/use-duckdb.ts` to interact with singletons and update the store.
- [x] Refactor `SqlTerminalSection.tsx` and `SqlEditor.tsx` to read state from the store rather than local state.

## Phase 5: Translation & Media Labs (Throttled Stores)
- [x] Create `lib/store/useTranslationStore.ts`. Implement custom `addLog` and `updateProgress` functions that throttle updates to React.
- [x] Refactor `hooks/useTranslationWorker.ts` to dispatch events to the store.
- [x] Refactor `TranslateLabContent.tsx` to consume the store.
- [x] Create `lib/store/useFfmpegStore.ts`.
- [x] Refactor `hooks/useFFmpegCore.ts`.
- [x] Refactor `hooks/useFFmpegLabActions.ts`.
- [x] Refactor `FFmpegLabContent.tsx` to consume the store.

## Phase 6: Final QA & Verification
- [x] Conduct architecture audit (`fetch`, `useEffect`, `useState` usage).
- [x] Clean up "Outside Project" fetches (self-hosting WASM assets).
- [ ] Run build process (`npm run build` or `bun run build`).
- [ ] Verify 0 TypeScript errors.
- [ ] Conduct manual performance testing.
