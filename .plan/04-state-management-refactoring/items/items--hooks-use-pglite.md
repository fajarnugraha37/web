# Specification: hooks/use-pglite.ts

## 1. Problem Framing
Manages the lifecycle, instance initialization, and seeding of the PGlite (WASM Postgres) instance.

## 2. State Model
- **Ownership:** Local state (`db`, `status`, `error`).

## 3. Findings & Recommendations
- Migration: **High priority**. The PGlite engine state should be moved into a persistent Zustand store (`usePgliteStore`) to ensure that database instances are shared across components, avoiding redundant initialization and state fragmentation.
