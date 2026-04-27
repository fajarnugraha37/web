# Specification: components/ExpandableDescriptions.tsx

## Overview
The `ExpandableDescriptions` component renders a list of career description points. By default, it displays only the first entry truncated to one line, with an "EXPAND/COLLAPSE" button to reveal or hide the full list of bullet points using a CSS-based height transition.

## Functionality
*   **User Interface:**
    *   Displays a list of bullet-pointed descriptions (`descriptions` array).
    *   Includes a toggle button that updates the visibility and count of displayed entries.
*   **Navigation:**
    *   None.

## Behavior
*   Uses `useState` to toggle visibility.
*   Calculates the full height of the expanded container using `useRef` and `scrollHeight`.
*   Uses CSS variables (`--expand-height`) and the `.expandable-panel` CSS class (defined in `app.css`) to handle the smooth height expansion.

## State Management
*   `expanded`: Boolean state tracking if the list is fully visible.
*   `fullHeight`: Number state storing the calculated full height of the list (for CSS transition).

## Page/Component Structure
*   `div`
    *   Collapsed: `p` (Truncated first description)
    *   Expanded: `div` (Wrapper with `ref={fullRef}`)
        *   `map` over descriptions -> `p` (Bullet-pointed list)
    *   `button` (Expand/Collapse toggle)

## Logic & Data Handling
*   **DOM Access:** Uses `fullRef` to read `scrollHeight` upon component load or update.
*   **Formatting:** Prepends `>` icon to each item.

## Dependencies
*   `app/app.css` (CSS classes `.expandable-panel`).

## Potential Issues
*   **Dependency on CSS:** Relies on global CSS classes (`.expandable-panel`) and specific CSS custom property naming, which can be brittle.
*   **Performance:** `scrollHeight` calculation in `useEffect` can trigger reflows.
*   **Redundancy:** Similar pattern to `ExpandableSummary.tsx`. Could be refactored into a reusable `ExpandableWrapper` component to follow DRY principles.
