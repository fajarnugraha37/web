# Specification: app/feed.xml/route.ts

## Overview
The `GET` route handler for `app/feed.xml/route.ts` generates an RSS feed (XML format) for the blog posts.

## Functionality
*   **RSS Generation:**
    *   Creates a standard RSS 2.0 feed with post titles, links, publication dates, and descriptions.
    *   Dynamically builds the XML string based on the blog data provided by `getSortedBlogsData()`.
*   **Navigation:**
    *   Provides external links to blog entries in the RSS feed.

## Behavior
*   Uses `force-static` to ensure the feed is pre-rendered at build time.
*   Constructs the absolute URL for each post using `process.env.NEXT_PUBLIC_BASE_URL`.

## State Management
*   None (Stateless).

## Page/Component Structure
*   API Route (Server-side generator).

## Logic & Data Handling
*   **Data Fetching:**
    *   `getSortedBlogsData()`: Retrieves the list of posts.
*   **Content Generation:**
    *   Maps blog metadata into XML `<item>` tags.
*   **API/Response:**
    *   Returns a `Response` object with `Content-Type: text/xml`.

## Dependencies
*   `lib/mdx.ts` (Data retrieval).

## Potential Issues
*   The `baseUrl` relies on an environment variable (`NEXT_PUBLIC_BASE_URL`), which must be correctly set in the environment or it defaults to a hardcoded URL.
*   CDATA escaping is used for titles and descriptions, but should be handled carefully if there is unexpected HTML or special characters in the input data.
