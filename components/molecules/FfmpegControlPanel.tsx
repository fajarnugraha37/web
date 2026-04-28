"use client";

import React from "react";
import { ProgressBar } from "@/components/atoms/ProgressBar";
import { Button } from "@/components/atoms/Button";
import { Play, Download, XCircle, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface FfmpegControlPanelProps {
  status: string;
  progress: number;
  onProcess: () => Promise<any>;
  onReset?: () => void;
  outputUrl: string | null;
  outputName?: string | null;
  hasInput?: boolean;
  className?: string;
}

/**
 * Molecule: FfmpegControlPanel
 * Primary action zone for initiating and monitoring the transcode process.
 */
export function FfmpegControlPanel({
  status,
  progress,
  onProcess,
  onReset,
  outputUrl,
  outputName,
  hasInput,
  className
}: FfmpegControlPanelProps) {
  const isProcessing = status === "processing";

  const handleExecute = async () => {
    await onProcess();
  };

  return (
    <div className={cn("space-y-6 p-6 border border-border/30 bg-card/20 cyber-chamfer", className)}>
      {/* Action Header */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[10px] font-mono font-black tracking-widest text-muted-foreground uppercase">
            # TASK EXECUTION UNIT
          </span>
          <h2 className="text-xl font-black tracking-tighter uppercase">
            {!hasInput ? "INPUT REQUIRED" : outputUrl ? "UPLINK READY" : isProcessing ? "ENCODING SIGNAL" : "WAITING FOR COMMAND"}
          </h2>
        </div>

        <div className="flex gap-2">
          {outputUrl && (
            <a 
              href={outputUrl} 
              download={outputName || "output"} 
              className="flex items-center gap-2 px-4 py-2 bg-accent text-black font-mono text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all cyber-chamfer-sm"
            >
              <Download className="w-3 h-3" />
              RETRIEVE FILE
            </a>
          )}
          
          {hasInput && (
            <Button
              onClick={handleExecute}
              disabled={isProcessing || status === "loading" || status === "error"}
              variant="default"
              className="px-6"
            >
              {isProcessing ? (
                <span className="flex items-center gap-2">
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  PROCESSING...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Play className="w-3 h-3" />
                  EXECUTE
                </span>
              )}
            </Button>
          )}

          {onReset && (
            <button 
              onClick={onReset}
              className="p-2 border border-border/30 text-muted-foreground hover:text-white hover:border-accent transition-all cyber-chamfer-sm"
            >
              <XCircle className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Progress Visualization */}
      {(isProcessing || (progress > 0 && progress < 100)) && (
        <ProgressBar value={progress} label="NODE_THROUGHPUT" color="bg-accent-secondary" />
      )}
    </div>
  );
}
