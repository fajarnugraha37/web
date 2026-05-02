"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { fetchFile } from "@ffmpeg/util";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "@/components/atoms/Toast";
import { useFfmpegStore } from "@/lib/store/useFfmpegStore";

export type FFmpegMode = 'GIF' | 'COMPRESS' | 'TRIM' | 'AUDIO' | 'CUSTOM';
export type VideoResolution = 'ORIGINAL' | '1080P' | '720P' | '480P';
export type EncoderPreset = 'ultrafast' | 'faster' | 'medium' | 'slower';

interface UseFFmpegLabActionsProps {
  status: "initializing" | "ready" | "processing" | "error" | "volatile" | "idle";
  writeFile: (name: string, data: Uint8Array) => Promise<void>;
  readFile: (name: string) => Promise<Uint8Array>;
  deleteFile: (name: string) => Promise<void>;
  exec: (args: string[]) => Promise<boolean>;
  addLog: (msg: string) => void;
}

export function useFFmpegLabActions({
  status,
  writeFile,
  readFile,
  deleteFile,
  exec,
  addLog
}: UseFFmpegLabActionsProps) {
  const isMobile = useIsMobile();
  
  // Non-serializable state kept local
  const [inputFile, setInputFile] = useState<File | null>(null);
  const [inputUrl, setInputUrl] = useState<string | null>(null);
  const [outputUrls, setOutputUrls] = useState<Record<string, string | null>>({
    GIF: null,
    COMPRESS: null,
    TRIM: null,
    AUDIO: null,
    CUSTOM: null,
  });
  const [outputNames, setOutputNames] = useState<Record<string, string | null>>({
    GIF: null,
    COMPRESS: null,
    TRIM: null,
    AUDIO: null,
    CUSTOM: null,
  });

  // Serializable settings from Zustand
  const mode = useFfmpegStore(state => state.mode) as FFmpegMode;
  const setMode = useFfmpegStore(state => state.setMode);
  const resolution = useFfmpegStore(state => state.resolution) as VideoResolution;
  const setResolution = useFfmpegStore(state => state.setResolution);
  const gifQuality = useFfmpegStore(state => state.gifQuality);
  const setGifQuality = useFfmpegStore(state => state.setGifQuality);
  const preset = useFfmpegStore(state => state.preset) as EncoderPreset;
  const setPreset = useFfmpegStore(state => state.setPreset);
  const trimStart = useFfmpegStore(state => state.trimStart);
  const setTrimStart = useFfmpegStore(state => state.setTrimStart);
  const trimDuration = useFfmpegStore(state => state.trimDuration);
  const setTrimDuration = useFfmpegStore(state => state.setTrimDuration);
  const duration = useFfmpegStore(state => state.duration);
  const setDuration = useFfmpegStore(state => state.setDuration);

  // Manage Input URL Lifecycle
  useEffect(() => {
    if (!inputFile) {
      if (inputUrl) URL.revokeObjectURL(inputUrl);
      setInputUrl(null);
      return;
    }

    const url = URL.createObjectURL(inputFile);
    setInputUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [inputFile]);

  const reset = useCallback(() => {
    setInputFile(null);
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
    setDuration(0);
    toast("BUFFER_FLUSHED", "success");
  }, [setDuration]);

  const getScaleFilter = useCallback(() => {
    switch (resolution) {
      case '1080P': return "scale=1920:-2";
      case '720P': return "scale=1280:-2";
      case '480P': return "scale=854:-2";
      default: return null;
    }
  }, [resolution]);

  const handleModeChange = useCallback((newMode: FFmpegMode) => {
    setMode(newMode as any);
  }, [setMode]);

  const handleFileSelect = useCallback(async (file: File) => {
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

    const video = document.createElement('video');
    video.preload = 'metadata';
    video.onloadedmetadata = () => {
      const dur = Math.floor(video.duration);
      setDuration(dur);
      setTrimDuration(dur);
    };
    video.src = URL.createObjectURL(file);
  }, [isMobile, setTrimDuration, setDuration]);

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
      await writeFile(inputName, await fetchFile(inputFile));

      const maxThreads = typeof navigator !== 'undefined' && navigator.hardwareConcurrency
        ? Math.min(4, navigator.hardwareConcurrency).toString()
        : "2";

      const scaleFilter = getScaleFilter();

      let success = false;
      
      const tStartStr = trimStart.toString();
      const tDurStr = trimDuration.toString();

      switch (mode) {
        case 'GIF':
          if (gifQuality === 'HIGH') {
            const paletteName = `palette_${timestamp}.png`;
            const pass1Args = [
              "-loglevel", "debug",
              "-ss", tStartStr,
              "-t", tDurStr,
              "-i", inputName,
              "-vf", "fps=15,scale=480:-1:flags=lanczos,palettegen",
              "-frames:v", "1",
              "-update", "1",
              "-threads", maxThreads,
              "-y", paletteName
            ];
            addLog(`[EXEC] FFmpeg Pass 1: ${pass1Args.join(" ")}`);
            const pass1Success = await exec(pass1Args);

            if (pass1Success) {
              const pass2Args = [
                "-ss", tStartStr,
                "-t", tDurStr,
                "-i", inputName,
                "-i", paletteName,
                "-filter_complex", "[0:v]fps=15,scale=480:-1:flags=lanczos[x];[x][1:v]paletteuse",
                "-f", "gif",
                "-threads", "1",
                "-y", virtualOutputName
              ];
              addLog(`[EXEC] FFmpeg Pass 2: ${pass2Args.join(" ")}`);
              success = await exec(pass2Args);
            }
            await deleteFile(paletteName).catch(() => {});
          } else {
            const gifArgs = [
              "-loglevel", "debug",
              "-ss", tStartStr,
              "-t", tDurStr,
              "-i", inputName,
              "-vf", "fps=8,scale=240:-1:flags=lanczos",
              "-f", "gif",
              "-threads", maxThreads,
              "-y",
              virtualOutputName
            ];
            addLog(`[EXEC] FFmpeg Single-Pass GIF: ${gifArgs.join(" ")}`);
            success = await exec(gifArgs);
          }
          break;

        case 'AUDIO':
          const audioArgs = ["-loglevel", "debug", "-ss", tStartStr, "-t", tDurStr, "-i", inputName, "-vn", "-c:a", "libmp3lame", "-q:a", "2", "-threads", maxThreads, "-y", virtualOutputName];
          addLog(`[EXEC] FFmpeg Audio: ${audioArgs.join(" ")}`);
          success = await exec(audioArgs);
          break;

        case 'TRIM':
          const trimVf = scaleFilter ? [scaleFilter] : [];
          const trimArgs = [
            "-loglevel", "debug",
            "-i", inputName,
            "-ss", tStartStr,
            "-t", tDurStr,
            ...(trimVf.length ? ["-vf", trimVf.join(",")] : []),
            "-c:v", "libx264",
            "-crf", "23",
            "-preset", preset,
            "-threads", maxThreads,
            "-y", virtualOutputName
          ];
          addLog(`[EXEC] FFmpeg Trim: ${trimArgs.join(" ")}`);
          success = await exec(trimArgs);
          break;

        case 'COMPRESS':
        default:
          const compVf = scaleFilter ? [scaleFilter] : [];
          const compArgs = [
            "-loglevel", "debug",
            "-i", inputName,
            ...(compVf.length ? ["-vf", compVf.join(",")] : []),
            "-vcodec", "libx264",
            "-crf", "28",
            "-preset", preset,
            "-threads", maxThreads,
            "-y", virtualOutputName
          ];
          addLog(`[EXEC] FFmpeg Compress: ${compArgs.join(" ")}`);
          success = await exec(compArgs);
          break;
      }

      if (success) {
        await deleteFile(inputName).catch(() => {});

        try {
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
      } else {
        toast("TRANSCODE_FAILED", "error");
      }
    } catch (err) {
      console.error("Transcoding pipeline failed:", err);
      toast("TRANSCODE_FAILED", "error");
    } finally {
      try {
        await deleteFile(virtualOutputName).catch(() => {});
      } catch (e) {
        console.error('[FFMPEG] CLEANUP FILE FAILED: ', e);
      }
    }
  }, [inputFile, mode, trimStart, trimDuration, status, writeFile, readFile, exec, deleteFile, gifQuality, resolution, preset, getScaleFilter, addLog]);

  return {
    inputFile,
    inputUrl,
    outputUrl: outputUrls[mode],
    outputName: outputNames[mode],
    mode,
    setMode: handleModeChange,
    duration,
    trimStart: trimStart.toString(),
    setTrimStart,
    trimDuration: trimDuration.toString(),
    setTrimDuration,
    gifQuality,
    setGifQuality,
    resolution,
    setResolution,
    preset,
    setPreset,
    handleFileSelect,
    process,
    reset,
  };
}
