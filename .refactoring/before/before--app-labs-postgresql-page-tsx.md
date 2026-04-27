# Specification: app/labs/postgresql/page.tsx

## Overview
The `PostgreSQLPlayground` component provides an interactive browser-based SQL terminal for a persistent PostgreSQL instance using `PGlite` (WASM). It allows users to execute SQL queries, manage tables, view results, and export data, all within the browser environment.

## Functionality
*   **User Interface:**
    *   **SQL Lab Header:** Displays lab status, table listing button, layout toggle (stack/wide), and a system purge (reset) button.
    *   **Global Status Bar:** Shows real-time metrics (Engine Status, Storage Mode, Security Clearance, Active Nodes).
    *   **SQL Terminal:** Contains an `SqlEditor` for query writing and a `ResultMatrix` for data grid display, pagination, and CSV export.
*   **Navigation:**
    *   Self-contained playground; no internal navigation required.
*   **Accessibility:**
    *   Uses semantic elements and aria-friendly status indicators.

## Behavior
*   Uses `usePglite` hook to interface with the PGlite WASM database.
*   Handles SQL execution, including sub-query wrapping for pagination of `SELECT` statements.
*   Provides a full "System Purge" to clear IndexedDB persistence and reload the application.

## State Management
*   `results`: Stores SQL execution output.
*   `queryError`: Manages runtime SQL/execution error states.
*   `executionTime`: Records query latency.
*   `isExecuting`: Boolean for loading states during query execution.
*   `layoutMode`: Toggles between stack/wide view.
*   `currentPage`, `pageSize`, `totalRecords`: Pagination logic state.

## Page/Component Structure
*   `PageTransition`
    *   `div` (Main Interface)
        *   `header` / `div` (Lab Header & Controls)
        *   `div` (Global Status Bar)
        *   `div` (Quick Tips panel)
        *   `div` (SQL Lab main area: `SqlEditor` + `ResultMatrix`)

## Logic & Data Handling
*   **Data Handling:** Uses `pglite` (WASM PostgreSQL).
*   **SQL Execution:** Wraps `SELECT` queries to count totals and fetch specific pages before returning results to state.
*   **Export:** Generates CSV blob from current result set and triggers download.
*   **Storage Handling:** Uses browser's `IndexedDB` for database persistence.

## Dependencies
*   `hooks/use-pglite.ts` (DB engine integration)
*   `components/SqlTerminal/SqlEditor.tsx`
*   `components/SqlTerminal/ResultMatrix.tsx`
*   `components/PageTransition.tsx`
*   `lucide-react` (Icons)

## Potential Issues
*   **Complexity:** Monolithic component handling layout, business logic, DB interactions, and state.
*   **Performance:** Heavy computations or large result sets may degrade browser performance.
*   **Data Persistence:** Clearing IndexedDB/localStorage is a destructive action that requires clear user warnings.
