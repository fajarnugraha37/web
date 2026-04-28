"use client";

import { useState, useCallback, useMemo } from "react";
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
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [mode, setMode] = useState<FFmpegMode>('COMPRESS');

  // Trimming state
  const [trimStart, setTrimStart] = useState("00:00:00");
  const [trimDuration, setTrimDuration] = useState("10");

  const handleFileSelect = useCallback((file: File) => {
    // Mobile Limit: 100MB
    const limit = isMobile ? 100 * 1024 * 1024 : 500 * 1024 * 1024;
    if (file.size > limit) {
      toast(`FILE_TOO_LARGE: MAX ${isMobile ? '100MB' : '500MB'}`, "error");
      return;
    }
    setInputFile(file);
    setOutputUrl(null);
    toast("FILE_LOADED", "success");
  }, [isMobile]);

  const process = useCallback(async () => {
    if (!inputFile || status === "processing") return;

    try {
      const inputName = "input.mp4"; // Simplified naming as per plan
      let outputName = "output.mp4";
      let args: string[] = [];

      // Write input file to memory
      await writeFile(inputName, await fetchFile(inputFile));

      switch (mode) {
        case 'GIF':
          outputName = "output.gif";
          args = ["-i", inputName, "-vf", "fps=15,scale=480:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse", "-loop", "0", outputName];
          break;
        case 'AUDIO':
          outputName = "output.mp3";
          args = ["-i", inputName, "-vn", "-c:a", "libmp3lame", "-q:a", "2", outputName];
          break;
        case 'TRIM':
          // ss and t BEFORE input for fast seeking
          args = ["-ss", trimStart, "-t", trimDuration, "-i", inputName, "-c", "copy", outputName];
          break;
        case 'COMPRESS':
        default:
          args = ["-i", inputName, "-vcodec", "libx264", "-crf", "28", "-preset", "faster", outputName];
          break;
      }

      const success = await exec(args);
      if (success) {
        const data = await readFile(outputName);
        const url = URL.createObjectURL(new Blob([data.buffer], { type: mode === 'GIF' ? 'image/gif' : mode === 'AUDIO' ? 'audio/mpeg' : 'video/mp4' }));
        setOutputUrl(url);
        toast("TRANSCODE_COMPLETE", "success");
      }

      // Cleanup
      await deleteFile(inputName);
      await deleteFile(outputName);
    } catch (err) {
      console.error("Transcoding failed", err);
      toast("TRANSCODE_FAILED", "error");
    }
  }, [inputFile, mode, trimStart, trimDuration, status, writeFile, readFile, exec, deleteFile]);

  return {
    inputFile,
    outputUrl,
    mode,
    setMode,
    trimStart,
    setTrimStart,
    trimDuration,
    setTrimDuration,
    handleFileSelect,
    process,
  };
}
