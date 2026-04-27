# Specification: components/ScrollReveal.tsx

## Overview
The `ScrollReveal` component is a wrapper that triggers entrance animations when content enters the viewport during scrolling.

## Functionality
*   **User Interface:**
    *   Wraps provided `children` content.
*   **Behavior:**
    *   Animates content from hidden to visible based on a specified direction (up, down, left, right).
    *   Triggers once per mount, when the element enters the viewport with a -100px margin.
    *   Includes configurable delay and direction props.

## State Management
*   None.

## Page/Component Structure
*   `motion.div` wrapper.

## Logic & Data Handling
*   **Animation Logic:** Uses `motion/react` with pre-defined variants (`hidden`, `visible`) and a snappy transition curve.

## Dependencies
*   `motion/react` (Animations).

## Potential Issues
*   The `viewport={{ once: true }}` setting ensures it only animates once. This is standard behavior for "scroll reveal" patterns, but may prevent re-animation if user navigates back to the page.
*   Fixed duration/delay defaults might not be optimal for all screen sizes or content lengths.
