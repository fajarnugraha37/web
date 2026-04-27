# Specification: components/ScrollToTop.tsx

## Overview
The `ScrollToTop` component provides a floating button that appears after the user scrolls down (beyond 300px), allowing them to return to the top of the page with a smooth animation.

## Functionality
*   **User Interface:**
    *   Floating button with an "arrow-up" icon and a stylized "TOP.EXE" label.
    *   Stylized with cyberpunk aesthetic (border effects, scanline animation).
*   **Navigation:**
    *   Triggered action scrolls `window` to `top: 0`.

## Behavior
*   Tracks scroll position (`scrollY > 300`).
*   Uses `AnimatePresence` for smooth mounting/unmounting.
*   Provides hover/tap feedback animations.

## State Management
*   `isVisible`: Boolean state to control visibility based on scroll threshold.

## Page/Component Structure
*   `AnimatePresence`
    *   `motion.button` (Fixed position, contains styling and interaction)

## Logic & Data Handling
*   **Scroll Tracking:** `window` scroll event listener in `useEffect`.
*   **Action:** `window.scrollTo` with `behavior: "smooth"`.

## Dependencies
*   `lucide-react` (Icons).
*   `motion/react` (Animations).

## Potential Issues
*   The `window` scroll listener is a global event listener; ensure it is properly cleaned up (already included in `return () => ...`).
*   The threshold (300px) is hardcoded.
*   Accessibility: Ensure the button is appropriately labeled for screen readers (using `aria-label`).
