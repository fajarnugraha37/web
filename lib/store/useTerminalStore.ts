import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface TerminalState {
  output: string[];
  history: string[];
  
  // Actions
  addOutput: (lines: string[]) => void;
  clearOutput: () => void;
  addHistory: (cmd: string) => void;
  clearHistory: () => void;
}

export const useTerminalStore = create<TerminalState>()(
  persist(
    (set) => ({
      output: [
        "SYSTEM_BOOT_SEQUENCE_INITIATED...",
        "KERNEL_VERSION: 1.0.4-NEON",
        "ESTABLISHING_SECURE_CONNECTION...",
        "ACCESS_GRANTED.",
        " ",
        "Type 'help' to see available commands.",
        " "
      ],
      history: [],

      addOutput: (lines) => set((state) => ({ 
        output: [...state.output, ...lines] 
      })),

      clearOutput: () => set({ 
        output: ["Terminal cleared."] 
      }),

      addHistory: (cmd) => set((state) => {
        if (state.history[state.history.length - 1] === cmd) return state;
        return { history: [...state.history, cmd] };
      }),

      clearHistory: () => set({ history: [] }),
    }),
    {
      name: 'sysop-terminal-state',
    }
  )
);
