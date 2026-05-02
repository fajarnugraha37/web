# Specification: hooks/use-duckdb.ts

## 1. Problem Framing
Manages the lifecycle, instance initialization, and file registration for the DuckDB WASM engine.

## 2. State Model
- **Ownership:** Internal state (`status`, `error`) and refs (`dbRef`, `connRef`).

## 3. Findings & Recommendations
- Heavy lifecycle management (WASM loading, worker management).
- Migration: **High priority**. Migrate the engine state (DB instance, connection, status) into a Zustand store (e.g., `useDuckDbStore`). Keep the lifecycle logic (instantiation) in a custom hook, but push the state to Zustand so it can be shared with various components/labs.
