"use client";

import { useState, useCallback } from "react";
import { fetchFile } from "@ffmpeg/util";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "@/components/atoms/Toast";

export type FFmpegMode = 'GIF' | 'COMPRESS' | 'TRIM' | 'AUDIO' | 'CUSTOM';
export type VideoResolution = 'ORIGINAL' | '1080P' | '720P' | '480P';
export type EncoderPreset = 'ultrafast' | 'faster' | 'medium' | 'slower';

interface FFmpegActionsProps {
  status: string;
  writeFile: (name: string, data: Uint8Array) => Promise<any>;
  readFile: (name: string) => Promise<any>;
  exec: (args: string[]) => Promise<any>;
  deleteFile: (name: string) => Promise<any>;
  addLog: (msg: string) => void;
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
  deleteFile,
  addLog
}: FFmpegActionsProps) {
  const isMobile = useIsMobile();
  const [inputFile, setInputFile] = useState<File | null>(null);
  
  // Advanced Settings State
  const [resolution, setResolution] = useState<VideoResolution>('ORIGINAL');
  const [preset, setPreset] = useState<EncoderPreset>('faster');
  const [gifQuality, setGifQuality] = useState<'HIGH' | 'PERFORMANCE'>('PERFORMANCE');

  const [outputUrls, setOutputUrls] = useState<Record<FFmpegMode, string | null>>({
    GIF: null,
    COMPRESS: null,
    TRIM: null,
    AUDIO: null,
    CUSTOM: null,
  });
  const [outputNames, setOutputNames] = useState<Record<FFmpegMode, string | null>>({
    GIF: null,
    COMPRESS: null,
    TRIM: null,
    AUDIO: null,
    CUSTOM: null,
  });
  const [mode, setMode] = useState<FFmpegMode>('COMPRESS');

  // Helper to map resolution to FFmpeg scale filter
  const getScaleFilter = useCallback(() => {
    switch (resolution) {
      case '1080P': return "scale=1920:-2";
      case '720P': return "scale=1280:-2";
      case '480P': return "scale=854:-2";
      default: return null;
    }
  }, [resolution]);

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
    setOutputNames({
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

      // Determine optimal threads based on hardware concurrency (max 4 to avoid resource starvation)
      const maxThreads = typeof navigator !== 'undefined' && navigator.hardwareConcurrency 
        ? Math.min(4, navigator.hardwareConcurrency).toString() 
        : "2";

      const scaleFilter = getScaleFilter();

      let success = false;
      switch (mode) {
        case 'GIF':
          if (gifQuality === 'HIGH') {
            // High-Quality Sequential 2-Pass GIF (480p, 15fps)
            const paletteName = `palette_${timestamp}.png`;
            
            // Pass 1: Generate palette
            const pass1Args = [
              "-ss", trimStart, 
              "-t", trimDuration, 
              "-i", inputName, 
              "-vf", "fps=15,scale=480:-1:flags=lanczos,palettegen", 
              "-frames:v", "1",
              "-update", "1",
              "-threads", maxThreads,
              "-y", paletteName
            ];
            
            console.log("[DEBUG] Pass 1 Args:", pass1Args.join(" "));
            addLog(`[EXEC] FFmpeg Pass 1 (Palettegen): ${pass1Args.join(" ")}`);
            const pass1Success = await exec(pass1Args);
            
            if (pass1Success) {
              // Pass 2: Generate GIF using the palette
              const pass2Args = [
                "-ss", trimStart, 
                "-t", trimDuration, 
                "-i", inputName, 
                "-i", paletteName, 
                "-filter_complex", "[0:v]fps=15,scale=480:-1:flags=lanczos[x];[x][1:v]paletteuse", 
                "-f", "gif",
                "-threads", "1", 
                "-y", virtualOutputName
              ];
              console.log("[DEBUG] Pass 2 Args:", pass2Args.join(" "));
              addLog(`[EXEC] FFmpeg Pass 2 (Paletteuse): ${pass2Args.join(" ")}`);
              success = await exec(pass2Args);
            }
            
            // Cleanup palette
            await deleteFile(paletteName).catch(() => {});
          } else {
            // High-Efficiency Single-Pass GIF (240p, 8fps)
            const gifArgs = [
              "-ss", trimStart, 
              "-t", trimDuration, 
              "-i", inputName, 
              "-vf", "fps=8,scale=240:-1:flags=lanczos", 
              "-f", "gif",
              "-threads", maxThreads,
              "-y",
              virtualOutputName
            ];
            console.log("[DEBUG] Single-Pass GIF Args:", gifArgs.join(" "));
            addLog(`[EXEC] FFmpeg Single-Pass GIF: ${gifArgs.join(" ")}`);
            success = await exec(gifArgs);
          }
          break;

        case 'AUDIO':
          const audioArgs = ["-ss", trimStart, "-t", trimDuration, "-i", inputName, "-vn", "-c:a", "libmp3lame", "-q:a", "2", "-threads", maxThreads, "-y", virtualOutputName];
          console.log("[DEBUG] Audio Args:", audioArgs.join(" "));
          addLog(`[EXEC] FFmpeg Audio: ${audioArgs.join(" ")}`);
          success = await exec(audioArgs);
          break;

        case 'TRIM':
          const trimVf = scaleFilter ? [scaleFilter] : [];
          const trimArgs = [
            "-i", inputName, 
            "-ss", trimStart, 
            "-t", trimDuration, 
            ...(trimVf.length ? ["-vf", trimVf.join(",")] : []),
            "-c:v", "libx264", 
            "-crf", "23",
            "-preset", preset,
            "-threads", maxThreads, 
            "-y", virtualOutputName
          ];
          console.log("[DEBUG] Trim Args:", trimArgs.join(" "));
          addLog(`[EXEC] FFmpeg Trim: ${trimArgs.join(" ")}`);
          success = await exec(trimArgs);
          break;

        case 'COMPRESS':
        default:
          const compVf = scaleFilter ? [scaleFilter] : [];
          const compArgs = [
            "-i", inputName, 
            ...(compVf.length ? ["-vf", compVf.join(",")] : []),
            "-vcodec", "libx264", 
            "-crf", "28", 
            "-preset", preset, 
            "-threads", maxThreads, 
            "-y", virtualOutputName
          ];
          console.log("[DEBUG] Compress Args:", compArgs.join(" "));
          addLog(`[EXEC] FFmpeg Compress: ${compArgs.join(" ")}`);
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
            setOutputNames(prev => ({ ...prev, [mode]: outputFileName }));
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
  }, [inputFile, mode, trimStart, trimDuration, status, writeFile, readFile, exec, deleteFile, gifQuality, resolution, preset, getScaleFilter]);

  return {
    inputFile,
    outputUrl: outputUrls[mode],
    outputName: outputNames[mode],
    mode,
    setMode: handleModeChange,
    duration,
    trimStart,
    setTrimStart,
    trimDuration,
    setTrimDuration,
    gifQuality,
    setGifQuality,
    resolution,
    setResolution,
    preset,
    setPreset,
    handleFileSelect,
    process,
  };
}
