import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type TranslationStatus = 'idle' | 'downloading' | 'loading' | 'ready' | 'translating' | 'error';

export interface TranslationProgressItem {
  file: string;
  progress: number;
  loaded: number;
  total: number;
}

export interface TranslationLog {
  timestamp: number;
  level: 'info' | 'warn' | 'error';
  message: string;
}

export interface TranslationState {
  status: TranslationStatus;
  progressItems: Record<string, TranslationProgressItem>;
  logs: TranslationLog[];
  lastResult: string;
  
  // Transients for throttling
  _pendingProgressItems: Record<string, TranslationProgressItem>;
  _pendingLogs: TranslationLog[];
  _lastUpdate: number;
  
  // Actions
  setStatus: (status: TranslationStatus) => void;
  updateProgress: (payload: TranslationProgressItem) => void;
  addLog: (level: 'info' | 'warn' | 'error', message: string) => void;
  setResult: (result: string) => void;
  clearLogs: () => void;
}

const THROTTLE_MS = 100; // Throttle state updates to 10fps

export const useTranslationStore = create<TranslationState>((set, get) => ({
  status: 'idle',
  progressItems: {},
  logs: [],
  lastResult: '',
  
  _pendingProgressItems: {},
  _pendingLogs: [],
  _lastUpdate: 0,

  setStatus: (status) => set({ status }),
  
  setResult: (lastResult) => set({ lastResult }),

  updateProgress: (payload) => {
    const state = get();
    const newPending = { ...state._pendingProgressItems, [payload.file]: payload };
    const now = Date.now();

    if (now - state._lastUpdate >= THROTTLE_MS) {
      set({ 
        progressItems: { ...state.progressItems, ...newPending },
        _pendingProgressItems: {},
        _lastUpdate: now
      });
    } else {
      // Just accumulate if we're throttling
      set({ _pendingProgressItems: newPending });
      
      // Setup a trailing flush if one isn't pending
      // Wait, setTimeout in Zustand is tricky if we don't clear it, but for a 100ms throttle it's usually okay.
      // A safer way is to let the next render flush it, or just use a simple timer.
      setTimeout(() => {
         const latestState = get();
         if (Object.keys(latestState._pendingProgressItems).length > 0) {
            set({ 
              progressItems: { ...latestState.progressItems, ...latestState._pendingProgressItems },
              _pendingProgressItems: {},
              _lastUpdate: Date.now()
            });
         }
      }, THROTTLE_MS);
    }
  },

  addLog: (level, message) => {
    const state = get();
    const log: TranslationLog = { timestamp: Date.now(), level, message };
    const newPendingLogs = [...state._pendingLogs, log];
    const now = Date.now();

    if (now - state._lastUpdate >= THROTTLE_MS) {
      set({ 
        logs: [...state.logs, ...newPendingLogs].slice(-100), // Keep last 100
        _pendingLogs: [],
        _lastUpdate: now
      });
    } else {
      set({ _pendingLogs: newPendingLogs });
      
      setTimeout(() => {
        const latestState = get();
        if (latestState._pendingLogs.length > 0) {
           set({ 
             logs: [...latestState.logs, ...latestState._pendingLogs].slice(-100),
             _pendingLogs: [],
             _lastUpdate: Date.now()
           });
        }
     }, THROTTLE_MS);
    }
  },

  clearLogs: () => set({ logs: [], progressItems: {} }),
}));
