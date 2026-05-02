# Specification: hooks/useTranslationWorker.ts

## 1. Problem Framing
Orchestrates the translation Web Worker lifecycle (init, processing, logs, progress tracking).

## 2. State Model
- **Ownership:** Internal local state (`status`, `progressItems`, `logs`).

## 3. Findings & Recommendations
- Migration: This is a complex state management scenario. Move worker status and progress items into a global `useTranslationStore` (Zustand) to decouple the UI from the worker orchestrator.
