# Specification: components/SqlTerminal/ResultMatrix.tsx

## Overview
The `ResultMatrix` component is a high-performance data grid designed for displaying SQL query results. It leverages virtualized scrolling for rendering efficiency with large datasets and includes pagination, column-based data rendering, and CSV export functionality.

## Functionality
*   **User Interface:**
    *   **Telemetry Header:** Shows execution metrics (status, record counts, latency).
    *   **Data Grid:** Scrollable virtualized table for displaying results.
    *   **Footer Pagination:** Controls for page navigation, size adjustment, and current view status.
    *   **Export Controls:** Buttons for exporting the current page or the entire result set as CSV.
*   **Navigation:**
    *   Internal pagination controls (`ChevronsLeft`, `ChevronLeft`, `ChevronRight`, `ChevronsRight`).

## Behavior
*   Uses `tanstack/react-virtual` for row virtualization, allowing for efficient rendering of thousands of rows.
*   Handles loading, error, and empty states.
*   Provides real-time pagination controls.
*   Generates CSV data on the client side for local export.

## State Management
*   None (Controlled via `pagination` prop and query results).

## Page/Component Structure
*   `div` (Main container)
    *   `div` (Telemetry Header)
    *   `div` (Virtualized Table container)
        *   Fixed Header Row
        *   `rowVirtualizer` (Virtualized rows container)
    *   `div` (Pagination Footer)

## Logic & Data Handling
*   **Rendering:** Dynamically generates column headers from the first row of results.
*   **Virtualization:** `useVirtualizer` manages the visibility and height of table rows for performance.
*   **Export:** Client-side CSV generation via `Blob` and dynamic `<a>` link generation.
*   **Data Handling:** Null-checking and type-conversion logic inside row cells.

## Dependencies
*   `@tanstack/react-virtual` (Virtualization engine).
*   `lucide-react` (Icons).

## Potential Issues
*   **Performance:** Sorting or deep processing of large datasets inside `useMemo` or during rendering could block the UI thread.
*   **Styling:** Reliance on complex inline CSS and grid layouts for the virtualized list may break if the styling structure changes.
*   **Accessibility:** The virtualized list can be tricky for keyboard navigation or screen readers; ensure focus management is correct if accessible navigation is required.
