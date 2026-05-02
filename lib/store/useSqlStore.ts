import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface SqlEngineState {
  status: 'initializing' | 'ready' | 'executing' | 'error' | 'volatile';
  lastError: string | null;
  pgHistory: string[];
  duckDbHistory: string[];
  isExecuting: boolean;
  totalRecords: number;
  
  // Actions
  setStatus: (status: SqlEngineState['status'], error?: string | null) => void;
  setExecuting: (executing: boolean) => void;
  setTotalRecords: (count: number) => void;
  addPgHistory: (query: string) => void;
  addDuckDbHistory: (query: string) => void;
  clearHistory: (engine: 'pg' | 'duckdb') => void;
}

export const useSqlStore = create<SqlEngineState>()(
  persist(
    (set) => ({
      status: 'initializing',
      lastError: null,
      pgHistory: [],
      duckDbHistory: [],
      isExecuting: false,
      totalRecords: 0,

      setStatus: (status, error = null) => set({ status, lastError: error }),
      
      setExecuting: (executing: boolean) => set({ isExecuting: executing }),
      
      setTotalRecords: (count: number) => set({ totalRecords: count }),

      addPgHistory: (query: string) => set((state) => {
        if (state.pgHistory[state.pgHistory.length - 1] === query) {
          return state;
        }
        return { pgHistory: [...state.pgHistory, query] };
      }),

      addDuckDbHistory: (query: string) => set((state) => {
        if (state.duckDbHistory[state.duckDbHistory.length - 1] === query) {
          return state;
        }
        return { duckDbHistory: [...state.duckDbHistory, query] };
      }),

      clearHistory: (engine: 'pg' | 'duckdb') => set((state) => {
        if (engine === 'pg') {
          return { pgHistory: [] };
        }
        return { duckDbHistory: [] };
      }),
    }),
    {
      name: 'sysop-sql-history',
      partialize: (state) => ({ 
        pgHistory: state.pgHistory, 
        duckDbHistory: state.duckDbHistory 
      }),
    }
  )
);
