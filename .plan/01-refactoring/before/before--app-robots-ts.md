# Specification: app/robots.ts

## Overview
The `robots.ts` file generates the robots.txt file for the site, providing search engine crawlers with instructions on allowed paths and the location of the sitemap.

## Functionality
*   **Crawler Instructions:**
    *   Allows all crawlers (`userAgent: "*"`) to access all paths (`allow: "/"`).
    *   Points to the `sitemap.xml` location.

## Behavior
*   Uses `force-static` to ensure it is pre-rendered at build time.
*   Dynamically builds the sitemap URL based on `NEXT_PUBLIC_BASE_URL`.

## State Management
*   None (Stateless).

## Logic & Data Handling
*   **Generation:** Returns a standard `MetadataRoute.Robots` object.

## Dependencies
*   `next` (for `MetadataRoute`).

## Potential Issues
*   The `baseUrl` relies on an environment variable; ensure it is correctly configured for the production environment.
