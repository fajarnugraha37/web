"use client";

import React from "react";
import { Save } from "lucide-react";

interface StatusBarProps {
  readTime: number;
  wordCount: number;
  charCount: number;
  syncStatus: string;
}

export function StatusBar({ readTime, wordCount, charCount, syncStatus }: StatusBarProps) {
  return (
    <div className="flex items-center justify-between px-4 py-1.5 bg-[#0a0a0a] border-t border-accent/20 text-[9px] text-muted-foreground uppercase tracking-widest font-mono z-20">
      <div className="flex items-center gap-4">
        <span>{readTime} Min Read</span>
        <span>{wordCount} Words</span>
        <span>{charCount} Chars</span>
      </div>
      
      {syncStatus !== "idle" && (
        <div className={`flex items-center gap-1.5 ${syncStatus === "saved" ? "text-green-500" : "text-yellow-500"}`}>
          <Save size={10} />
          {syncStatus === "saving" ? "SYNCING..." : "SYNC_SUCCESS"}
        </div>
      )}
    </div>
  );
}
