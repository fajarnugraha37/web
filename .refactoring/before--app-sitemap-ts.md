# Specification: app/sitemap.ts

## Overview
The `sitemap.ts` file generates the XML sitemap for the site, listing all static pages and dynamically generated blog pages.

## Functionality
*   **Sitemap Generation:**
    *   Lists key website routes (`/`, `/about`, `/contacts`, `/blogs`).
    *   Dynamically appends all blog post URLs retrieved from `getSortedBlogsData()`.
*   **Navigation:**
    *   Provides links to all indexed content for search engines.

## Behavior
*   Uses `force-static` for static generation at build time.
*   Maps blog slugs to full URLs using `NEXT_PUBLIC_BASE_URL`.

## State Management
*   None (Stateless).

## Logic & Data Handling
*   **Data Fetching:**
    *   `getSortedBlogsData()`: Retrieves the list of blog posts to populate dynamic routes.
*   **Generation:** Returns a `MetadataRoute.Sitemap` array of objects.

## Dependencies
*   `lib/mdx.ts` (Data retrieval).
*   `next` (for `MetadataRoute`).

## Potential Issues
*   Dynamic blog URLs rely on the correct `slug` property in blog data.
*   Uses the current date (`new Date()`) for static pages, which might be improved by using a fixed build date to ensure sitemap stability across deployments.
