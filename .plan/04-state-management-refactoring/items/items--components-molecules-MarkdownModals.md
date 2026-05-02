# Specification: components-molecules-MarkdownModals.tsx

## 1. Problem Framing
Collection of interactive modals for Markdown (Export, Import, Rename).

## 2. State Model
- **Ownership:** Props-controlled by parent organism.

## 3. Findings & Recommendations
- Migration: The `modal` open-state (import/export/github/rename) is currently prop-drilled from the parent. Moving this modal state to a global Zustand store would reduce prop-drilling.
