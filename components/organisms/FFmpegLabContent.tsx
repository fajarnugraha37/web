"use client";

import React, { useEffect } from "react";
import { useFFmpegCore } from "@/hooks/useFFmpegCore";
import { useFFmpegLabActions } from "@/hooks/useFFmpegLabActions";
import { PageTransition } from "@/components/atoms/PageTransition";
import { StatusCard } from "@/components/atoms/StatusCard";
import { VideoPreview } from "@/components/atoms/VideoPreview";
import { ConfirmationModal } from "@/components/atoms/ConfirmationModal";
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
  const [isFlushModalOpen, setIsFlushModalOpen] = React.useState(false);
  const {
    status,
    progress,
    logs,
    load,
    exec,
    writeFile,
    readFile,
    deleteFile,
    addLog,
    clearLogs
  } = useFFmpegCore();

  const {
    inputFile,
    outputUrl,
    outputName,
    mode,
    setMode,
    duration,
    trimStart,
    setTrimStart,
    trimDuration,
    setTrimDuration,
    gifQuality,
    setGifQuality,
    handleFileSelect,
    process,
  } = useFFmpegLabActions({
    status,
    writeFile,
    readFile,
    exec,
    deleteFile,
    addLog
  });

  // Load FFmpeg on mount
  useEffect(() => {
    load();
  }, [load]);

  const handleTrimChange = (val: [number, number]) => {
    const startSec = val[0];
    const dur = val[1] - val[0];
    
    const formatTime = (s: number) => {
      const hrs = Math.floor(s / 3600).toString().padStart(2, '0');
      const mins = Math.floor((s % 3600) / 60).toString().padStart(2, '0');
      const secs = Math.floor(s % 60).toString().padStart(2, '0');
      return `${hrs}:${mins}:${secs}`;
    };

    setTrimStart(formatTime(startSec));
    setTrimDuration(dur.toString());
  };

  const getTrimValue = (): [number, number] => {
    const parts = trimStart.split(':').map(Number);
    const start = parts[0] * 3600 + parts[1] * 60 + parts[2];
    const durVal = parseInt(trimDuration);
    return [start, start + durVal];
  };

  const isError = status === "error";

  return (
    <PageTransition>
      <div className="flex flex-col gap-6 py-8 md:py-12 max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <Film className="w-6 h-6 text-accent-secondary" />
              <h1 className="text-3xl md:text-5xl font-black tracking-tighter uppercase">
                MEDIA PROCESSOR<span className="text-accent-secondary">.EXE</span>
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
            label="STATUS"
            value={status === "loading" ? "BOOTING..." : status.toUpperCase()}
            color={isError ? "text-destructive" : "text-accent-secondary"}
            loading={status === "loading"}
          />
          <StatusCard
            icon={<HardDrive className="w-4 h-4" />}
            label="BUFFER INFO"
            value={inputFile ? `${(inputFile.size / (1024 * 1024)).toFixed(1)}MB` : "EMPTY"}
            color={inputFile ? "text-accent" : "text-muted-foreground"}
          />
          <StatusCard
            icon={<ShieldAlert className="w-4 h-4" />}
            label="COMPUTE"
            value="LOCAL ONLY"
            color="text-accent-tertiary"
          />
          <StatusCard
            icon={<TableIcon className="w-4 h-4" />}
            label="THREAD LOCK"
            value={typeof SharedArrayBuffer !== 'undefined' ? "MULTITHREAD" : "SINGLE CORE"}
            color="text-white"
          />
        </div>

        {/* Workspace Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
          {/* Left: Input & Config */}
          <div className="space-y-6 flex flex-col">
            <div className="space-y-2">
              <span className="text-[10px] font-mono font-black tracking-widest text-muted-foreground uppercase">
                # SOURCE SIGNAL INGEST
              </span>
              {!inputFile ? (
                <FfmpegDropzone onFileSelect={handleFileSelect} />
              ) : (
                <div className="space-y-4">
                  <VideoPreview src={URL.createObjectURL(inputFile)} label="INPUT SOURCE PREVIEW" />
                  <button 
                    onClick={() => setIsFlushModalOpen(true)} 
                    className="text-[9px] font-mono text-destructive hover:underline uppercase"
                  >
                    [!] FLUSH BUFFER AND RELOAD
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <span className="text-[10px] font-mono font-black tracking-widest text-muted-foreground uppercase">
                # TRANSCODE PARAMETER CONFIG
              </span>
              <PresetSelector activeMode={mode} onModeChange={setMode} />
              <AdvancedSettingsForm 
                mode={mode} 
                duration={duration}
                trimValue={getTrimValue()} 
                onTrimChange={handleTrimChange}
                gifQuality={gifQuality}
                setGifQuality={setGifQuality}
              />
            </div>
          </div>

          {/* Right: Execution & Output */}
          <div className="space-y-6 flex flex-col min-h-[500px]">
            <FfmpegControlPanel 
              status={status}
              progress={progress}
              onProcess={process}
              outputUrl={outputUrl}
              outputName={outputName}
              hasInput={!!inputFile}
            />

            {/* Output or Error Display */}
            <div className="flex-grow flex flex-col gap-4">
              {outputUrl && status === "ready" && (
                <div className="space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <span className="text-[10px] font-mono font-black tracking-widest text-accent uppercase">
                    # OUTPUT SIGNAL VERIFIED
                  </span>
                  <div className="border border-accent/20 bg-accent/5 p-4 cyber-chamfer">
                    {mode === 'AUDIO' ? (
                      <audio src={outputUrl} controls className="w-full" />
                    ) : mode === 'GIF' ? (
                      <img src={outputUrl} alt="Output" className="w-full h-auto border border-accent/30 cyber-chamfer" />
                    ) : (
                      <VideoPreview src={outputUrl} label="OUTPUT RESULT" />
                    )}
                  </div>
                </div>
              )}

              {isError && (
                <div className="p-4 border border-destructive/30 bg-destructive/5 text-destructive space-y-2 cyber-chamfer">
                  <span className="text-[10px] font-mono font-black tracking-widest uppercase flex items-center gap-2">
                    <ShieldAlert className="w-3 h-3" />
                    # CRITICAL EXECUTION FAILURE
                  </span>
                  <p className="text-[9px] font-mono leading-relaxed opacity-80">
                    PROCESS_TERMINATED: UNABLE_TO_RECONSTRUCT_SIGNAL. CHECK_MEMORY_BUFFER_OR_PARAMETERS.
                  </p>
                </div>
              )}

              <TerminalLogViewer logs={logs} onClear={clearLogs} className="flex-grow" />
            </div>
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={isFlushModalOpen}
        onClose={() => setIsFlushModalOpen(false)}
        onConfirm={() => window.location.reload()}
        title="CRITICAL_BUFFER_FLUSH"
        message="This operation will purge the current memory buffer and reset the engine. Any unsaved output will be lost. Proceed?"
        confirmLabel="FLUSH_MEMORY"
        variant="destructive"
      />
    </PageTransition>
  );
}
