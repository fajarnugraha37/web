"use client";

import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronRight, Sliders, Info } from "lucide-react";
import { RangeSlider } from "@/components/atoms/RangeSlider";
import { FFmpegMode } from "@/hooks/useFFmpegLabActions";
import { cn } from "@/lib/utils";

interface AdvancedSettingsFormProps {
  mode: FFmpegMode;
  trimValue: [number, number];
  duration: number;
  onTrimChange: (value: [number, number]) => void;
  gifQuality: 'HIGH' | 'PERFORMANCE';
  setGifQuality: (quality: 'HIGH' | 'PERFORMANCE') => void;
  className?: string;
}

/**
 * Molecule: AdvancedSettingsForm
 * Collapsible form for overriding default transcode parameters.
 */
export function AdvancedSettingsForm({
  mode,
  trimValue,
  duration,
  onTrimChange,
  gifQuality,
  setGifQuality,
  className
}: AdvancedSettingsFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const showTrim = mode === 'TRIM' || mode === 'GIF' || mode === 'AUDIO';

  // Auto-open when a file with a duration is loaded
  useEffect(() => {
    if (duration > 0) {
      setIsOpen(true);
    }
  }, [duration]);

  return (
    <div className={cn("border border-border/20 bg-black/20 overflow-hidden", className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-2">
          <Sliders className="w-3 h-3 text-muted-foreground" />
          <span className="text-[10px] font-mono font-black tracking-[0.2em] text-muted-foreground uppercase">
            # SYSTEM_OVERRIDES
          </span>
        </div>
        {isOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
      </button>

      {isOpen && (
        <div className="p-4 border-t border-border/10 space-y-6">
          {/* Mode Specific: TRIM / GIF / AUDIO */}
          {showTrim && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-accent-secondary">
                <Info className="w-3 h-3" />
                <span className="text-[9px] font-mono uppercase tracking-widest">SEGMENT_SELECTOR_ACTIVE</span>
              </div>
              <RangeSlider
                min={0}
                max={duration || 120} 
                value={trimValue}
                onChange={onTrimChange}
                label="SELECTION_RANGE"
              />
            </div>
          )}

          {/* Mode Specific: GIF */}
          {mode === 'GIF' && (
            <div className="space-y-1.5">
              <label className="text-[8px] font-mono text-muted-foreground uppercase tracking-widest px-1">GIF_RENDER_QUALITY</label>
              <select 
                value={gifQuality}
                onChange={(e) => setGifQuality(e.target.value as 'HIGH' | 'PERFORMANCE')}
                className="w-full bg-card/60 border border-border/30 p-2 text-[10px] font-mono uppercase outline-none focus:border-accent/50 transition-colors cyber-chamfer-sm"
              >
                <option value="PERFORMANCE">PERFORMANCE (240P, 8FPS, 1-PASS)</option>
                {/* <option value="HIGH">HIGH_QUALITY (480P, 15FPS, 2-PASS PALETTEGEN)</option> */}
              </select>
            </div>
          )}

          {/* General Overrides */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[8px] font-mono text-muted-foreground uppercase tracking-widest px-1">OUTPUT_RESOLUTION</label>
              <select disabled className="w-full bg-card/60 border border-border/30 p-2 text-[10px] font-mono uppercase outline-none opacity-50 cursor-not-allowed cyber-chamfer-sm">
                <option>ORIGINAL_SOURCE</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[8px] font-mono text-muted-foreground uppercase tracking-widest px-1">ENCODER_PRESET</label>
              <select disabled className="w-full bg-card/60 border border-border/30 p-2 text-[10px] font-mono uppercase outline-none opacity-50 cursor-not-allowed cyber-chamfer-sm">
                <option>BALANCED_NODE</option>
              </select>
            </div>
          </div>

          <div className="p-2 bg-destructive/5 border border-destructive/20 rounded-sm flex gap-2">
            <Info className="w-3 h-3 text-destructive mt-0.5" />
            <p className="text-[8px] font-mono text-destructive/80 leading-relaxed uppercase">
              Warning: Overriding core parameters may result in unstable memory allocation on mobile nodes. Use High Quality GIF only on capable hardware.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
