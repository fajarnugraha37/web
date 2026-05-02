# Specification: hooks/useDuckDbActions.ts

## 1. Problem Framing
Manages UI-specific interactions for the DuckDB lab (file upload, query copying, exporting).

## 2. State Model
- **Ownership:** Local component state for `registeredFiles` and `copiedQuery`.

## 3. Findings & Recommendations
- Migration: The `registeredFiles` state should be managed globally if DuckDB interaction needs to be synchronized with other parts of the dashboard. Consider moving this to a Zustand store for better accessibility.
