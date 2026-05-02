# Specification: hooks/useMarkdownActions.ts

## 1. Problem Framing
Handles I/O actions for the Markdown editor (download, import, fetch from GitHub).

## 2. State Model
- **Ownership:** Local state for modals and file-sharing status.

## 3. Findings & Recommendations
- Migration: The GitHub/modal UI state should be managed via a global UI store (Zustand) to decouple it from specific components.
