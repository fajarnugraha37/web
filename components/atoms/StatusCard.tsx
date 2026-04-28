"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface StatusCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
  loading?: boolean;
}

/**
 * Atom: StatusCard
 * Renders a stylized card for system statuses with cyberpunk accents.
 */
export function StatusCard({ 
  icon, 
  label, 
  value, 
  color, 
  loading = false 
}: StatusCardProps) {
  return (
    <div className="border border-border bg-card/40 p-3 cyber-chamfer-sm relative overflow-hidden group">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-muted-foreground opacity-50">{icon}</span>
        <span className="text-[8px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
          {label}
        </span>
      </div>
      <div className={cn(
        "font-mono text-xs font-black uppercase tracking-wider",
        color,
        loading && "animate-pulse"
      )}>
        {value}
      </div>
      <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-border to-transparent" />
      <div className="absolute inset-0 bg-white/[0.01] opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
}
