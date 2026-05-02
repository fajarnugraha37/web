# Specification: components-molecules-SearchPalette.tsx

## 1. Problem Framing
Global keyboard-accessible command palette.

## 2. State Model
- **Ownership:** Internal local state (`query`). Parent component manages `isOpen`.

## 3. Findings & Recommendations
- Standard UI modal. No global state migration needed.
