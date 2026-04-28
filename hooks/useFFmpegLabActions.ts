"use client";

import { useState, useCallback } from "react";
import { fetchFile } from "@ffmpeg/util";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "@/components/atoms/Toast";

export type FFmpegMode = 'GIF' | 'COMPRESS' | 'TRIM' | 'AUDIO' | 'CUSTOM';

interface FFmpegActionsProps {
  status: string;
  writeFile: (name: string, data: Uint8Array) => Promise<any>;
  readFile: (name: string) => Promise<any>;
  exec: (args: string[]) => Promise<any>;
  deleteFile: (name: string) => Promise<any>;
}

/**
 * Headless Hook: useFFmpegLabActions
 * Maps UI presets to exact FFmpeg string templates.
 */
export function useFFmpegLabActions({
  status,
  writeFile,
  readFile,
  exec,
  deleteFile
}: FFmpegActionsProps) {
  const isMobile = useIsMobile();
  const [inputFile, setInputFile] = useState<File | null>(null);
  const [outputUrls, setOutputUrls] = useState<Record<FFmpegMode, string | null>>({
    GIF: null,
    COMPRESS: null,
    TRIM: null,
    AUDIO: null,
    CUSTOM: null,
  });
  const [mode, setMode] = useState<FFmpegMode>('COMPRESS');

  // Trimming & Metadata state
  const [duration, setDuration] = useState(0);
  const [trimStart, setTrimStart] = useState("00:00:00");
  const [trimDuration, setTrimDuration] = useState("10");

  const handleModeChange = useCallback((newMode: FFmpegMode) => {
    setMode(newMode);
  }, []);

  const handleFileSelect = useCallback(async (file: File) => {
    // Mobile Limit: 100MB
    const limit = isMobile ? 100 * 1024 * 1024 : 500 * 1024 * 1024;
    if (file.size > limit) {
      toast(`FILE_TOO_LARGE: MAX ${isMobile ? '100MB' : '500MB'}`, "error");
      return;
    }

    setInputFile(file);
    setOutputUrls({
      GIF: null,
      COMPRESS: null,
      TRIM: null,
      AUDIO: null,
      CUSTOM: null,
    });
    toast("FILE_LOADED", "success");

    // Extract Metadata (Duration)
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.onloadedmetadata = () => {
      setDuration(Math.floor(video.duration));
      setTrimDuration(Math.floor(video.duration).toString());
      URL.revokeObjectURL(video.src);
    };
    video.src = URL.createObjectURL(file);
  }, [isMobile]);

  const process = useCallback(async () => {
    if (!inputFile || (status !== "ready" && status !== "idle")) {
       toast("ENGINE_NOT_READY_OR_NO_INPUT", "error");
       return;
    }

    const inputName = "input.mp4";
    const timestamp = new Date().getTime();
    const sanitizedBaseName = inputFile.name.split('.')[0].replace(/\s+/g, '_');
    const operationName = mode.toLowerCase();
    
    let extension = "mp4";
    if (mode === 'GIF') extension = "gif";
    if (mode === 'AUDIO') extension = "mp3";
    
    const outputFileName = `${sanitizedBaseName}_${operationName}_${timestamp}.${extension}`;
    const virtualOutputName = `output.${extension}`;

    try {
      // 1. Write input file
      await writeFile(inputName, await fetchFile(inputFile));

      let success = false;
      switch (mode) {
        case 'GIF':
          // High-Efficiency Single-Pass GIF (240p, 8fps)
          const gifArgs = [
            "-i", inputName, 
            "-ss", trimStart, 
            "-t", trimDuration, 
            "-vf", "fps=8,scale=240:-1:flags=lanczos", 
            "-f", "gif",
            "-threads", "4",
            "-y",
            virtualOutputName
          ];
          success = await exec(gifArgs);
          break;

        case 'AUDIO':
          const audioArgs = ["-i", inputName, "-ss", trimStart, "-t", trimDuration, "-vn", "-c:a", "libmp3lame", "-q:a", "2", "-threads", "4", "-y", virtualOutputName];
          success = await exec(audioArgs);
          break;

        case 'TRIM':
          const trimArgs = ["-i", inputName, "-ss", trimStart, "-t", trimDuration, "-c", "copy", "-threads", "4", "-y", virtualOutputName];
          success = await exec(trimArgs);
          break;

        case 'COMPRESS':
        default:
          const compArgs = ["-i", inputName, "-vcodec", "libx264", "-crf", "28", "-preset", "faster", "-threads", "4", "-y", virtualOutputName];
          success = await exec(compArgs);
          break;
      }
      
      if (success) {
        // [STRATEGY: CLEAN SLATE] 
        // Delete input file IMMEDIATELY after execution to free up WASM Heap for the readFile operation.
        await deleteFile(inputName).catch(() => {});

        try {
          // 3. Read output
          const data = await readFile(virtualOutputName);
          if (data) {
            const blobType = mode === 'GIF' ? 'image/gif' : mode === 'AUDIO' ? 'audio/mpeg' : 'video/mp4';
            const url = URL.createObjectURL(new Blob([data.buffer], { type: blobType }));
            setOutputUrls(prev => ({ ...prev, [mode]: url }));
            toast("TRANSCODE_COMPLETE", "success");
            return { url, filename: outputFileName };
          }
        } catch (readErr) {
          console.error("Failed to read output file:", readErr);
          toast("OUTPUT_READ_ERROR", "error");
        }
      }
    } catch (err) {
      console.error("Transcoding pipeline failed:", err);
      toast("TRANSCODE_FAILED", "error");
    } finally {
      // 4. Defensive Cleanup of output only (input was handled above)
      try {
        await deleteFile(virtualOutputName).catch(() => {});
      } catch (e) {
        // Silently ignore cleanup errors
      }
    }
  }, [inputFile, mode, trimStart, trimDuration, status, writeFile, readFile, exec, deleteFile]);

  return {
    inputFile,
    outputUrl: outputUrls[mode],
    mode,
    setMode: handleModeChange,
    duration,
    trimStart,
    setTrimStart,
    trimDuration,
    setTrimDuration,
    handleFileSelect,
    process,
  };
}
