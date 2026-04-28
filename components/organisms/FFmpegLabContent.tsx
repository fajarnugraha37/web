"use client";

import React, { useEffect } from "react";
import { useFFmpegCore } from "@/hooks/useFFmpegCore";
import { useFFmpegLabActions } from "@/hooks/useFFmpegLabActions";
import { PageTransition } from "@/components/atoms/PageTransition";
import { StatusCard } from "@/components/atoms/StatusCard";
import { VideoPreview } from "@/components/atoms/VideoPreview";
import { FfmpegDropzone } from "@/components/molecules/FfmpegDropzone";
import { PresetSelector } from "@/components/molecules/PresetSelector";
import { AdvancedSettingsForm } from "@/components/molecules/AdvancedSettingsForm";
import { FfmpegControlPanel } from "@/components/molecules/FfmpegControlPanel";
import { TerminalLogViewer } from "@/components/molecules/TerminalLogViewer";
import { Film, Cpu, HardDrive, ShieldAlert, Table as TableIcon } from "lucide-react";

/**
 * Organism: FFmpegLabContent
 * The master orchestrator for the FFmpeg-WASM Media Lab.
 */
export function FFmpegLabContent() {
  const {
    status,
    progress,
    logs,
    load,
    exec,
    writeFile,
    readFile,
    deleteFile
  } = useFFmpegCore();

  const {
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
  } = useFFmpegLabActions({
    status,
    writeFile,
    readFile,
    exec,
    deleteFile
  });

  // Load FFmpeg on mount
  useEffect(() => {
    load();
  }, [load]);

  const handleTrimChange = (val: [number, number]) => {
    // Simple format: HH:MM:SS
    const startSec = val[0];
    const duration = val[1] - val[0];
    
    const formatTime = (s: number) => {
      const hrs = Math.floor(s / 3600).toString().padStart(2, '0');
      const mins = Math.floor((s % 3600) / 60).toString().padStart(2, '0');
      const secs = (s % 60).toString().padStart(2, '0');
      return `${hrs}:${mins}:${secs}`;
    };

    setTrimStart(formatTime(startSec));
    setTrimDuration(duration.toString());
  };

  const getTrimValue = (): [number, number] => {
    const parts = trimStart.split(':').map(Number);
    const start = parts[0] * 3600 + parts[1] * 60 + parts[2];
    return [start, start + Number(trimDuration)];
  };

  return (
    <PageTransition>
      <div className="flex flex-col gap-6 py-8 md:py-12 max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <Film className="w-6 h-6 text-accent-secondary" />
              <h1 className="text-3xl md:text-5xl font-black tracking-tighter uppercase">
                MEDIA_PROCESSOR<span className="text-accent-secondary">.EXE</span>
              </h1>
            </div>
            <p className="text-muted-foreground font-mono text-xs uppercase tracking-widest">
              FFmpeg-WASM Node // Signal Transcoding Active
            </p>
          </div>
        </div>

        {/* Status Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatusCard
            icon={<Cpu className="w-4 h-4" />}
            label="KERNEL_STATUS"
            value={status === "loading" ? "BOOTING..." : status.toUpperCase()}
            color={status === "error" ? "text-destructive" : "text-accent-secondary"}
            loading={status === "loading"}
          />
          <StatusCard
            icon={<HardDrive className="w-4 h-4" />}
            label="MEMORY_BUFFER"
            value={inputFile ? `${(inputFile.size / (1024 * 1024)).toFixed(1)}MB` : "EMPTY"}
            color={inputFile ? "text-accent" : "text-muted-foreground"}
          />
          <StatusCard
            icon={<ShieldAlert className="w-4 h-4" />}
            label="COMPUTE_TRUST"
            value="LOCAL_ONLY"
            color="text-accent-tertiary"
          />
          <StatusCard
            icon={<TableIcon className="w-4 h-4" />}
            label="THREAD_LOCK"
            value={typeof SharedArrayBuffer !== 'undefined' ? "MULTITHREAD" : "SINGLE_CORE"}
            color="text-white"
          />
        </div>

        {/* Workspace Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
          {/* Left: Input & Config */}
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="text-[10px] font-mono font-black tracking-widest text-muted-foreground uppercase">
                # SOURCE_SIGNAL_INGEST
              </span>
              {!inputFile ? (
                <FfmpegDropzone onFileSelect={handleFileSelect} />
              ) : (
                <div className="space-y-4">
                  <VideoPreview src={URL.createObjectURL(inputFile)} label="INPUT_SOURCE_PREVIEW" />
                  <button 
                    onClick={() => window.location.reload()} 
                    className="text-[9px] font-mono text-destructive hover:underline uppercase"
                  >
                    [!] FLUSH_BUFFER_AND_RELOAD
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <span className="text-[10px] font-mono font-black tracking-widest text-muted-foreground uppercase">
                # TRANSCODE_PARAMETER_CONFIG
              </span>
              <PresetSelector activeMode={mode} onModeChange={setMode} />
              <AdvancedSettingsForm 
                mode={mode} 
                trimValue={getTrimValue()} 
                onTrimChange={handleTrimChange}
              />
            </div>
          </div>

          {/* Right: Execution & Output */}
          <div className="space-y-6 flex flex-col">
            <FfmpegControlPanel 
              status={status}
              progress={progress}
              onProcess={process}
              outputUrl={outputUrl}
            />

            {outputUrl && (
              <div className="space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <span className="text-[10px] font-mono font-black tracking-widest text-accent uppercase">
                  # OUTPUT_SIGNAL_VERIFIED
                </span>
                {mode === 'AUDIO' ? (
                  <audio src={outputUrl} controls className="w-full" />
                ) : mode === 'GIF' ? (
                  <img src={outputUrl} alt="Output" className="w-full h-auto border border-accent/30 cyber-chamfer" />
                ) : (
                  <VideoPreview src={outputUrl} label="OUTPUT_RESULT" />
                )}
              </div>
            )}

            <div className="flex-grow min-h-[200px]">
               <TerminalLogViewer logs={logs} className="h-full" />
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
