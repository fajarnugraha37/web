"use client";

import React, { useRef, useEffect } from "react";
import { Terminal, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface TerminalLogViewerProps {
  logs: string[];
  onClear?: () => void;
  className?: string;
}

/**
 * Molecule: TerminalLogViewer
 * A stylized terminal window for streaming system logs.
 */
export function TerminalLogViewer({ logs, onClear, className }: TerminalLogViewerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className={cn("flex flex-col border border-border/30 bg-black/60 overflow-hidden", className)}>
      {/* Terminal Header */}
      <div className="flex items-center gap-2 px-3 py-2 bg-muted/20 border-b border-border/20 shrink-0">
        <Terminal className="w-3 h-3 text-accent" />
        <span className="text-[9px] font-mono font-black tracking-widest text-muted-foreground uppercase flex-grow">
          # SYSTEM LOGS
        </span>
        
        {onClear && (
          <button 
            onClick={onClear}
            className="text-[9px] font-mono text-muted-foreground hover:text-destructive flex items-center gap-1 transition-colors px-2"
            title="Clear Buffer"
          >
            <Trash2 className="w-3 h-3" />
            <span className="hidden sm:inline">CLEAR</span>
          </button>
        )}

        <div className="ml-2 flex gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-accent/20" />
          <div className="w-1.5 h-1.5 rounded-full bg-accent/40" />
          <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
        </div>
      </div>

      {/* Log Stream */}
      <div 
        ref={scrollRef}
        className="flex-grow p-4 overflow-y-auto font-mono text-[9px] md:text-[10px] space-y-1.5 scrollbar-hide relative z-10 min-h-[200px] max-h-[300px] lg:max-h-[400px]"
      >
        {logs.length > 0 ? (
          logs.map((log, i) => (
            <div key={i} className="flex gap-3 text-muted-foreground group">
              <span className="text-accent/40 shrink-0 font-bold">[{i.toString().padStart(4, '0')}]</span>
              <span className="text-foreground/90 group-hover:text-accent transition-colors leading-relaxed">{log}</span>
            </div>
          ))
        ) : (
          <div className="text-muted-foreground/50 italic animate-pulse flex items-center gap-2">
            <span className="inline-block w-1.5 h-3 bg-accent/50 animate-blink" />
            # WAITING_FOR_SIGNAL...
          </div>
        )}
      </div>

      {/* Grid & Scanline Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.05] bg-[length:20px_20px] bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)]" />
      <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,#fff_2px,#fff_4px)]" />
    </div>
  );
}
