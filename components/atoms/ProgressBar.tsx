"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number; // 0-100
  label?: string;
  color?: string;
}

/**
 * Atom: ProgressBar
 * Renders a stylized horizontal bar for system task progress.
 */
export function ProgressBar({ 
  value, 
  label = "PROCESSING", 
  color = "bg-accent" 
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, value));

  return (
    <div className="space-y-1.5 w-full">
      <div className="flex justify-between items-end px-1">
        <span className="text-[8px] font-mono uppercase tracking-[0.2em] text-muted-foreground animate-pulse">
          {label}
        </span>
        <span className="text-[10px] font-mono font-black text-white">
          {percentage}%
        </span>
      </div>
      <div className="h-2 w-full bg-muted/20 border border-border/50 relative overflow-hidden cyber-chamfer-sm">
        {/* The Fill */}
        <div 
          className={cn("h-full transition-all duration-300 ease-out relative", color)}
          style={{ width: `${percentage}%` }}
        >
          {/* Glitch Overlay */}
          <div className="absolute inset-0 bg-white/20 animate-pulse" />
          <div className="absolute top-0 right-0 w-4 h-full bg-white/30 blur-sm" />
        </div>
        
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[length:10px_10px] bg-[linear-gradient(to_right,#888_1px,transparent_1px),linear-gradient(to_bottom,#888_1px,transparent_1px)]" />
      </div>
    </div>
  );
}
