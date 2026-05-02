# Specification: components-molecules-SqlEditor.tsx

## 1. Problem Framing
Provides a Monaco-based code editor instance for SQL exploration.

## 2. State Model
- **Ownership:** Local editor content (`query`), local history (`history`), UI state (`showHistory`).

## 3. Findings & Recommendations
- This component has significant local state. Migration: Move `history` state to Zustand store to keep SQL-related preferences persistent and global across the app.
