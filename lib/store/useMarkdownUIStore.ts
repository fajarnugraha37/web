import { create } from 'zustand';
import { ViewMode } from '@/types';

export type ModalType = 'import' | 'export' | 'github' | 'rename' | 'search' | 'assets' | 'metadata' | null;

export interface MarkdownUIState {
  viewMode: ViewMode;
  showToc: boolean;
  isFullScreen: boolean;
  activeModal: ModalType;
  
  // Actions
  setViewMode: (mode: ViewMode, isMobile?: boolean) => void;
  setShowToc: (show: boolean) => void;
  toggleToc: () => void;
  setIsFullScreen: (full: boolean) => void;
  toggleFullScreen: () => void;
  openModal: (modal: ModalType) => void;
  closeModal: () => void;
}

export const useMarkdownUIStore = create<MarkdownUIState>((set) => ({
  viewMode: 'split',
  showToc: false,
  isFullScreen: false,
  activeModal: null,

  setViewMode: (mode: ViewMode, isMobile?: boolean) => {
    if (isMobile && mode === 'split') {
      set({ viewMode: 'preview' });
    } else {
      set({ viewMode: mode });
    }
  },
  
  setShowToc: (show: boolean) => set({ showToc: show }),
  
  toggleToc: () => set((state) => ({ showToc: !state.showToc })),
  
  setIsFullScreen: (full: boolean) => set({ isFullScreen: full }),
  
  toggleFullScreen: () => set((state) => ({ isFullScreen: !state.isFullScreen })),
  
  openModal: (modal: ModalType) => set({ activeModal: modal }),
  
  closeModal: () => set({ activeModal: null }),
}));
