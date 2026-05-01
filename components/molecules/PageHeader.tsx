"use client";

import React from "react";
import { ScrollReveal } from "@/components/atoms/ScrollReveal";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PageHeaderProps {
  title: string;
  accentText?: string;
  tagText: string;
  tagIcon: LucideIcon;
  subtitle: string;
  tagPulse?: boolean;
  className?: string;
}

export function PageHeader({
  title,
  accentText,
  tagText,
  tagIcon: Icon,
  subtitle,
  tagPulse = true,
  className,
}: PageHeaderProps) {
  const fullTitle = accentText ? `${title} ${accentText}`.trim() : title;
  
  return (
    <div className={cn("relative group", className)}>
      <div className="absolute -left-4 top-0 w-1 h-full bg-accent/30 group-hover:bg-accent transition-colors" />
      <ScrollReveal direction="right">
        <div className="inline-flex items-center gap-2 px-3 py-1 border border-accent/20 bg-accent/5 font-mono text-[10px] text-accent mb-4 cyber-chamfer-reverse">
          <Icon className={`w-3 h-3 ${tagPulse ? "animate-pulse" : ""}`} />
          {tagText}
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter uppercase italic cyber-glitch-text leading-none" data-text={fullTitle}>
          {title}{accentText && <span className="text-accent"> {accentText}</span>}
        </h1>
        <div className="flex items-center gap-4 mt-4">
          <p className="text-muted-foreground font-mono text-sm uppercase tracking-[0.3em]">
            // {subtitle}
          </p>
          <div className="h-px flex-1 bg-gradient-to-r from-border/50 to-transparent" />
        </div>
      </ScrollReveal>
    </div>
  );
}
