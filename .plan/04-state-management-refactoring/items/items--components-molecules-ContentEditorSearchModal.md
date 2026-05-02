# Specification: components-molecules-ContentEditorSearchModal.tsx

## 1. Problem Framing
Provides a search interface to find/delete blog posts from the system.

## 2. State Model
- **Ownership:** Local state for search (`query`, `results`, `page`, `totalPages`).
- **Data Flow:** Fetches from `/api/labs/markdown` with query params.

## 3. Findings & Recommendations
- Heavy local state. Migration: Use React Query for the search and pagination state (`useQuery`), making it easier to handle cache invalidation and loading states.
