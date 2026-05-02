# Specification: components-organisms-DuckDbLabContent.tsx

## 1. Problem Framing
Orchestrates the DuckDB lab UI, including toolbar, status, dataset management, and terminal.

## 2. State Model
- **Ownership:** Delegates all logic to `useDuckDb` and `useDuckDbActions` hooks.

## 3. Findings & Recommendations
- This is a well-structured organism delegating logic to hooks. Migration: The hooks themselves (`useDuckDb`, `useDuckDbActions`) should be reviewed/refactored to ensure they use a Zustand store for global application-wide lab state if applicable, but the organism itself is correct.
