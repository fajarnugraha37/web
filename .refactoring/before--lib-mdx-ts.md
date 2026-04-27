# Specification: lib/mdx.ts

## Overview
The `lib/mdx.ts` module provides utility functions for parsing MDX blog posts, calculating content metrics, and retrieving blog metadata. It serves as the primary data interface for the blog system.

## Functionality
*   **Data Retrieval:**
    *   `getSortedBlogsData`: Reads all `.mdx` files from `content/blogs`, parses frontmatter, and returns a sorted list of blog metadata.
    *   `getBlogData`: Reads, parses, and calculates content statistics for a specific blog slug.
    *   `getAllBlogSlugs`: Returns all available slugs for static route generation.
*   **Metrics:**
    *   `calculateContentStats`: Computes word count, character count, and reading time estimate (approx 200 words/min).

## Logic & Data Handling
*   **Parsing:** Uses `gray-matter` for frontmatter extraction.
*   **FS Operations:** Uses Node.js `fs` and `path` for file system access.
*   **Sorting:** Sorts posts by `date` field in descending order.

## Dependencies
*   `fs`, `path` (Node.js built-ins).
*   `gray-matter` (Frontmatter parsing).

## Potential Issues
*   **SSR/Build-time Only:** Functions are designed for server-side usage. If used in a client component, it would break (though currently it's used correctly by server components).
*   **Performance:** `fs.readdirSync` and `fs.readFileSync` are synchronous. While okay for build-time/server-side generation, it might not be ideal for very high-traffic dynamic API routes if the blog list is massive.
*   **Error Handling:** Basic error handling (existence check for the directory); could be more robust.
