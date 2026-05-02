# Specification: hooks/useTerminal.ts

## 1. Problem Framing
Manages terminal output, user history, and typing simulation state.

## 2. State Model
- **Ownership:** Extensive local state (`output`, `input`, `history`, `historyIndex`).

## 3. Findings & Recommendations
- Migration: **High priority**. If we want the terminal to feel persistent (e.g., navigating away and returning, the history/output should remain), this must be migrated to a Zustand store.
