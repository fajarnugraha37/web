# Specification: app/labs/knowledge-graph/page.tsx

## Overview
The `KnowledgeGraphPage` renders an interactive 3D graph visualization of blog posts and their relationships. It fetches data from static JSON files and visualizes it using a canvas component.

## Functionality
*   **User Interface:**
    *   Displays an interactive 3D graph (`KnowledgeGraphCanvas`).
    *   Sidebar containing content metadata, system logs, and a download action.
    *   Breadcrumb-style top navigation back to the labs overview.
*   **Navigation:**
    *   "RETURN_TO_LABS" link back to `/labs`.
*   **Accessibility:**
    *   Uses semantic containers and accessibility-conscious layout patterns.

## Behavior
*   Loads relational and index data (`relations.json`, `search-index.json`).
*   Transforms raw data into a graph structure suitable for visualization.
*   Provides a download button to export the current graph state as JSON.
*   Implements a visual simulation of system log activity.

## State Management
*   Stateless (Server/Static data). Relies on external data files processed during component rendering.

## Page/Component Structure
*   `PageTransition`
    *   `div`
        *   `div` (Top HUD/Breadcrumbs)
        *   `div` (Main grid: Main Canvas area + Sidebar)
            *   `KnowledgeGraphCanvas` (Main 3D viz)
            *   `aside` (Info Panel)
                *   Content Network summary
                *   System Log Simulation
                *   Export Controls

## Logic & Data Handling
*   **Data Transformation:**
    *   `transformDataToGraph(relations, searchIndex)`: Converts static JSON data into node/link objects.
*   **Export:**
    *   `handleExport()`: Uses Blob and dynamic element creation to download the current graph as JSON.
*   **API Calls:** None.
*   **Storage Handling:** None (Uses browser memory and file downloads).

## Dependencies
*   `components/KnowledgeGraph/KnowledgeGraphCanvas.tsx` (3D Visualization component)
*   `components/PageTransition.tsx`
*   `lib/graph-utils.ts` (Data transformation logic)
*   `lucide-react` (Icons)
*   `public/relations.json` & `public/search-index.json` (Static data)

## Potential Issues
*   **Maintainability:** The `KnowledgeGraphCanvas` (implied dependency) might be complex to refactor if tightly coupled with specific graph visualization libraries (e.g., D3/Three.js).
*   **Performance:** Data transformation occurs on render, which could be slow if the `relations.json` or `search-index.json` files grow significantly.
*   **Coupling:** The page is directly dependent on specific JSON file structures.
