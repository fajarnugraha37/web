# Specification: app/labs/duckdb/page.tsx

## Overview
The `DuckDBLab` component provides an interactive analytical SQL terminal in the browser using `duckdb-wasm`. Users can ingest datasets (CSV/Parquet), run arbitrary SQL queries against them, and visualize results in a matrix format.

## Functionality
*   **User Interface:**
    *   **OLAP LAB Header:** Displays Lab status, controls for file ingestion, and layout switching (stack/wide).
    *   **Global Status Bar:** Real-time metrics (Engine status, compute mode, volumes, throughput).
    *   **Analytics Tips/Accordions:** Instructional panels for file ingestion, active volumes, and pre-defined datasets.
    *   **SQL Terminal:** Contains an `SqlEditor` for query input and a `ResultMatrix` for viewing/paginating/exporting results.
*   **Navigation:**
    *   No page-to-page navigation within this component; it is a self-contained lab.
*   **Accessibility:**
    *   Uses semantic `<section>`, `<h1>`, `button`, and `input` elements.

## Behavior
*   Uses `useDuckDb` hook to manage WASM database engine lifecycle.
*   Supports drag-and-drop file ingestion, registering files as virtual tables in DuckDB.
*   Handles SQL execution, including counting total records, paginating, and exporting to CSV.

## State Management
*   `results`: Array storing query results.
*   `queryError`: State for SQL/execution error tracking.
*   `executionTime`: Performance monitoring for queries.
*   `layoutMode`: Toggles between "stack" and "wide" layouts.
*   `registeredFiles`: List of ingested virtual table names.
*   `totalRecords` / `currentPage` / `pageSize`: For pagination logic.
*   `isVolumesOpen` / `isDatasetsOpen`: UI state for accordion panels.

## Page/Component Structure
*   `PageTransition`
    *   `header` / `container` (Main content)
        *   `section` (Analytics Header + Status Cards + Help Panels)
        *   `div` (Main Interface, conditionally rendered based on `layoutMode`)
            *   `SqlEditor`
            *   `ResultMatrix`

## Logic & Data Handling
*   **Data Handling:** Ingests local files via browser File API.
*   **SQL Execution:**
    *   Engine: `duckdb-wasm`.
    *   Flow: Validates query, fetches count (if SELECT), fetches page data, updates state.
*   **Export:** Generates CSV blob from last query results and triggers download.
*   **Storage Handling:** Uses browser-side WASM memory and file system registration.

## Dependencies
*   `hooks/use-duckdb.ts` (Core DuckDB integration)
*   `components/SqlTerminal/SqlEditor.tsx`
*   `components/SqlTerminal/ResultMatrix.tsx`
*   `components/PageTransition.tsx`
*   `lucide-react` (Icons)

## Potential Issues
*   **Performance:** Large files ingested directly into browser memory may crash the tab.
*   **Compatability:** DuckDB-WASM version compatibility with certain Parquet file versions or complex SQL features.
*   **File Handling:** Relies on DuckDB's internal `registerFile` API which might have limitations on large uploads.
*   **Maintenance:** Monolithic component mixing UI, database logic, and state orchestration. Could be refactored into smaller, modular sub-components.
