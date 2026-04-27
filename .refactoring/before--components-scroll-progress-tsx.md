# Specification: components/ScrollProgress.tsx

## Overview
The `ScrollProgress` component displays a thin, sticky horizontal progress bar at the top of the viewport, visualizing how far the user has scrolled through the current page content.

## Functionality
*   **User Interface:**
    *   A thin (2px) progress bar pinned to the top of the screen.
*   **Behavior:**
    *   Fills horizontally as the user scrolls down the page.

## State Management
*   None.

## Page/Component Structure
*   `motion.div` (Fixed to the top of the viewport)

## Logic & Data Handling
*   **Scroll Tracking:** Uses `useScroll` from `motion/react` to map the scroll position to `scaleX` (0 to 1).
*   **Animation:** Uses `useSpring` to smooth the progress bar movement.

## Dependencies
*   `motion/react` (Animations/Scroll hooks).

## Potential Issues
*   The progress bar is global (`fixed top-0`). If any other top-level UI elements (like headers) are also fixed to the top, ensure `z-index` values are aligned correctly.
