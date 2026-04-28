"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface VideoPreviewProps {
  src: string | null;
  label?: string;
  className?: string;
}

/**
 * Atom: VideoPreview
 * A styled wrapper for the HTML5 video element.
 */
export function VideoPreview({ src, label, className }: VideoPreviewProps) {
  if (!src) return null;

  return (
    <div className={cn("space-y-2 w-full", className)}>
      {label && (
        <span className="text-[8px] font-mono uppercase tracking-[0.2em] text-muted-foreground px-1">
          {label}
        </span>
      )}
      <div className="relative group cyber-chamfer border border-border/50 bg-black overflow-hidden">
        <video 
          src={src} 
          controls 
          className="w-full h-auto aspect-video max-h-[400px] object-contain"
        />
        
        {/* Aesthetic Overlay */}
        <div className="absolute inset-0 pointer-events-none border border-white/5 opacity-30 group-hover:opacity-100 transition-opacity" />
        <div className="absolute top-2 right-2 flex gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          <div className="w-1.5 h-1.5 rounded-full bg-accent/50" />
        </div>
      </div>
    </div>
  );
}
