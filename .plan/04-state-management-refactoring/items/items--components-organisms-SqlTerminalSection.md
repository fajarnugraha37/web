# Specification: components-organisms-SqlTerminalSection.tsx

## 1. Problem Framing
Orchestrates the SQL editor and results matrix for the lab.

## 2. State Model
- **Ownership:** Local state (`results`, `queryError`, `executionTime`, `isExecuting`, `layoutMode`, `pagination`).

## 3. Findings & Recommendations
- This component holds massive state related to SQL execution and results. 
- Migration: **High priority**. All execution-related states (`results`, `queryError`, `executionTime`, `isExecuting`) should be moved to a `useSqlStore` (Zustand). Result pagination state should also be managed globally or in the store.
