import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { LabFile } from '@/types';

export interface MarkdownDocState {
  files: LabFile[];
  activeFileId: string | null;
  activeContent: string;  // INSTANT: For stats and Editor initialization
  previewContent: string; // DEBOUNCED: For MDX Rendering and TOC
  isLoaded: boolean;
  
  // Actions
  addFile: (name: string, content: string) => string;
  updateContent: (content: string) => void;
  deleteFile: (id: string) => void;
  renameFile: (id: string, newName: string) => void;
  setActiveFile: (id: string) => void;
  duplicateFile: (id: string) => string | undefined;
  updateFileMetadata: (id: string, metadata: any) => void;
  setLoaded: (loaded: boolean) => void;
  hydrateFromServer: (file: LabFile) => void;

  // Internal
  _syncTimeout: NodeJS.Timeout | null;
}

const DEFAULT_FILE: LabFile = {
  id: "default-1",
  name: "README.md",
  content: "# SYSTEM_READY\n\nInitiating secure markdown environment...",
};

export const useMarkdownDocStore = create<MarkdownDocState>()(
  persist(
    (set, get) => ({
      files: [DEFAULT_FILE],
      activeFileId: "default-1",
      activeContent: DEFAULT_FILE.content,
      previewContent: DEFAULT_FILE.content,
      isLoaded: false,
      _syncTimeout: null,

      setLoaded: (loaded: boolean) => set({ isLoaded: loaded }),

      addFile: (name: string, content: string) => {
        const newId = Date.now().toString();
        const newFile: LabFile = { id: newId, name, content };
        set((state) => ({
          files: [...state.files, newFile],
          activeFileId: newId,
          activeContent: content,
          previewContent: content,
        }));
        return newId;
      },

      updateContent: (content: string) => {
        const state = get();
        // 1. Set internal "Fast" state instantly
        set({ activeContent: content });

        // 2. Debounce the heavy "Slow" state sync
        if (state._syncTimeout) clearTimeout(state._syncTimeout);
        
        const timeout = setTimeout(() => {
          const innerState = get();
          if (!innerState.activeFileId) return;

          set({
            previewContent: content,
            files: innerState.files.map((f) =>
              f.id === innerState.activeFileId ? { ...f, content } : f
            ),
            _syncTimeout: null
          });
        }, 300); // 300ms rendering debounce

        set({ _syncTimeout: timeout });
      },

      deleteFile: (id: string) => {
        set((state) => {
          const newFiles = state.files.filter((f) => f.id !== id);
          if (newFiles.length === 0) {
            const fallbackId = Date.now().toString();
            return {
              files: [{ id: fallbackId, name: "untitled.md", content: "" }],
              activeFileId: fallbackId,
              activeContent: "",
              previewContent: "",
            };
          }
          
          if (state.activeFileId === id) {
            return {
              files: newFiles,
              activeFileId: newFiles[0].id,
              activeContent: newFiles[0].content,
              previewContent: newFiles[0].content,
            };
          }
          
          return { files: newFiles };
        });
      },

      renameFile: (id: string, newName: string) => {
        set((state) => ({
          files: state.files.map((f) =>
            f.id === id ? { ...f, name: newName } : f
          ),
        }));
      },

      setActiveFile: (id: string) => {
        const file = get().files.find((f) => f.id === id);
        if (file) {
          set({
            activeFileId: id,
            activeContent: file.content,
            previewContent: file.content,
          });
        }
      },

      duplicateFile: (id: string) => {
        const state = get();
        const original = state.files.find((f) => f.id === id);
        if (!original) return undefined;
        
        const newId = Date.now().toString();
        const newFile: LabFile = {
          id: newId,
          name: `${original.name.replace('.md', '')}_copy.md`,
          content: original.content,
          metadata: original.metadata ? { ...original.metadata } : undefined,
        };
        
        set({
          files: [...state.files, newFile],
          activeFileId: newId,
          activeContent: original.content,
          previewContent: original.content,
        });
        
        return newId;
      },

      updateFileMetadata: (id: string, metadata: any) => {
        set((state) => ({
          files: state.files.map((f) =>
            f.id === id ? { ...f, metadata: { ...f.metadata, ...metadata } } : f
          ),
        }));
      },

      hydrateFromServer: (file: LabFile) => {
        set((state) => {
          const existingIndex = state.files.findIndex(f => f.id === file.id || f.name === file.name);
          let newFiles = [...state.files];
          if (existingIndex >= 0) newFiles[existingIndex] = file;
          else newFiles.push(file);
          
          return {
            files: newFiles,
            activeFileId: file.id,
            activeContent: file.content,
            previewContent: file.content,
          };
        });
      }
    }),
    {
      name: 'sysop-markdown-docs',
      partialize: (state) => ({ files: state.files, activeFileId: state.activeFileId }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          const activeFile = state.files.find(f => f.id === state.activeFileId);
          if (activeFile) {
            state.activeContent = activeFile.content;
            state.previewContent = activeFile.content;
          }
          state.setLoaded(true);
        }
      },
    }
  )
);
