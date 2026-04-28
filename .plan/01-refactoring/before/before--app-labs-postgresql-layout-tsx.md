# Specification: app/labs/postgresql/layout.tsx

## Overview
The `PostgresLayout` component serves as a layout wrapper for the `/labs/postgresql` section, providing specific SEO metadata and keywords for the PostgreSQL playground lab.

## Functionality
*   **Metadata:**
    *   Defines SEO title, description, and keywords specific to the PostgreSQL WASM/PGlite playground.

## Behavior
*   Passes children directly to the layout.

## State Management
*   None (Stateless).

## Page/Component Structure
*   `Fragment` (`<>`)
    *   `children`

## Logic & Data Handling
*   **Metadata:** Sets SEO metadata for the PostgreSQL Lab pages.

## Dependencies
*   `next`: For Metadata type.

## Potential Issues
*   Similar to other lab layouts, it is a simple wrapper and could be consolidated if no shared components are introduced.
