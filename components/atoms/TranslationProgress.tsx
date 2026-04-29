import React from 'react';
import { TranslationProgress as ProgressType } from '@/hooks/useTranslationWorker';

interface TranslationProgressProps {
  progressData: ProgressType | null;
}

export function TranslationProgress({ progressData }: TranslationProgressProps) {
  if (!progressData) {
    return null;
  }

  // Cap at 100%
  const percentage = Math.min(Math.round(progressData.progress), 100);
  
  // Calculate total MB if available
  const loadedMB = progressData.loaded ? (progressData.loaded / 1024 / 1024).toFixed(1) : 0;
  const totalMB = progressData.total ? (progressData.total / 1024 / 1024).toFixed(1) : 0;

  return (
    <div className="w-full flex flex-col gap-2 font-mono text-xs">
      <div className="flex justify-between items-center text-accent">
        <span className="truncate pr-4 flex-1">
          {progressData.file || "model_q4.onnx"}
        </span>
        <span className="shrink-0">{percentage}%</span>
      </div>
      
      {/* Determinate linear progress bar */}
      <div className="h-1 w-full bg-muted overflow-hidden">
        <div 
          className="h-full bg-accent transition-all duration-150 ease-out shadow-[0_0_8px_rgba(0,255,136,0.6)]"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="flex justify-between text-[10px] text-muted-foreground uppercase tracking-widest">
        <span>Downloading...</span>
        {progressData.total ? <span>{loadedMB}MB / {totalMB}MB</span> : null}
      </div>
    </div>
  );
}
