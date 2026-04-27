# Specification: hooks/use-mobile.ts

## Overview
The `useIsMobile` hook provides a simple boolean value indicating whether the current viewport width is below a defined "mobile" breakpoint (768px).

## Functionality
*   **Behavior:**
    *   Tracks screen width using `window.matchMedia` and `resize` event patterns.
    *   Returns `true` if mobile, `false` otherwise.

## State Management
*   `isMobile`: Boolean tracking current mobile status.

## Logic & Data Handling
*   **Breakpoint:** Hardcoded at `768px`.
*   **Initialization:** Sets initial state in `useEffect` to ensure client-side consistency.

## Dependencies
*   React.

## Potential Issues
*   Potential hydration mismatch: The initial state is `undefined` before the `useEffect` runs, which might cause rendering differences if components check `isMobile` during initial render on the server vs. client.
