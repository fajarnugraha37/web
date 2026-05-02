# Zustand Store Design (Client State)

## 1. Store Boundaries
We will partition the global state into focused, domain-specific stores to prevent monolithic state objects and unnecessary re-renders.

### 1.1. `useMarkdownDocStore`
- **Responsibility:** Manages the core data of the markdown editor (files, content, active file).
- **Persistence:** Uses `persist` middleware to `localStorage` (key: `sysop-markdown-docs`).
- **Throttling:** Implements internal debouncing/throttling for the `updateContent` action to prevent writing to `localStorage` on every keystroke.
- **TypeScript Interface:**
```typescript
export interface LabFile {
  id: string;
  name: string;
  content: string;
  metadata?: Record<string, any>;
}

export interface MarkdownDocState {
  files: LabFile[];
  activeFileId: string | null;
  // Computed
  activeContent: string;
  // Actions
  addFile: (name: string, content: string) => void;
  updateContent: (id: string, content: string) => void; // Must be throttled
  deleteFile: (id: string) => void;
  renameFile: (id: string, newName: string) => void;
  setActiveFile: (id: string) => void;
  hydrateFromServer: (file: LabFile) => void;
}
```

### 1.2. `useMarkdownUIStore`
- **Responsibility:** Manages transient UI toggles for the markdown lab.
- **Persistence:** None.
- **TypeScript Interface:**
```typescript
export interface MarkdownUIState {
  viewMode: 'editor' | 'split' | 'preview';
  showToc: boolean;
  isFullScreen: boolean;
  activeModal: 'import' | 'export' | 'github' | 'search' | null;
  // Actions
  setViewMode: (mode: 'editor' | 'split' | 'preview') => void;
  toggleToc: () => void;
  toggleFullScreen: () => void;
  openModal: (modal: 'import' | 'export' | 'github' | 'search') => void;
  closeModal: () => void;
}
```

### 1.3. `useTranslationStore`
- **Responsibility:** Manages UI parameters, worker status, and throttled logs/progress for the Translation lab.
- **Persistence:** Partial. `src` and `tgt` languages persist (or sync to URL), but `status`, `logs`, and `progressItems` are transient to prevent storage bloat.
- **TypeScript Interface:**
```typescript
export interface TranslationState {
  status: 'idle' | 'downloading' | 'loading' | 'ready' | 'translating' | 'error';
  progressItems: Record<string, any>;
  logs: any[]; // Max 100 items
  // Actions
  setStatus: (status: TranslationState['status']) => void;
  updateProgress: (payload: any) => void; // Throttled
  addLog: (level: string, message: string) => void; // Throttled
  clearLogs: () => void;
}
```

### 1.4. `useSqlStore` (PostgreSQL & DuckDB)
- **Responsibility:** Manages execution status and query history.
- **WASM Instance Rule:** The actual `PGlite` or `AsyncDuckDB` instances are **strictly excluded** from this store. They remain in module-level singletons.
- **Persistence:** `queryHistory` is persisted to `localStorage`.
- **TypeScript Interface:**
```typescript
export interface SqlEngineState {
  status: 'initializing' | 'ready' | 'executing' | 'error';
  lastError: string | null;
  pgHistory: string[];
  duckDbHistory: string[];
  // Actions
  setStatus: (status: SqlEngineState['status'], error?: string) => void;
  addPgHistory: (query: string) => void;
  addDuckDbHistory: (query: string) => void;
  clearHistory: (engine: 'pg' | 'duckdb') => void;
}
```

### 1.5. `useFfmpegStore`
- **Responsibility:** Manages FFmpeg configuration presets and status. Instances are excluded.
- **Persistence:** Settings are persisted. Logs are transient.
