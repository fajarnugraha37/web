"use client";

import React, { useRef, useEffect } from "react";
import { Terminal } from "lucide-react";
import { cn } from "@/lib/utils";

interface TerminalLogViewerProps {
  logs: string[];
  className?: string;
}

/**
 * Molecule: TerminalLogViewer
 * A stylized terminal window for streaming system logs.
 */
export function TerminalLogViewer({ logs, className }: TerminalLogViewerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className={cn("border border-border/30 bg-black/40 cyber-chamfer-sm overflow-hidden", className)}>
      {/* Terminal Header */}
      <div className="flex items-center gap-2 px-3 py-1.5 bg-muted/20 border-b border-border/20">
        <Terminal className="w-3 h-3 text-accent" />
        <span className="text-[9px] font-mono font-black tracking-widest text-muted-foreground uppercase">
          # SYSTEM_KERNEL_LOGS
        </span>
        <div className="ml-auto flex gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-accent/20" />
          <div className="w-1.5 h-1.5 rounded-full bg-accent/40" />
          <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
        </div>
      </div>

      {/* Log Stream */}
      <div 
        ref={scrollRef}
        className="p-3 h-32 md:h-48 overflow-y-auto font-mono text-[9px] md:text-[10px] space-y-1 scrollbar-hide"
      >
        {logs.length > 0 ? (
          logs.map((log, i) => (
            <div key={i} className="flex gap-2 text-muted-foreground break-all">
              <span className="text-accent opacity-50 shrink-0">[{i.toString().padStart(4, '0')}]</span>
              <span className="text-foreground/80">{log}</span>
            </div>
          ))
        ) : (
          <div className="text-muted-foreground italic animate-pulse">
            # WAITING_FOR_KERNEL_SIGNAL...
          </div>
        )}
      </div>

      {/* Grid Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[length:20px_20px] bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)]" />
    </div>
  );
}
