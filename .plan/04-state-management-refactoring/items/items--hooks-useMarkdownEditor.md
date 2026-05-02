# Specification: hooks/useMarkdownEditor.ts

## 1. Problem Framing
Central orchestration hook for the entire Markdown playground state.

## 2. State Model
- **Ownership:** Manages `files`, `activeFileId`, `activeContent`, `viewMode`, `syncStatus`, and refs.

## 3. Findings & Recommendations
- **Critical priority.** This hook contains the most complex application logic in the entire codebase. 
- Migration: This must be fully migrated to a Zustand store (`useMarkdownEditorStore`). All current file lifecycle methods (add/rename/delete) and state updates should live inside the store to allow for atomic updates and easier debugging.
