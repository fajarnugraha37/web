"use client";

import React from "react";
import { Database } from "lucide-react";
import { Experience } from "@/types";
import { ExpandableDescriptions } from "@/components/molecules/ExpandableDescriptions";

interface CareerItemProps {
  job: Experience;
}

/**
 * Molecule: CareerItem
 * Renders a single job experience entry with timeline indicators.
 */
export function CareerItem({ job }: CareerItemProps) {
  return (
    <div className="relative pl-10 md:pl-16 border-l-2 border-border/30 pb-2 group">
      {/* Interactive Node */}
      <div className="absolute left-[-11px] top-0 z-20">
        <div className="relative w-5 h-5 bg-background border-2 border-accent-secondary rotate-45 flex items-center justify-center overflow-hidden transition-all duration-500 group-hover:bg-accent-secondary group-hover:shadow-[0_0_15px_#ff00ff]">
          <div className="absolute inset-0 bg-accent-secondary/20 animate-pulse" />
        </div>
      </div>

      <div className="absolute left-[-2px] top-0 w-0.5 h-full bg-gradient-to-b from-accent-secondary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-2xl md:text-3xl font-black text-foreground group-hover:text-accent-secondary transition-all duration-300 uppercase leading-none tracking-tighter">
              {job.role}
            </h3>
            <div className="flex items-center gap-2 mt-3 font-mono text-xs font-bold text-accent-secondary tracking-widest">
              <span className="p-1 bg-accent-secondary/10 border border-accent-secondary/20">
                <Database className="w-3 h-3" />
              </span>
              {job.company}
            </div>
          </div>
          <div className="flex flex-col items-start md:items-end gap-1">
            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest opacity-50">Timestamp</span>
            <span className="text-xs font-mono text-foreground bg-muted/30 px-3 py-1 border border-border/50 cyber-chamfer-sm">
              [{job.year}]
            </span>
          </div>
        </div>

        <div className="bg-card/20 p-4 border border-border/30 backdrop-blur-sm cyber-chamfer transition-all group-hover:border-accent-secondary/40">
          <ExpandableDescriptions descriptions={job.descriptions} />
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          {job.tech.map((t) => (
            <span 
              key={t} 
              className="text-[9px] font-mono font-bold bg-background/50 border border-border/40 px-2 py-1 text-muted-foreground uppercase tracking-tighter hover:border-accent-secondary/50 hover:text-accent-secondary transition-all cursor-default"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
