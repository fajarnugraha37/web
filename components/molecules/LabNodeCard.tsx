"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface LabNode {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  status: string;
  color: string;
}

interface LabNodeCardProps {
  node: LabNode;
}

/**
 * Molecule: LabNodeCard
 * Renders a stylized access point for a laboratory experimental node.
 */
export function LabNodeCard({ node }: LabNodeCardProps) {
  return (
    <Link
      href={node.path}
      className="group relative flex flex-col p-6 border border-border bg-card/30 hover:border-accent/50 transition-all cyber-chamfer overflow-hidden"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={cn(
          "p-3 bg-muted/20 border border-border group-hover:border-accent/30 transition-colors",
          node.color
        )}>
          {node.icon}
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[8px] font-mono text-muted-foreground uppercase tracking-widest mb-1">NODE_STATUS</span>
          <span className={cn(
            "text-[10px] font-mono font-bold animate-pulse",
            node.color
          )}>
            [{node.status}]
          </span>
        </div>
      </div>
      <div className="space-y-2 relative z-10">
        <h2 className="text-2xl font-black tracking-tight group-hover:text-accent transition-colors">
          {node.name}
        </h2>
        <p className="text-xs text-muted-foreground font-mono leading-relaxed h-12 line-clamp-3">
          {node.description}
        </p>
      </div>
      <div className="mt-6 flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-[0.2em] group-hover:text-accent transition-colors">
        <span>Access Node</span>
        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
}
