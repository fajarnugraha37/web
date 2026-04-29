import React from 'react';
import { cn } from '@/lib/utils';

interface CharacterCounterProps {
  current: number;
  max: number;
  warningThreshold?: number;
}

export function CharacterCounter({ current, max, warningThreshold = 280 }: CharacterCounterProps) {
  const isWarning = current >= warningThreshold && current <= max;
  const isError = current > max;

  return (
    <div
      className={cn(
        "font-mono text-xs transition-colors duration-300",
        isError ? "text-destructive" : isWarning ? "text-accent-tertiary" : "text-muted-foreground"
      )}
    >
      {current} / {max}
    </div>
  );
}
