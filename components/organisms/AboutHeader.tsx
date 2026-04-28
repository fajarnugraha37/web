"use client";

import React from "react";
import { ScrollReveal } from "@/components/atoms/ScrollReveal";
import { Activity } from "lucide-react";

/**
 * Organism: AboutHeader
 * Renders the identity header with glitch effects and data stream markers.
 */
export function AboutHeader() {
  return (
    <header className="mb-20 relative group">
      <div className="absolute -left-4 top-0 w-1 h-full bg-accent/30 group-hover:bg-accent transition-colors" />
      <ScrollReveal direction="right">
        <div className="inline-flex items-center gap-2 px-3 py-1 border border-accent/20 bg-accent/5 font-mono text-[10px] text-accent mb-4 cyber-chamfer-reverse">
          <Activity className="w-3 h-3 animate-pulse" />
          DATA_STREAM // IDENTITY_QUERY
        </div>
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter uppercase italic cyber-glitch-text leading-none" data-text="ABOUT IDENTITY">
          ABOUT<span className="text-accent"> IDENTITY</span>
        </h1>
        <div className="flex items-center gap-4 mt-4">
          <p className="text-muted-foreground font-mono text-sm uppercase tracking-[0.3em]">
            // Professional fragments...
          </p>
          <div className="h-px flex-1 bg-gradient-to-r from-border/50 to-transparent" />
        </div>
      </ScrollReveal>
    </header>
  );
}
