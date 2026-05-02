import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface FfmpegState {
  status: 'initializing' | 'ready' | 'processing' | 'error';
  progress: number;
  logs: string[];
  
  // Settings
  mode: 'extract-audio' | 'gif' | 'compress' | 'trim';
  resolution: string;
  gifQuality: string;
  preset: string;
  trimStart: number;
  trimDuration: number;
  duration: number;
  
  // Transients for throttling
  _pendingLogs: string[];
  _lastUpdate: number;
  
  // Actions
  setStatus: (status: FfmpegState['status']) => void;
  setProgress: (progress: number) => void;
  addLog: (log: string) => void;
  clearLogs: () => void;
  
  setMode: (mode: FfmpegState['mode']) => void;
  setResolution: (res: string) => void;
  setGifQuality: (quality: string) => void;
  setPreset: (preset: string) => void;
  setTrimStart: (start: number) => void;
  setTrimDuration: (duration: number) => void;
  setDuration: (duration: number) => void;
}

const THROTTLE_MS = 100;

export const useFfmpegStore = create<FfmpegState>()(
  persist(
    (set, get) => ({
      status: 'initializing',
      progress: 0,
      logs: [],
      
      mode: 'compress',
      resolution: '1280x720',
      gifQuality: '15',
      preset: 'medium',
      trimStart: 0,
      trimDuration: 5,
      duration: 0,
      
      _pendingLogs: [],
      _lastUpdate: 0,

      setStatus: (status) => set({ status }),
      setProgress: (progress) => set({ progress }),

      addLog: (log) => {
        const state = get();
        const newPendingLogs = [...state._pendingLogs, log];
        const now = Date.now();

        if (now - state._lastUpdate >= THROTTLE_MS) {
          set({ 
            logs: [...state.logs, ...newPendingLogs].slice(-100),
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

      clearLogs: () => set({ logs: [], progress: 0 }),
      
      setMode: (mode) => set({ mode }),
      setResolution: (resolution) => set({ resolution }),
      setGifQuality: (gifQuality) => set({ gifQuality }),
      setPreset: (preset) => set({ preset }),
      setTrimStart: (trimStart) => set({ trimStart }),
      setTrimDuration: (trimDuration) => set({ trimDuration }),
      setDuration: (duration) => set({ duration }),
    }),
    {
      name: 'sysop-ffmpeg-settings',
      partialize: (state) => ({ 
        mode: state.mode, 
        resolution: state.resolution, 
        gifQuality: state.gifQuality, 
        preset: state.preset,
        trimStart: state.trimStart,
        trimDuration: state.trimDuration,
        duration: state.duration
      }),
    }
  )
);
