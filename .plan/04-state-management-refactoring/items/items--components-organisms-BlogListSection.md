# Specification: components-organisms-BlogListSection.tsx

## 1. Problem Framing
Orchestrates the blog index list, including search filtering, tag management, and pagination.

## 2. State Model
- **Ownership:** Heavy local state: `searchQuery`, `selectedTags`, `isTagsExpanded`. Uses `useBlogFilter` and `usePagination` hooks to manage filtering and pagination state. 
- **Data Flow:** Syncs state to URL via `useSearchParams`/`useRouter`.

## 3. Findings & Recommendations
- This organism is a prime candidate for Zustand/React Query. 
- Migration: 
    - Move `searchQuery`, `selectedTags`, `currentPage` to a Zustand store (or persist in URL with improved hook sync).
    - Use React Query to manage the blog list data fetching.
