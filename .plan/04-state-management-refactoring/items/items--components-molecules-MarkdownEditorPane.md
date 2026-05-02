# Specification: components-molecules-MarkdownEditorPane.tsx

## 1. Problem Framing
Wraps the CodeMirror editor with VIM mode support.

## 2. State Model
- **Ownership:** Manages local editor instance refs, but logic (content) is synced from the parent `MarkdownPlaygroundContent` organism via `activeFile` and `updateFileContent`.

## 3. Findings & Recommendations
- Complex component. Migration: Maintain existing ref/imperative handle for editor control, but look to move the `activeFile` content state to Zustand store to simplify parent-child prop drilling.
