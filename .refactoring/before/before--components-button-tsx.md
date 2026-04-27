# Specification: components/Button.tsx

## Overview
The `Button` component is a reusable UI component built with `class-variance-authority` (CVA) and Radix UI's `Slot`. It provides standardized styling for various button variants (default, secondary, outline, ghost, glitch) and sizes, adhering to the application's "cyberpunk" design system.

## Functionality
*   **User Interface:**
    *   Supports multiple visual variants and sizes.
    *   Includes a special "glitch" variant that applies specific CSS-based text-glitch effects.
*   **Navigation:**
    *   Supports `asChild` prop to render as a custom element (e.g., `next/link` via `Slot`).

## Behavior
*   Extends standard HTML button attributes.
*   Uses `cn` utility for class merging.
*   The "glitch" variant automatically extracts `data-text` for the CSS animation.

## State Management
*   Stateless.

## Page/Component Structure
*   `Slot` or `button` (depending on `asChild` prop)

## Logic & Data Handling
*   **Styling Logic:** Uses CVA for variant and size configuration.
*   **Props:** Extends `ButtonHTMLAttributes`.

## Dependencies
*   `class-variance-authority` (Variant handling).
*   `@radix-ui/react-slot` (Composition).
*   `lib/utils.ts` (`cn` helper).

## Potential Issues
*   The component is generally well-structured. No significant issues observed.
