"use client";

import React from "react";
import { FFmpegMode } from "@/hooks/useFFmpegLabActions";
import { Zap, Film, Music, Scissors, Settings2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface PresetSelectorProps {
  activeMode: FFmpegMode;
  onModeChange: (mode: FFmpegMode) => void;
  className?: string;
}

const PRESETS: { id: FFmpegMode; label: string; icon: any; color: string }[] = [
  { id: 'COMPRESS', label: 'OPTIMIZE_VIDEO', icon: Zap, color: 'text-accent' },
  { id: 'GIF', label: 'GENERATE_GIF', icon: Film, color: 'text-accent-secondary' },
  { id: 'AUDIO', label: 'EXTRACT_AUDIO', icon: Music, color: 'text-accent-tertiary' },
  { id: 'TRIM', label: 'TRIM_SEGMENT', icon: Scissors, color: 'text-white' },
];

/**
 * Molecule: PresetSelector
 * A list of preset modes for the FFmpeg lab.
 */
export function PresetSelector({ activeMode, onModeChange, className }: PresetSelectorProps) {
  return (
    <div className={cn("grid grid-cols-2 md:grid-cols-4 gap-3", className)}>
      {PRESETS.map((p) => {
        const Icon = p.icon;
        const isActive = activeMode === p.id;
        
        return (
          <button
            key={p.id}
            onClick={() => onModeChange(p.id)}
            className={cn(
              "relative flex flex-col items-center justify-center p-4 border transition-all group",
              isActive 
                ? "border-accent bg-accent/10 shadow-neon" 
                : "border-border/40 bg-card/40 hover:border-accent/30 hover:bg-accent/5"
            )}
          >
            <Icon className={cn(
              "w-5 h-5 mb-2 transition-transform group-hover:scale-110",
              isActive ? p.color : "text-muted-foreground opacity-50 group-hover:opacity-100"
            )} />
            <span className={cn(
              "text-[9px] font-mono font-black tracking-widest uppercase",
              isActive ? "text-white" : "text-muted-foreground"
            )}>
              {p.label}
            </span>
            
            {/* Active Indicator */}
            {isActive && (
              <div className="absolute top-1 right-1">
                <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
