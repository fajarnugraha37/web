# Specification: hooks/use-pglite.ts

## Overview
The `usePglite` hook manages the initialization and lifecycle of a persistent PostgreSQL database instance using `@electric-sql/pglite` (WASM).

## Functionality
*   **Engine Lifecycle:**
    *   Attempts to initialize the database with `idb://` (IndexedDB) for persistence.
    *   Falls back to memory-only (`volatile`) if storage is restricted.
    *   Applies a seed SQL schema if the database is brand new.
*   **Execution:**
    *   Exposes an `exec` method for running SQL queries against the active `PGlite` instance.

## Behavior
*   Uses a `useRef` flag (`initRef`) to ensure the initialization logic runs exactly once.
*   Provides status monitoring (`initializing`, `ready`, `error`, `volatile`).

## State Management
*   `db`: Current `PGlite` instance.
*   `status`: Current engine state.
*   `error`: Stores critical initialization/execution failure messages.

## Logic & Data Handling
*   **Initialization:** Implements a fallback strategy (IndexedDB -> Memory).
*   **Seeding:** Checks for the existence of a table (`system_control`) to avoid re-seeding the database on every reload.

## Dependencies
*   `@electric-sql/pglite` (Core library).
*   `lib/pg-seed.ts` (Seed SQL script).

## Potential Issues
*   **Storage Access:** Browser restrictions or private browsing modes may prevent IndexedDB access, forcing the DB to stay in memory (volatile).
*   **Concurrency:** Multiple instances of this hook in the application could potentially lead to race conditions during initialization; `initRef` ensures local instances run once, but doesn't synchronize access if PGlite instances are opened elsewhere.
*   **Seed Strategy:** The check for the `system_control` table is a basic way to detect initialization; it may not correctly identify all partially seeded states if the process is interrupted.
