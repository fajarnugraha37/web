# Execution Checklist & Workflow

## Phase 1: Infrastructure Setup
- [ ] Initialize React Query Provider in `app/layout.tsx`.
- [ ] Install `zustand` and `@tanstack/react-query` (ensure latest versions compatible with React 19).
- [ ] Create `lib/store/` directory for Zustand stores.
- [ ] Create `hooks/queries/` directory for React Query hooks.

## Phase 2: Assets Picker Migration (React Query Pilot)
- [ ] Create `hooks/queries/useAssetsQuery.ts`.
  - [ ] Implement `useAssets` (GET).
  - [ ] Implement `useUploadAsset` (POST) with cache invalidation.
  - [ ] Implement `useDeleteAsset` (DELETE) with cache invalidation.
- [ ] Refactor `components/molecules/AssetsPickerModal.tsx` to remove local fetch logic and use the new hooks.
- [ ] Test upload, delete, and automatic UI updates.

## Phase 3: Markdown Editor Refactoring (The Core)
- [ ] Create `lib/store/useMarkdownDocStore.ts` with `persist` middleware and throttled content updates.
- [ ] Create `lib/store/useMarkdownUIStore.ts`.
- [ ] Create `hooks/queries/useMarkdownQuery.ts` for server sync.
- [ ] Refactor `hooks/useMarkdownEditor.ts` to act merely as a bridge or remove it entirely in favor of direct store access.
- [ ] Refactor `hooks/useMarkdownActions.ts` to use `useMarkdownUIStore` for modal states.
- [ ] Dismantle `MarkdownPlaygroundContent.tsx` into smaller Organisms (`Sidebar`, `Editor`, `Preview`).
- [ ] Wire the UI to the new stores. Test local typing (ensure no lag) and local storage persistence.

## Phase 4: Database Labs (Zustand + Singletons)
- [ ] Create `lib/db/pglite-client.ts` and `lib/db/duckdb-client.ts` to hold WASM singletons.
- [ ] Create `lib/store/useSqlStore.ts` for execution status and separated query histories.
- [ ] Refactor `hooks/use-pglite.ts` and `hooks/use-duckdb.ts` to interact with singletons and update the store.
- [ ] Refactor `SqlTerminalSection.tsx` to read state from the store rather than local state.

## Phase 5: Translation & Media Labs (Throttled Stores)
- [ ] Create `lib/store/useTranslationStore.ts`. Implement custom `addLog` and `updateProgress` functions that throttle updates to React.
- [ ] Refactor `hooks/useTranslationWorker.ts` to dispatch events to the store.
- [ ] Refactor `TranslateLabContent.tsx` to consume the store. Ensure inference errors don't permanently brick the "ready" status.
- [ ] Create `lib/store/useFfmpegStore.ts` and apply similar refactoring to FFmpeg hooks and components.

## Phase 6: Final QA & Verification
- [ ] Run build process (`npm run build` or `bun run build`).
- [ ] Verify 0 TypeScript errors.
- [ ] Conduct manual performance testing (type fast in the Markdown editor, run a heavy SQL query, run a large translation) and check React DevTools for unnecessary re-renders.
