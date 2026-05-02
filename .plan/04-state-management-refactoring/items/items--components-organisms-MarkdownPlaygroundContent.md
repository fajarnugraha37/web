# Specification: components-organisms-MarkdownPlaygroundContent.tsx

## 1. Problem Framing
The most complex organism in the app; orchestrates the entire Markdown editor workspace.

## 2. State Model
- **Ownership:** Manages the entire app-wide editor state (files, content, modes, modals, sync, history). It heavily uses `useMarkdownEditor` and `useMarkdownActions`.

## 3. Findings & Recommendations
- This is the #1 priority for state refactoring. 
- Migration: The entire state (`files`, `activeFileId`, `activeContent`, `viewMode`, etc.) should be migrated to a `useMarkdownEditorStore` (Zustand). Current state management is too dispersed within this component and its hooks.
