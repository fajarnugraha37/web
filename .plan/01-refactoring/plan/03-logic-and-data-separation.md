# Logic & Data Separation

## 1. Explicit Separation of Concerns
To ensure components remain testable, reusable, and free of side effects, we enforce a strict separation between UI rendering and business logic.

- **UI Components (Atoms, Molecules, Organisms):** Responsible strictly for receiving data via props and rendering the UI. They emit events via callback props (e.g., `onTagSelect`, `onPageChange`).
- **Custom Hooks (Logic layer):** Extract all derived state, filtering, pagination, and complex effect management into headless hooks.
- **Server Components (Data layer):** Pages (`app/**/page.tsx`) are responsible for fetching data, generating SEO metadata, and passing serialized data down to Client Components.

## 2. Rule: 0% Business Logic in Render
The render function of any UI component must be purely declarative. 

**Anti-Pattern (Current State in `BlogList`):**
```tsx
// Inside BlogList render
const filteredBlogs = blogs.filter(blog => 
  (blog.title.includes(search) || blog.description.includes(search)) &&
  selectedTags.every(tag => blog.tags.includes(tag))
);
```

**Refactored Pattern:**
```tsx
// In useBlogFilter.ts
export const useBlogFilter = (blogs: Blog[], search: string, selectedTags: string[]) => {
  return useMemo(() => {
    // filtering logic with comments explaining complex logic
    return blogs.filter(/* ... */);
  }, [blogs, search, selectedTags]);
};

// In BlogListSection (Organism)
const filteredBlogs = useBlogFilter(blogs, search, selectedTags);
const paginatedBlogs = usePagination(filteredBlogs, currentPage, PAGE_SIZE);

// Render is now clean
return <BlogGrid blogs={paginatedBlogs} />;
```

## 3. Performance Optimization with `useMemo` and `useCallback`
- **`useMemo`:** Must be used for all derived state, specifically for filtering and paginating lists. This prevents expensive recalculations on every re-render when unrelated state (like a modal toggle) changes.
- **`useCallback`:** Use for event handlers passed down to deeply nested children to prevent unnecessary re-renders of pure components.

## 4. Headless Hooks Architecture
Create custom hooks to encapsulate complex behaviors:
- `usePagination`: Handles current page, total pages, next/prev logic, and slicing the array.
- `useSearch`: Handles debounced search input.
- `useIntersectionFilter`: Handles multi-tag intersection logic.

## 5. Type-First Implementation
Always define the TypeScript interfaces for the hook parameters and return values before writing the implementation.

```typescript
// types/pagination.ts
export interface PaginationState {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
}

export interface PaginationActions {
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
}

export interface UsePaginationReturn<T> extends PaginationState, PaginationActions {
  paginatedItems: T[];
}

// hooks/usePagination.ts
export function usePagination<T>(items: T[], pageSize: number): UsePaginationReturn<T> {
  // Implementation...
}
```