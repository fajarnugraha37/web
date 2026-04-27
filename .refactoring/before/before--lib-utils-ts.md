# Specification: lib/utils.ts

## Overview
The `lib/utils.ts` module provides a single utility function `cn` used to merge Tailwind CSS class names efficiently.

## Functionality
*   **Utility:**
    *   `cn`: Combines `clsx` and `tailwind-merge` to resolve conflicting Tailwind CSS classes cleanly.

## Behavior
*   Accepts any number of class value arguments (strings, arrays, objects).
*   Returns a single string of valid, merged Tailwind classes.

## Logic & Data Handling
*   Combines `clsx` (for conditional classes) with `tailwind-merge` (for handling class conflicts, e.g., `p-4 p-8`).

## Dependencies
*   `clsx`.
*   `tailwind-merge`.

## Potential Issues
*   None; this is a standard pattern for Tailwind-based projects.
