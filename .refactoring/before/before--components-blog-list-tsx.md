# Specification: components/BlogList.tsx

## Overview
The `BlogList` component renders a searchable, filterable list of blog posts with client-side pagination. It includes a sidebar for searching and tag filtering.

## Functionality
*   **User Interface:**
    *   **Sidebar:** Search input field, list of available tags with toggling capability.
    *   **Content:** Grid/List of blog preview cards with date, tags, title, and description.
    *   **Pagination:** UI for navigating through paginated blog entries.
*   **Navigation:**
    *   Internal pagination controls; clicking a blog post card navigates to `/blogs/[slug]`.

## Behavior
*   Implements real-time filtering via text search and multi-tag filtering (intersection).
*   Calculates pagination based on `PAGE_SIZE` (set to 5).
*   Scrolls back to the top of the list upon page navigation.
*   Mobile-responsive tag filtering (expandable on mobile).

## State Management
*   `search`: Input value for filtering posts by title/description.
*   `selectedTags`: Array of tags currently selected for intersection filtering.
*   `page`: Current pagination page.
*   `isTagsExpanded`: Mobile-specific state for toggling the tags visibility.

## Page/Component Structure
*   `aside` (Filters Sidebar)
    *   `input` (Search)
    *   `div` (Tag list wrapper)
        *   Toggles for tags
*   `div` (Blog List)
    *   List of posts mapped from `pagedBlogs`
    *   Pagination controls (buttons)

## Logic & Data Handling
*   **Filtering:** Filters `blogs` prop using `Array.filter`, `Array.includes`, and `Array.every` for logic.
*   **Pagination:** Slices the filtered blog array based on `page` and `PAGE_SIZE`.
*   **Scroll Management:** `listTopRef` used to ensure the list header is visible when moving between pages.

## Dependencies
*   `hooks/use-mobile.ts` (Mobile detection).
*   `lucide-react` (Icons).
*   `motion/react` (Animations).
*   `next/link`.

## Potential Issues
*   **Gendut (Fat) Component:** Handles filtering, pagination, mobile-responsive layout, and rendering all in one file.
*   **Performance:** `filteredBlogs` and `pagedBlogs` are re-calculated on every render, which is acceptable for small blog archives but should be memoized (`useMemo`) as the archive scales.
*   **Tight Coupling:** Pagination and filtering logic is directly embedded in the component.
*   **DIY Anti-pattern:** Pagination logic (first/last, prev/next, range) is manually implemented rather than using a standard pagination library.
