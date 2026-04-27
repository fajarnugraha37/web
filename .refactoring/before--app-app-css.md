# Specification: app/app.css

## Overview
The `app/app.css` file is the global stylesheet for the Next.js application, utilizing Tailwind CSS v4. It defines design tokens (colors, fonts, radii), global styles, base element typography, and reusable CSS utility classes for the "cyberpunk" aesthetic (glitch effects, neon shadows, custom clip-paths).

## Functionality
*   **Design System:**
    *   Defines color variables (background, foreground, accent colors).
    *   Defines typography (font-sans, font-mono).
    *   Defines spacing and radius variables.
*   **Global Styles:**
    *   Enforces background styles, body typography, and global focus states for accessibility (`:focus-visible`).
    *   Implements a global "scanline" effect on the `body` element.
*   **Utilities:**
    *   `cyber-chamfer` / `cyber-chamfer-reverse`: Custom clip-path utility for cyberpunk-style skewed container shapes.
    *   `cyber-grid-bg`: Global CSS-only grid background pattern.
    *   `cyber-glitch-text`: Animated text glitch effect.
    *   Theme overrides: Provides scoped classes (`.theme-sunset`, `.theme-morning`) to update CSS variables dynamically.
*   **Markdown Support:**
    *   `markdown-body` class: Defines styling for imported Markdown/MDX content (h1, h2, pre, code, blockquote, GitHub alerts).
*   **Misc:**
    *   Animation definitions (glitch-anim, blink).
    *   Custom scrollbar styling for cyberpunk look.

## Behavior
*   Uses `@layer base` and `@layer utilities` to maintain Tailwind-idiomatic organization.
*   Provides global retro UI effects that are intended to be consistent across the application.

## State Management
*   None (CSS-only).

## Structure
*   **Theme Token Definition:** `@theme` block.
*   **Base Styles:** Global resets and typography.
*   **Utilities:** Custom CSS patterns for UI components.
*   **Animations:** `@keyframes`.
*   **Markdown Styles:** `markdown-body` class definitions.

## Logic & Data Handling
*   None (CSS-only).

## Dependencies
*   `tailwindcss` (v4).

## Potential Issues
*   **Centralization/Modularization:** The file is large and contains both design tokens (which could be in Tailwind config) and component-specific styles (e.g., Markdown body, scrollbars).
*   **Separation of Concerns:** Mixing page-specific themes (`theme-sunset`, `theme-morning`) in a global file can lead to maintenance challenges as more themes are added.
*   **Performance:** A single massive CSS file might grow too large; consider modularizing by UI feature if the file size increases significantly.
*   **Naming Conventions:** The use of class names like `cyber-glitch-text` is non-standard compared to Tailwind utility-first patterns. Refactoring to atomic Tailwind utility classes where possible would be preferred.
