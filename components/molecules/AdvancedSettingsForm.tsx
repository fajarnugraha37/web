"use client";

import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronRight, Sliders, Info } from "lucide-react";
import { RangeSlider } from "@/components/atoms/RangeSlider";
import { FFmpegMode, VideoResolution, EncoderPreset } from "@/hooks/useFFmpegLabActions";
import { cn } from "@/lib/utils";

interface AdvancedSettingsFormProps {
  mode: FFmpegMode;
  trimValue: [number, number];
  duration: number;
  onTrimChange: (value: [number, number]) => void;
  gifQuality: 'HIGH' | 'PERFORMANCE';
  setGifQuality: (quality: 'HIGH' | 'PERFORMANCE') => void;
  resolution: VideoResolution;
  setResolution: (res: VideoResolution) => void;
  preset: EncoderPreset;
  setPreset: (preset: EncoderPreset) => void;
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
  resolution,
  setResolution,
  preset,
  setPreset,
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
            <div className="space-y-1.5 group">
              <label className="text-[8px] font-mono text-muted-foreground uppercase tracking-widest px-1 flex justify-between">
                <span>GIF_RENDER_QUALITY</span>
                <span className="text-accent-secondary opacity-0 group-hover:opacity-100 transition-opacity">// HIGH_FIDELITY</span>
              </label>
              <div className="relative">
                <select 
                  disabled
                  value={gifQuality}
                  onChange={(e) => setGifQuality(e.target.value as 'HIGH' | 'PERFORMANCE')}
                  className="w-full bg-black/60 border border-accent-secondary/30 p-2.5 text-[10px] font-mono uppercase outline-none focus:border-accent-secondary focus:shadow-[0_0_10px_rgba(255,0,127,0.2)] transition-all appearance-none cursor-pointer cyber-chamfer-sm"
                >
                  <option value="PERFORMANCE">PERFORMANCE (240P, 8FPS, 1-PASS)</option>
                  <option value="HIGH">HIGH_QUALITY (480P, 15FPS, 2-PASS)</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-accent-secondary/50 text-[8px]">▼</div>
              </div>
            </div>
          )}

          {/* General Overrides */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5 group">
              <label className="text-[8px] font-mono text-muted-foreground uppercase tracking-widest px-1 flex justify-between">
                <span>RESOLUTION</span>
                <span className="text-accent opacity-0 group-hover:opacity-100 transition-opacity">#SCALE</span>
              </label>
              <div className="relative">
                <select 
                  value={resolution}
                  onChange={(e) => setResolution(e.target.value as VideoResolution)}
                  className="w-full bg-black/60 border border-border/30 p-2.5 text-[10px] font-mono uppercase outline-none focus:border-accent focus:shadow-[0_0_10px_rgba(0,255,136,0.2)] transition-all appearance-none cursor-pointer cyber-chamfer-sm"
                >
                  <option value="ORIGINAL">ORIGINAL_SOURCE</option>
                  <option value="1080P">1080P_FHD</option>
                  <option value="720P">720P_HD</option>
                  <option value="480P">480P_SD</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-accent/50 text-[8px]">▼</div>
              </div>
            </div>

            <div className="space-y-1.5 group">
              <label className="text-[8px] font-mono text-muted-foreground uppercase tracking-widest px-1 flex justify-between">
                <span>ENCODER</span>
                <span className="text-accent-tertiary opacity-0 group-hover:opacity-100 transition-opacity">#SPEED</span>
              </label>
              <div className="relative">
                <select 
                  value={preset}
                  onChange={(e) => setPreset(e.target.value as EncoderPreset)}
                  className="w-full bg-black/60 border border-border/30 p-2.5 text-[10px] font-mono uppercase outline-none focus:border-accent-tertiary focus:shadow-[0_0_10px_rgba(255,214,0,0.2)] transition-all appearance-none cursor-pointer cyber-chamfer-sm"
                >
                  <option value="ultrafast">ULTRA_FAST (SPEED)</option>
                  <option value="faster">FAST_RECOVERY</option>
                  <option value="medium">BALANCED_NODE</option>
                  <option value="slower">MAX_COMPRESSION</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-accent-tertiary/50 text-[8px]">▼</div>
              </div>
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
