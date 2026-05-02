# Specification: components-organisms-TranslateLabContent.tsx

## 1. Problem Framing
Master orchestrator for the Translation Lab (WASM/Transformer pipeline).

## 2. State Model
- **Ownership:** Complex state management across `useTranslationWorker` and `useTranslationParams`.
- **State:** Worker status (`downloading`, `ready`, `error`), progress tracking, memory guards, input/output text state, and warning modal state.

## 3. Findings & Recommendations
- High-priority migration candidate. The current setup is heavily reliant on component-level local state (e.g., `inputText`, `outputText`, `isModalOpen`, `isOffline`, `hasAgreed`) and hooks. 
- Migration: Consolidate all translation-related state (worker status, engine config, translation results, error state) into a single `useTranslateStore` (Zustand) and leverage React Query for model download/status tracking.
