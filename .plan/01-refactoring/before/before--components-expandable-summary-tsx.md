# Specification: components/ExpandableSummary.tsx

## Overview
The `ExpandableSummary` component is a specialized container for wrapping long executive summary content. It provides a "read more" / "read less" toggle, initially constraining height to 3 lines with a gradient fade mask, and expanding to full height on demand.

## Functionality
*   **User Interface:**
    *   Displays children content within an expandable/collapsible area.
    *   Displays an "EXPAND_SUMMARY" / "COLLAPSE_SUMMARY" button.
    *   Applies a gradient fade mask when collapsed to visually indicate truncated content.
*   **Navigation:**
    *   None.

## Behavior
*   Uses `useState` to toggle visibility.
*   Calculates the full height of the container using `useRef` and `scrollHeight` upon mounting.
*   Uses a CSS custom property `--expand-height` and the `.expandable-summary-panel` class to manage the transition smoothly.

## State Management
*   `expanded`: Boolean tracking if the summary is expanded.
*   `height`: Number tracking the calculated full container height.

## Page/Component Structure
*   `div` (Main container with border)
    *   `div` (Collapsible area with fade mask)
        *   `div` (Content container with `ref={contentRef}`)
            *   `children`
    *   `button` (Toggle)

## Logic & Data Handling
*   **DOM Access:** Uses `contentRef` to calculate the height once upon mounting.
*   **Fade Mask:** A `div` with a `gradient-to-t` background acts as a visual mask only when `expanded` is false.

## Dependencies
*   `app/app.css` (CSS classes `.expandable-summary-panel`).

## Potential Issues
*   **Coupling:** Like `ExpandableDescriptions.tsx`, this relies on global CSS classes and specific custom properties, making it brittle.
*   **Redundancy:** Similar pattern to `ExpandableDescriptions.tsx`. Both could be refactored into a single, reusable abstraction.
*   **Performance:** `useEffect` height calculation at mount is fine, but if the content (children) is dynamic (e.g., changes after mount), this component will not recalculate its height, potentially leading to clipped content.
