# Specification: hooks/useBlogFilter.ts

## 1. Problem Framing
Handles filtering logic (search query and tag intersection) for the blog list.

## 2. State Model
- **Ownership:** Derived state.

## 3. Findings & Recommendations
- This logic is currently used within `BlogListSection` as a hook. It's essentially derived from state passed as props.
- Migration: This logic could be cleanly migrated to a "query" pattern in React Query/Zustand if the blog list becomes more complex, but as a pure data-transformer hook, it is fine as-is.
