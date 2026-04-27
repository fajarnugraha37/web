# Specification: components/TocNav.tsx

## Overview
The `TocNav` component renders a Table of Contents (ToC) for the blog posts based on extracted header levels. It uses the `useActiveSection` hook to highlight the currently visible section on the page.

## Functionality
*   **User Interface:**
    *   Navigational list of links corresponding to document headers (`h1`, `h2`, etc.).
    *   Visual highlighting for active sections.
*   **Navigation:**
    *   Scrolls to anchor IDs on the page.

## Behavior
*   Uses `useActiveSection` hook (which likely uses `IntersectionObserver`) to track scroll position and update `activeId`.
*   Hierarchical display with nested levels for sub-headings.

## State Management
*   Stateless (Active section ID is derived from `useActiveSection` hook).

## Page/Component Structure
*   `nav`
    *   `div` (Mapped headings)

## Logic & Data Handling
*   **Data Handling:** Processes `headings` data structure (flat or nested) into clickable links.
*   **Highlighting:** Compares active `id` from the hook against link IDs.

## Dependencies
*   `hooks/use-active-section.ts`.

## Potential Issues
*   **Coupling:** Strongly coupled to the header extraction logic from blog posts. If the heading structure changes, this component may need an update.
*   **UI/Layout:** Minimal styling; might need better visual depth or responsiveness if it becomes very long.
