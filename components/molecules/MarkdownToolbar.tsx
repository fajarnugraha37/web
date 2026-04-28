"use client";

import React from "react";
import { 
  FolderOpen, 
  Download, 
  Copy, 
  Check, 
  List as ListIcon, 
  Save 
} from "lucide-react";
import { Button } from "@/components/atoms/Button";

interface MarkdownToolbarProps {
  viewMode: string;
  setViewMode: (mode: any) => void;
  isMobile: boolean;
  readTime: number;
  wordCount: number;
  charCount: number;
  syncStatus: string;
  onImport: () => void;
  onExport: () => void;
  onCopy: () => void;
  copied: boolean;
  showToc: boolean;
  setShowToc: (show: boolean) => void;
}

/**
 * Molecule: MarkdownToolbar
 * Manages stats, view modes, and primary playground actions.
 */
export function MarkdownToolbar({
  viewMode,
  setViewMode,
  isMobile,
  readTime,
  wordCount,
  charCount,
  syncStatus,
  onImport,
  onExport,
  onCopy,
  copied,
  showToc,
  setShowToc,
}: MarkdownToolbarProps) {
  const modes = isMobile ? ["editor", "preview"] : ["editor", "split", "preview"];

  return (
    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 mb-6">
      <div className="flex flex-col gap-1 items-center md:items-start">
        <h1 className="text-2xl font-bold text-accent tracking-tighter">MARKDOWN.EXE</h1>
        <div className="flex items-center gap-3 text-[9px] text-muted-foreground uppercase">
          <span>{readTime} Min Read | {wordCount} Words | {charCount} Chars</span>
          {syncStatus !== "idle" && (
            <span className={`flex items-center gap-1 ${syncStatus === "saved" ? "text-green-500" : "text-yellow-500"}`}>
              <Save size={10} />
              {syncStatus === "saving" ? "SYNCING..." : "SYNC_SUCCESS"}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col items-center md:items-end gap-4">
        <div className="flex bg-[#111] border border-accent/30 p-1">
          {modes.map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode as any)}
              className={`px-6 py-1.5 text-[10px] uppercase tracking-widest transition-all ${
                viewMode === mode 
                  ? "bg-accent text-black font-bold shadow-[0_0_10px_rgba(0,255,136,0.5)]" 
                  : "text-accent hover:bg-accent/10"
              }`}
            >
              {mode}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="xs" onClick={onImport} className="gap-2 px-4 py-3 h-auto">
            <FolderOpen size={12} /> IMPORT
          </Button>
          <Button variant="outline" size="xs" onClick={onExport} className="gap-2 px-4 py-3 h-auto">
            <Download size={12} /> EXPORT
          </Button>
          <Button variant="outline" size="xs" onClick={onCopy} className="gap-2 px-4 py-3 h-auto">
            {copied ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
            {copied ? "COPIED" : "COPY"}
          </Button>
          <Button 
            variant="outline" 
            size="xs" 
            onClick={() => setShowToc(!showToc)} 
            className={`hidden lg:flex px-4 py-3 h-auto ${showToc ? "bg-accent text-black border-accent" : ""}`}
          >
            <ListIcon size={12} />
          </Button>
        </div>
      </div>
    </div>
  );
}
