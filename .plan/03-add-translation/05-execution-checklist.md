# File-by-File Execution Checklist

## Phase 1: Routing & Scaffolding
- [x] Install `@xenova/transformers`
- [x] Create `/app/labs/translate/layout.tsx`
- [x] Create `/app/labs/translate/page.tsx`
- [x] Update `app/page.tsx` (Main page dashboard) - *Skipped as LabsDashboardContent manages this*
- [x] Update `components/organisms/Header.tsx` (Navbar)
- [x] Update `components/molecules/MobileNav.tsx` (Mobile Navbar)
- [x] Update `components/organisms/Footer.tsx` (Footer)
- [x] Update `app/labs/page.tsx` (Labs index) - *Skipped as LabsDashboardContent manages this*

## Phase 2: Web Worker & Model Logic
- [x] Create `lib/workers/translate.worker.ts` (or similar)

## Phase 3: Hooks & State Management
- [x] Create `hooks/useTranslationWorker.ts`
- [x] Create `hooks/useTranslationParams.ts`

## Phase 4: UI Components (Atoms & Molecules)
- [x] Create `components/atoms/CharacterCounter.tsx`
- [x] Create `components/atoms/TranslationProgress.tsx`
- [x] Create `components/molecules/LanguageSelect.tsx`
- [x] Update/Create `components/molecules/TerminalLogViewer.tsx`

## Phase 5: Organism Assembly & Streaming
- [x] Create `components/organisms/TranslateLabContent.tsx`

## Phase 6: Guardrails, Edge Cases & Polish
- [x] Implement memory guards (`navigator.deviceMemory`)
- [x] Create warning modal for OOM risk
- [x] Add offline checks
- [x] Final testing & validation
