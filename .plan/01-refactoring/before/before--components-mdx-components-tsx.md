# Specification: components/MDXComponents.tsx

## Overview
The `MDXComponents` module defines a custom mapping object used by `next-mdx-remote` to intercept and replace standard Markdown elements with custom-styled React components.

## Functionality
*   **Element Mapping:**
    *   `pre`: Simplifies output (passed down to `code`).
    *   `code`: Detects if it's a block code (with `className`) to render the `CodeBlock` component, otherwise renders inline code with specific styling.
    *   `h2`/`h3`: Automatically injects an `id` attribute based on content for linking and table-of-content generation.
    *   `table`/`th`/`td`: Applies responsive styling and custom colors to standard Markdown tables.

## Behavior
*   Acts as a configuration mapping for MDX rendering.

## State Management
*   None.

## Page/Component Structure
*   Mapping object containing React components.

## Logic & Data Handling
*   **Transformation:** Logic to transform raw Markdown into styled React components.
*   **Anchor Generation:** Simple string normalization (`toLowerCase().replace(/\s+/g, "-")`) for auto-linking headers.

## Dependencies
*   `components/CodeBlock.tsx`.

## Potential Issues
*   **Hardcoded Mapping:** If more elements (e.g., `blockquote`, `li`) need custom rendering, this file will continue to grow.
*   **Tight Coupling:** Heavily coupled to `CodeBlock.tsx` and specific CSS classes within `app.css`.
*   **Fragility:** Auto-slug generation for headers (`h2`, `h3`) is a simple implementation and might fail on special characters.
