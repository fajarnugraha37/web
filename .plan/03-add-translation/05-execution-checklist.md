# File-by-File Execution Checklist

## Phase 1: Routing & Scaffolding
- [x] Install `@xenova/transformers`
- [x] Create `/app/labs/translate/layout.tsx`
- [x] Create `/app/labs/translate/page.tsx`
- [x] Update `components/organisms/HardwareNodesSection.tsx` (Add Translation Node)
- [x] Update `components/organisms/Header.tsx` (Navbar)
- [x] Update `components/molecules/MobileNav.tsx` (Mobile Navbar)
- [x] Update `components/organisms/Footer.tsx` (Footer)

## Phase 2: Web Worker & Model Logic
- [x] Create `lib/workers/translate.worker.ts`
- [x] Implement conditional environment logic for local models vs CDN
- [x] Create `scripts/download-models.ts` for local DEV caching

## Phase 3: Hooks & State Management
- [x] Create `hooks/useTranslationWorker.ts`
- [x] Create `hooks/useTranslationParams.ts` (with auto-swap prevention)

## Phase 4: UI Components (Atoms & Molecules)
- [x] Create `components/atoms/CharacterCounter.tsx`
- [x] Create `components/atoms/TranslationProgress.tsx` (multi-file concurrent support)
- [x] Create `components/molecules/LanguageSelect.tsx`
- [x] Update/Create `components/molecules/TerminalLogViewer.tsx`

## Phase 5: Organism Assembly & Streaming
- [x] Create `components/organisms/TranslateLabContent.tsx`
- [x] Implement auto-init and real-time translating state (Loader spinner)

## Phase 6: Guardrails, Edge Cases & Polish
- [x] Implement memory guards (`navigator.deviceMemory`)
- [x] Create warning modal for OOM risk
- [x] Add offline checks
- [x] Fix Arabic language code (`arb_Arab`)
- [x] Clean up rogue `undefined` output artifacts
- [x] Final testing & validation
