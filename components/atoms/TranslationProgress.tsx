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
  const percentage = Math.min(Math.round(progressData.progress || 0), 100);
  
  // Calculate total MB if available
  const loadedMB = progressData.loaded ? (progressData.loaded / 1024 / 1024).toFixed(1) : 0;
  const totalMB = progressData.total ? (progressData.total / 1024 / 1024).toFixed(1) : 0;

  return (
    <div className="w-full flex flex-col gap-1 font-mono text-xs mb-2">
      <div className="flex justify-between items-center text-foreground">
        <span className="truncate pr-4 flex-1">
          {progressData.file || "model_q4.onnx"}
        </span>
        <span className="shrink-0">{percentage}%</span>
      </div>
      
      <div className="flex justify-between text-muted-foreground">
        {progressData.total ? <span>{loadedMB}MB / {totalMB}MB</span> : <span>Loading...</span>}
      </div>

      <div className="flex text-[10px] text-accent uppercase tracking-widest mt-1">
        <span>Downloading...</span>
      </div>
    </div>
  );
}
