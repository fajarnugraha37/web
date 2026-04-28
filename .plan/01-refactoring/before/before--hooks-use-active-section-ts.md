# Specification: hooks/use-active-section.ts

## Overview
The `useActiveSection` hook determines which heading (based on provided IDs) is currently "active" in the viewport by observing the element intersections with a fixed root margin.

## Functionality
*   **Behavior:**
    *   Tracks multiple DOM elements by their `id`.
    *   Uses `IntersectionObserver` to identify which section is currently active.
    *   Returns the active section ID.

## State Management
*   `activeId`: String ID of the currently active element.

## Logic & Data Handling
*   **Observer:** Configured with `rootMargin: "-20% 0px -70% 0px"` to define a narrow vertical "active zone" near the top of the viewport.
*   **Cleanup:** Properly unobserves all elements on unmount.

## Dependencies
*   React hooks (`useState`, `useEffect`).

## Potential Issues
*   The `IntersectionObserver` logic sets `activeId` based on any intersecting element, which might cause "active" state flickering if multiple elements intersect at once.
*   Strongly coupled to the DOM (`document.getElementById`).
*   Requires the provided `ids` to already exist in the DOM; if IDs are dynamic, this might not track them until the next render.
