"use client";

import React from "react";
import { useMarkdownDocStore } from "@/lib/store/useMarkdownDocStore";
import { 
  Type as CharIcon, 
  Hash as WordIcon, 
  Clock as ClockIcon, 
  CloudUpload as SyncIcon,
  CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Molecule: StatusBar
 * Displays real-time document statistics and system synchronization status.
 * Optimized for mobile with two-line layout.
 */
export function StatusBar() {
  const activeContent = useMarkdownDocStore(state => state.activeContent);
  const syncStatus = 'saved'; // Locally managed by Zustand persist

  const wordCount = activeContent?.split(/\s+/).filter(Boolean).length || 0;
  const charCount = activeContent?.length || 0;
  const readTime = Math.ceil(wordCount / 200) || 0;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-black/60 border-t border-accent/20 px-4 py-2 sm:py-0 font-mono text-[9px] uppercase tracking-widest text-muted-foreground select-none overflow-hidden h-auto sm:h-9 gap-2 sm:gap-0">
      {/* Line 1 (Stats) */}
      <div className="flex items-center justify-between sm:justify-start gap-4 sm:gap-6 w-full sm:w-auto">
        <div className="flex items-center gap-2 group">
          <WordIcon size={12} className="text-accent group-hover:animate-pulse" />
          <span>WORDS: <span className="text-foreground font-bold">{wordCount}</span></span>
        </div>
        <div className="flex items-center gap-2 group">
          <CharIcon size={12} className="text-accent-secondary group-hover:animate-pulse" />
          <span>CHARS: <span className="text-foreground font-bold">{charCount}</span></span>
        </div>
        <div className="flex items-center gap-2 group">
          <ClockIcon size={12} className="text-accent-tertiary group-hover:animate-pulse" />
          <span>READ_TIME: <span className="text-foreground font-bold">{readTime}m</span></span>
        </div>
      </div>

      {/* Line 2 (System Status) */}
      <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto border-t border-white/5 pt-2 sm:pt-0 sm:border-t-0">
        <div className={cn(
          "flex items-center gap-2 px-2 py-0.5 rounded-sm transition-colors",
          syncStatus === 'saved' ? "bg-accent/10 text-accent" : "bg-accent-tertiary/10 text-accent-tertiary"
        )}>
          {syncStatus === 'saved' ? (
            <>
              <CheckCircle2 size={10} />
              <span className="font-black">BUFFER_SYNCED</span>
            </>
          ) : (
            <>
              <SyncIcon size={10} className="animate-spin" />
              <span className="font-black">SYNCING_LOCAL...</span>
            </>
          )}
        </div>
        
        <div className="flex items-center gap-2 sm:border-l sm:border-white/10 sm:pl-4 sm:ml-2">
          <span className="opacity-40">STORAGE:</span>
          <span className="text-foreground font-bold">LOCAL_PERSIST_ACTIVE</span>
        </div>
      </div>
    </div>
  );
}
