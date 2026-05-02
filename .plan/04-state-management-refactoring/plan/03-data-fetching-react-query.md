# React Query Integration (Server State)

## 1. Scope
React Query will completely replace manual `fetch` calls and local `useState` arrays that deal with server-side files (specifically in the Assets Modal and Markdown Lab).

## 2. API Contracts & Hooks

### 2.1. Assets Management (`/api/labs/assets`)
- **Query:** `useAssets()`
  - Fetches the list of available assets.
  - Key: `['assets']`
- **Mutation (Upload):** `useUploadAsset()`
  - Posts `FormData` to the server.
  - On Success: `queryClient.invalidateQueries({ queryKey: ['assets'] })`
  - Optimistic Update: Add to local cache immediately, rollback on failure.
- **Mutation (Delete):** `useDeleteAsset()`
  - Deletes asset by name.
  - On Success: `queryClient.invalidateQueries({ queryKey: ['assets'] })`

### 2.2. Markdown Remote Sync (`/api/labs/markdown`)
- **Query (List):** `useRemoteBlogs(params: { page, query, tags })`
  - Fetches paginated/filtered list of blogs from the server.
  - Key: `['blogs', params]`
- **Query (Single):** `useRemoteBlog(slug)`
  - Fetches a single blog for hydration into the local editor.
  - Key: `['blog', slug]`
- **Mutation (Save):** `useSaveBlog()`
  - Sends local `activeContent` and metadata to the server.
  - On Success: Invalidate `['blogs']` and show a "Saved to Cloud" toast.

## 3. Architectural Rules for Query
- **Custom Hooks Only:** Components MUST NOT call `useQuery` or `useMutation` directly. Create custom hooks (e.g., `export function useAssets() { return useQuery(...) }`).
- **Defensive Data:** Always provide `initialData` or handle `isLoading`/`isError` gracefully in the UI.
- **Separation:** React Query manages the "Remote Truth". Zustand manages the "Local Scratchpad". When a user hits "Save", we push the scratchpad to the truth via Mutation.
