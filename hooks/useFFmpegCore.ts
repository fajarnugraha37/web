"use client";

import { useCallback } from "react";
import { toast } from "@/components/atoms/Toast";
import { useFfmpegStore } from "@/lib/store/useFfmpegStore";
import { getFFmpegInstance } from "@/lib/ffmpeg-client";

export type FFmpegStatus = "initializing" | "ready" | "processing" | "error";

/**
 * Hook: useFFmpegCore
 * Refactored to use a module-level singleton to prevent duplicate initialization.
 */
export function useFFmpegCore() {
  const status = useFfmpegStore((state) => state.status);
  const setStatus = useFfmpegStore((state) => state.setStatus);
  const progress = useFfmpegStore((state) => state.progress);
  const setProgress = useFfmpegStore((state) => state.setProgress);
  const logs = useFfmpegStore((state) => state.logs);
  const addLog = useFfmpegStore((state) => state.addLog);
  const clearLogs = useFfmpegStore((state) => state.clearLogs);

  const load = useCallback(async () => {
    // If already loading or ready, don't re-trigger
    if (status !== "initializing") return;
    
    // Check if it was already initialized in the singleton
    try {
      const ffmpeg = await getFFmpegInstance(
        (msg) => addLog(msg),
        (p) => setProgress(p)
      );

      // If we reach here, it's loaded. 
      // Note: If multiple calls hit this simultaneously, only one will finish loading,
      // but all will get the same instance. We use the store to guard UI.
      if (status === "initializing") {
        addLog("System initialized. Mounting WASM filesystem...");
        setStatus("ready");
        addLog("FFmpeg Multithreaded Core loaded. System ready.");
        toast("Media engine online", "success");
      }
    } catch (e: any) {
      if (status !== "error") {
        setStatus("error");
        addLog(`FATAL ERROR: ${e.message}`);
        toast("Failed to initialize media engine", "error");
      }
    }
  }, [status, setStatus, addLog, setProgress]);

  const exec = useCallback(async (args: string[]) => {
    const ffmpeg = await getFFmpegInstance();
    if (!ffmpeg) throw new Error("Engine not ready");
    
    setStatus("processing");
    setProgress(0);
    try {
      addLog(`[EXEC] ffmpeg ${args.join(' ')}`);
      await ffmpeg.exec(args);
      setStatus("ready");
      return true;
    } catch (e: any) {
      setStatus("error");
      addLog(`EXECUTION ERROR: ${e.message}`);
      return false;
    }
  }, [setStatus, setProgress, addLog]);

  const writeFile = useCallback(async (name: string, fileData: Uint8Array) => {
    const ffmpeg = await getFFmpegInstance();
    addLog(`[BUFFER] Writing: ${name}`);
    await ffmpeg.writeFile(name, fileData);
  }, [addLog]);

  const readFile = useCallback(async (name: string): Promise<Uint8Array> => {
    const ffmpeg = await getFFmpegInstance();
    addLog(`[BUFFER] Reading: ${name}`);
    const data = await ffmpeg.readFile(name);
    return data as Uint8Array;
  }, [addLog]);

  const deleteFile = useCallback(async (name: string) => {
    const ffmpeg = await getFFmpegInstance();
    try {
      await ffmpeg.deleteFile(name);
      addLog(`[BUFFER] Purged: ${name}`);
    } catch (e) {
      addLog(`[BUFFER] Warning: Failed to purge ${name}`);
    }
  }, [addLog]);

  return {
    status,
    progress,
    logs,
    load,
    exec,
    writeFile,
    readFile,
    deleteFile,
    addLog,
    clearLogs,
  };
}
