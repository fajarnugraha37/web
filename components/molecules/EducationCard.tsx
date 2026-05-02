"use client";

import React from "react";
import { Binary, Zap, Globe } from "lucide-react";
import { Education } from "@/types";

interface EducationCardProps {
  edu: Education;
}

/**
 * Molecule: EducationCard
 * Renders a standardized card for education or certification items.
 */
export function EducationCard({ edu }: EducationCardProps) {
  return (
    <div className="group relative p-8 bg-card/30 border border-border cyber-chamfer hover:border-accent-tertiary transition-all duration-500 overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
        <Binary className="w-24 h-24 text-accent-tertiary" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-br from-accent-tertiary/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
          <div>
            <h3 className="text-xl font-bold text-foreground uppercase group-hover:text-accent-tertiary transition-colors tracking-tight">
              {edu.school}
            </h3>
            <div className="text-xs font-mono text-accent-tertiary font-bold uppercase mt-2 tracking-widest flex items-center gap-2">
              <Zap className="w-3 h-3" />
              {edu.degree}
            </div>
          </div>
          <span className="text-[10px] font-mono text-accent-tertiary bg-accent-tertiary/10 border border-accent-tertiary/30 px-3 py-1 shadow-[0_0_10px_rgba(255,215,0,0.15)]">
            {edu.year}
          </span>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-[10px] font-mono text-muted-foreground uppercase tracking-widest border-b border-border/20 pb-2">
            <Globe className="w-3 h-3" /> {edu.location}
          </div>
          <p className="text-xs md:text-sm font-mono text-foreground/70 leading-relaxed italic border-l-2 border-accent-tertiary/20 pl-4 py-1">
            <span className="opacity-50">//</span> {edu.description}
          </p>
        </div>
      </div>
    </div>
  );
}
