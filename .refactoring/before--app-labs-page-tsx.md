# Specification: app/labs/page.tsx

## Overview
The `LabsDashboard` component is the landing page for the `/labs` section. It presents a grid of experimental "nodes" (individual lab environments) that the user can explore.

## Functionality
*   **User Interface:**
    *   Dashboard header with the page title.
    *   A prominent "System Warning" block detailing browser-local storage limitations.
    *   A grid of interactive cards (`LAB_NODES`), each representing a lab tool.
*   **Navigation:**
    *   Navigates to sub-routes (e.g., `/labs/duckdb`, `/labs/postgresql`) when a card is clicked.

## Behavior
*   Displays a static list of available lab nodes.
*   Each node displays its title, description, icon, and status.

## State Management
*   Stateless (Uses static `LAB_NODES` data).

## Page/Component Structure
*   `PageTransition`
    *   `div` (Dashboard Container)
        *   `div` (Header)
        *   `div` (Warning box)
        *   `div` (Grid of Nodes)
            *   `Link` per lab node (containing icon, status, name, description)

## Logic & Data Handling
*   **Data Structure:**
    *   `LAB_NODES`: Array of objects defining the lab configurations (id, name, description, icon, path, status, color).
*   **API Calls:** None.
*   **Storage Handling:** None.

## Dependencies
*   `components/PageTransition.tsx` (Transition wrapper)
*   `lucide-react` (Icons)
*   `next/link` (Navigation)

## Potential Issues
*   The dashboard relies on hardcoded `LAB_NODES`. Adding a new lab requires manual updates here.
*   Responsiveness for the grid layout is handled by Tailwind classes; ensure this remains robust as more labs are added.
