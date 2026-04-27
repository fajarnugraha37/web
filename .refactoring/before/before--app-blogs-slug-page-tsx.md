# Specification: app/blogs/[slug]/page.tsx

## Overview
The `BlogPost` component is a dynamic page that renders individual blog posts based on a URL slug. It fetches blog data, parses MDX content, extracts headings for a table of contents, and displays related articles.

## Functionality
*   **User Interface:**
    *   Displays the full blog content rendered from MDX.
    *   Includes a sidebar for Table of Contents (ToC) with navigational links.
    *   Includes a sticky header (HUD) with navigation and metadata.
    *   Shows tags, reading time, and word count.
    *   Includes `BlogActions` for interaction.
    *   Shows a sidebar of related posts (Telemetry Feed).
*   **Navigation:**
    *   Supports linking back to `/blogs` (the main list).
    *   Allows navigating to related blog posts.
*   **Accessibility:**
    *   Uses semantic `<article>`, `<aside>`, and `<main>` elements.
    *   Heading IDs allow for direct linking.

## Behavior
*   Uses Next.js Server Components to fetch data and render markdown.
*   Extracts headings dynamically for the Table of Contents.
*   Provides transition animations via `PageTransition`.

## State Management
*   Component is server-side rendered (RSC), so state is handled via data fetching and standard React patterns if interactions are involved in child components.

## Page/Component Structure
*   `PageTransition`
    *   `article`
        *   `aside` (Structure/ToC)
        *   `main`
            *   HUD Header
            *   Blog metadata (Title, Tags, Stats)
            *   `MDXRemote` (Content)
            *   Post Footer
        *   `aside` (Related Posts)

## Logic & Data Handling
*   **Data Fetching:**
    *   `getBlogData(slug)`: Retrieves blog metadata and content.
    *   `getAllBlogSlugs()`: Used for static generation.
    *   `relations.json`: Used to map related posts.
*   **Content Processing:**
    *   `getHeadings()`: Regex-based utility to extract Markdown headers for ToC.
    *   `MDXRemote`: Processes MDX with remark/rehype plugins (Math, Emoji, GFM, Katex, Slug, Raw).
*   **API Calls:** None.
*   **Storage Handling:** None.

## Dependencies
*   `lib/mdx.ts` (Data fetching)
*   `components/MDXComponents.tsx` (MDX mapping)
*   `components/BlogActions.tsx`, `components/TocNav.tsx` (Shared UI components)
*   `remark-*` / `rehype-*` (Content processing)

## Potential Issues
*   The `getHeadings` regex-based extraction might be fragile if MDX files have complex syntax or comments.
*   Static generation (`generateStaticParams`) relies on `getAllBlogSlugs` which must correctly match the directory structure.
*   `relatedPosts` retrieval logic could become a performance bottleneck if the blog list grows very large.
