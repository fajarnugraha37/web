"use client";

import React from "react";
import { 
  FolderOpen, 
  Download, 
  Copy, 
  Check, 
  List as ListIcon, 
  PenTool,
  ChevronDown
} from "lucide-react";
import { Button } from "@/components/atoms/Button";

import { ENV } from "@/lib/env";

interface MarkdownToolbarProps {
  viewMode: string;
  setViewMode: (mode: any) => void;
  isMobile: boolean;
  onImport: () => void;
  onExport: () => void;
  onCopy: () => void;
  copied: boolean;
  showToc: boolean;
  setShowToc: (show: boolean) => void;
  onOpenMetadata?: () => void;
  onOpenContentEditor?: (action: 'open' | 'delete') => void;
}

/**
 * Molecule: MarkdownToolbar
 * Manages view modes and primary playground actions for the Editor Pane.
 */
export function MarkdownToolbar({
  viewMode,
  setViewMode,
  isMobile,
  onImport,
  onExport,
  onCopy,
  copied,
  showToc,
  setShowToc,
  onOpenMetadata,
  onOpenContentEditor,
}: MarkdownToolbarProps) {
  const [editorMenuOpen, setEditorMenuOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const modes = isMobile ? ["editor", "preview"] : ["editor", "split", "preview"];
  const isWriteMode = ENV.IS_WRITE_MODE;

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setEditorMenuOpen(false);
      }
    };

    if (editorMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [editorMenuOpen]);

  return (
    <div className="flex items-center gap-4 justify-between">
      <div className="flex bg-[#111] border border-accent/30 p-1">
        {modes.map((mode) => (
          <button
            key={mode}
            onClick={() => setViewMode(mode as any, isMobile)}
            className={`px-4 py-1 text-[10px] uppercase tracking-widest transition-all ${
              viewMode === mode 
                ? "bg-accent text-black font-bold shadow-[0_0_10px_rgba(0,255,136,0.5)]" 
                : "text-accent hover:bg-accent/10"
            }`}
          >
            {mode}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2 relative" ref={dropdownRef}>
        <Button 
          variant="outline" 
          size="xs" 
          onClick={() => setEditorMenuOpen(!editorMenuOpen)} 
          className="gap-2 px-4 py-2 h-auto"
        >
          <FolderOpen size={12} /> FILE ACTIONS <ChevronDown size={10} />
        </Button>

        {editorMenuOpen && (
          <div className="absolute top-full mt-2 right-0 w-48 bg-black border border-accent/30 rounded shadow-[0_0_15px_rgba(0,255,136,0.2)] z-50 overflow-hidden flex flex-col">
            <button 
              onClick={() => { setEditorMenuOpen(false); onImport(); }}
              className="px-4 py-3 text-[10px] text-left hover:bg-accent/20 text-accent uppercase tracking-wider transition-colors flex items-center gap-3"
            >
              <FolderOpen size={12} /> Import
            </button>
            <button 
              onClick={() => { setEditorMenuOpen(false); onExport(); }}
              className="px-4 py-3 text-[10px] text-left hover:bg-accent/20 text-accent uppercase tracking-wider transition-colors flex items-center gap-3"
            >
              <Download size={12} /> Export
            </button>
            <button 
              onClick={() => { setEditorMenuOpen(false); onCopy(); }}
              className="px-4 py-3 text-[10px] text-left hover:bg-accent/20 text-accent uppercase tracking-wider transition-colors flex items-center gap-3"
            >
              {copied ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
              {copied ? "Copied" : "Copy"}
            </button>
            
            {isWriteMode && (
              <>
                <div className="h-px bg-accent/20 my-1 w-full" />
                <button 
                  onClick={() => { setEditorMenuOpen(false); onOpenMetadata?.(); }}
                  className="px-4 py-3 text-[10px] text-left hover:bg-accent/20 text-accent uppercase tracking-wider transition-colors flex items-center gap-3"
                >
                  <PenTool size={12} /> Post Metadata
                </button>
                <button 
                  onClick={() => { setEditorMenuOpen(false); onOpenContentEditor?.('open'); }}
                  className="px-4 py-3 text-[10px] text-left hover:bg-accent/20 text-accent uppercase tracking-wider transition-colors flex items-center gap-3"
                >
                  <FolderOpen size={12} /> Open Post
                </button>
                <button 
                  onClick={() => { setEditorMenuOpen(false); onOpenContentEditor?.('delete'); }}
                  className="px-4 py-3 text-[10px] text-left hover:bg-red-500/20 text-red-500 uppercase tracking-wider transition-colors flex items-center gap-3"
                >
                  <PenTool size={12} className="text-red-500" /> Delete Post
                </button>
              </>
            )}
          </div>
        )}

        <Button 
          variant="outline" 
          size="xs" 
          onClick={() => setShowToc(!showToc)} 
          className={`hidden lg:flex px-4 py-2 h-auto ${showToc ? "bg-accent text-black border-accent" : ""}`}
        >
          <ListIcon size={12} />
        </Button>
      </div>
    </div>
  );
}

