# Specification: components-molecules-MarkdownToolbar.tsx

## 1. Problem Framing
Provides view-mode control (editor/preview) and file action triggers for the markdown playground.

## 2. State Model
- **Ownership:** Internal local state (`editorMenuOpen`). Parent component manages `viewMode` and `showToc`.

## 3. Findings & Recommendations
- The menu state for "File Actions" is local.
- No immediate state migration required.
