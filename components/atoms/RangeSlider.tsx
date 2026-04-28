"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface RangeSliderProps {
  min: number;
  max: number;
  step?: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  label?: string;
}

/**
 * Atom: RangeSlider
 * A cyberpunk-styled dual-thumb slider for range selection (e.g., Video Trimming).
 */
export function RangeSlider({
  min,
  max,
  step = 1,
  value,
  onChange,
  label
}: RangeSliderProps) {
  const [minVal, maxVal] = value;

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextVal = Math.min(Number(e.target.value), maxVal - step);
    onChange([nextVal, maxVal]);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextVal = Math.max(Number(e.target.value), minVal + step);
    onChange([minVal, nextVal]);
  };

  return (
    <div className="w-full space-y-4">
      {label && (
        <div className="flex justify-between items-center px-1">
          <span className="text-[8px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
            {label}
          </span>
          <span className="text-[10px] font-mono font-bold text-accent-secondary">
            {minVal}s - {maxVal}s
          </span>
        </div>
      )}
      
      <div className="relative h-6 flex items-center">
        {/* Track Background */}
        <div className="absolute w-full h-1 bg-muted/30 border border-border/30 cyber-chamfer-sm" />
        
        {/* Highlighted Range */}
        <div 
          className="absolute h-1 bg-accent-secondary shadow-neon-secondary"
          style={{
            left: `${((minVal - min) / (max - min)) * 100}%`,
            right: `${100 - ((maxVal - min) / (max - min)) * 100}%`
          }}
        />

        {/* Inputs */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={minVal}
          onChange={handleMinChange}
          className="absolute w-full appearance-none bg-transparent pointer-events-none z-20 
            [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none 
            [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:bg-white 
            [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-accent-secondary 
            [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-neon-secondary"
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={maxVal}
          onChange={handleMaxChange}
          className="absolute w-full appearance-none bg-transparent pointer-events-none z-20 
            [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none 
            [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:bg-white 
            [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-accent-secondary 
            [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-neon-secondary"
        />
      </div>
    </div>
  );
}
