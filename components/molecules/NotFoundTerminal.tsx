"use client";

import React from "react";

/**
 * Molecule: NotFoundTerminal
 * Renders a stylized terminal block for the 404 page.
 */
export function NotFoundTerminal() {
  return (
    <div className="w-full bg-card/60 backdrop-blur-sm border border-border cyber-chamfer p-6 mb-8 text-left font-mono text-sm shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]">
      <div className="space-y-2">
        <div className="flex gap-3">
          <span className="text-destructive">[ERR]</span>
          <span className="text-foreground/70">
            Route target not found in address space.
          </span>
        </div>
        <div className="flex gap-3">
          <span className="text-destructive">[ERR]</span>
          <span className="text-foreground/70">
            Requested node has been decommissioned, never existed, or you
            are hallucinating.
          </span>
        </div>
        <div className="flex gap-3">
          <span className="text-accent-tertiary">[SYS]</span>
          <span className="text-foreground/70">
            Initiating damage control protocols...
          </span>
        </div>
        <div className="flex gap-3">
          <span className="text-accent-tertiary">[SYS]</span>
          <span className="text-foreground/50">
            Recommendation: return to a known-good sector.
          </span>
        </div>
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border/30">
          <span className="text-accent">&gt;</span>
          <span className="w-2 h-5 bg-accent animate-pulse shadow-[0_0_5px_#00ff88] inline-block" />
        </div>
      </div>
    </div>
  );
}
