"use client";

import { useState, useRef, useCallback } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL } from "@ffmpeg/util";
import { toast } from "@/components/atoms/Toast";

export type FFmpegStatus = "idle" | "loading" | "ready" | "processing" | "error";

/**
 * Headless Hook: useFFmpegCore
 * Manages the low-level lifecycle of the FFmpeg WASM instance.
 */
export function useFFmpegCore() {
  const [status, setStatus] = useState<FFmpegStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const ffmpegRef = useRef<FFmpeg | null>(null);

  const load = useCallback(async () => {
    if (ffmpegRef.current) return true;

    try {
      setStatus("loading");
      
      const ffmpeg = new FFmpeg();
      
      ffmpeg.on("log", ({ message }) => {
        setLogs((prev) => [...prev.slice(-99), message]);
      });

      ffmpeg.on("progress", ({ progress }) => {
        setProgress(Math.round(progress * 100));
      });

      const baseURL = window.location.origin + "/ffmpeg";

      // Use Blob URLs for MT mode. This is required by Emscripten to spawn pthread workers correctly 
      // without violating cross-origin constraints within the worker context.
      await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
        workerURL: await toBlobURL(`${baseURL}/ffmpeg-core.worker.js`, "text/javascript"),
      });

      ffmpegRef.current = ffmpeg;
      setStatus("ready");
      toast("FFMPEG_ENGINE_ONLINE", "success");
      return true;
    } catch (err) {
      console.error("FFmpeg load failed:", err);
      setStatus("error");
      toast("FFMPEG_LOAD_FAILED", "error");
      setLogs(prev => [...prev, `[ERROR] Kernel failed to boot: ${err instanceof Error ? err.message : String(err)}`]);
      return false;
    }
  }, []); // Empty dependency array ensures stable function identity

  const exec = useCallback(async (args: string[]) => {
    if (!ffmpegRef.current) {
      const loaded = await load();
      if (!loaded) return null;
    }

    const ffmpeg = ffmpegRef.current!;
    try {
      setStatus("processing");
      setProgress(0);
      const ret = await ffmpeg.exec(args);
      
      if (ret !== 0) {
        console.error(`FFmpeg exited with code ${ret}`);
        setLogs(prev => [...prev, `[ERROR] Process terminated with exit code ${ret}. Possible memory exhaustion (OOM) or invalid parameters.`]);
        setStatus("error");
        toast("FFMPEG_EXECUTION_ERROR", "error");
        return false;
      }
      
      setStatus("ready");
      return true;
    } catch (err) {
      console.error("FFmpeg exec failed", err);
      setStatus("error");
      toast("FFMPEG_EXECUTION_ERROR", "error");
      return false;
    }
  }, [load]);

  const writeFile = useCallback(async (name: string, data: Uint8Array) => {
    if (!ffmpegRef.current) await load();
    return await ffmpegRef.current?.writeFile(name, data);
  }, [load]);

  const readFile = useCallback(async (name: string) => {
    return await ffmpegRef.current?.readFile(name);
  }, []);

  const deleteFile = useCallback(async (name: string) => {
    return await ffmpegRef.current?.deleteFile(name);
  }, []);

  const addLog = useCallback((msg: string) => {
    setLogs(prev => [...prev.slice(-99), msg]);
  }, []);

  const clearLogs = useCallback(() => {
    setLogs([]);
  }, []);

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
