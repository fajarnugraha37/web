# Specification: hooks/use-duckdb.ts

## Overview
The `useDuckDb` hook provides a React interface to the DuckDB WASM analytical database engine. It manages the lifecycle (instantiation, connection) and provides methods for query execution and file registration.

## Functionality
*   **Engine Lifecycle:**
    *   Initializes DuckDB worker and WASM bundle.
    *   Handles cross-origin restrictions for worker scripts using Blob/Object URLs.
    *   Provides status monitoring (`initializing`, `ready`, `error`, `executing`).
*   **Data Handling:**
    *   Executes SQL queries and transforms `Apache Arrow` results to plain JS objects.
    *   Registers local files (CSV/Parquet) as virtual tables for query access.

## Behavior
*   Instantiates the database only once.
*   Executes asynchronous SQL queries with error handling.
*   Provides status feedback.
*   Handles data serialization (e.g., converting BigInt to string).

## State Management
*   `status`: Current engine state.
*   `error`: Stores initialization/execution error messages.
*   `dbRef`, `connRef`: References to the DuckDB database and connection objects.

## Logic & Data Handling
*   **Initialization:** Uses a specific "EH" (Exception Handling) bundle to manage C++ exceptions in WASM.
*   **Serialization:** Iterates through Arrow rows and columns to sanitize data (converts BigInts, Dates, and Objects).

## Dependencies
*   `@duckdb/duckdb-wasm` (Core library).

## Potential Issues
*   **Initialization:** The logic for proxying worker scripts via a Blob URL is a workaround for specific browser/CORS environments and may be fragile if dependencies change.
*   **Memory:** DuckDB WASM operates in the browser's memory. Large dataset handling is limited by browser tab memory limits.
*   **Coupling:** Tied to a specific path structure (`/duckdb`) for WASM assets.
