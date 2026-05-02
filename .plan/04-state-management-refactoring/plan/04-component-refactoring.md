# Component Refactoring Strategy

## 1. Dismantling Monoliths
The primary target for refactoring is `MarkdownPlaygroundContent.tsx`, which currently acts as a "God Component".

### Strategy for `MarkdownPlaygroundContent`:
1. **Remove Local State:** Strip out all `useState` and `useRef` related to file management. Replace them with selectors from `useMarkdownDocStore` and `useMarkdownUIStore`.
2. **Component Extraction:**
   - Extract the Sidebar (File Explorer) into a dedicated `MarkdownSidebar` organism.
   - Extract the Editor area into `MarkdownEditorArea` organism.
   - Extract the Preview area into `MarkdownPreviewArea` organism.
3. **Pure Composition:** `MarkdownPlaygroundContent` should only compose these three organisms and handle the layout grid based on `viewMode` from the store.

## 2. Enforcing 0% Logic in Render
**Before (Anti-pattern):**
```tsx
// Inside Component
const handleSave = async () => {
  setLoading(true);
  try {
     await fetch('/api/save', { body: JSON.stringify({ content: activeContent }) });
     setFiles(prev => prev.map(f => f.id === activeId ? {...f, saved: true} : f));
  } finally {
     setLoading(false);
  }
}
return <Button onClick={handleSave}>{loading ? 'Saving' : 'Save'}</Button>
```

**After (Refactored Pattern):**
```tsx
// In hooks/useMarkdownMutations.ts
export function useSaveDraft() {
  const { mutate, isPending } = useMutation({ ... });
  return { save: mutate, isSaving: isPending };
}

// Inside Component
const { save, isSaving } = useSaveDraft();
const content = useMarkdownDocStore(state => state.activeContent);

return <Button onClick={() => save(content)} disabled={isSaving}>
         {isSaving ? 'Saving...' : 'Save'}
       </Button>
```

## 3. UI/UX Consistency (Defensive Handling)
- Ensure every data-fetching component utilizes an `<EmptyState />` or `<LoadingSkeleton />`.
- Use `<ConfirmationModal />` (already exists as an Atom) for any destructive action (Delete Asset, Nuke DB, Flush Memory).
