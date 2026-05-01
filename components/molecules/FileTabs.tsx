"use client";

import React, { useState, useEffect } from "react";
import { 
  MoreHorizontal, 
  Plus, 
  Trash2, 
  Copy as CopyIcon, 
  Type 
} from "lucide-react";
import { LabFile } from "@/types";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "@/components/atoms/Toast";

interface FileTabsProps {
  files: LabFile[];
  activeFileId: string;
  setActiveFileId: (id: string) => void;
  addFile: (name: string, content: string) => void;
  duplicateFile: (id: string) => void;
  onRename: (id: string, name: string) => void;
  onDelete: (id: string) => void;
}

/**
 * Molecule: FileTabs
 * Manages the interactive tabs for open fragments and their context menus.
 */
export function FileTabs({
  files,
  activeFileId,
  setActiveFileId,
  addFile,
  duplicateFile,
  onRename,
  onDelete,
}: FileTabsProps) {
  const [activeMenu, setActiveMenu] = useState<{ id: string; rect: DOMRect } | null>(null);

  // Handle click outside for tab menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (activeMenu && !(event.target as HTMLElement).closest(".tab-menu-trigger")) {
        setActiveMenu(null);
      }
    };
    if (activeMenu) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activeMenu]);

  // Handle scroll to close menu (prevent floating menu disconnect)
  useEffect(() => {
    const handleScroll = () => setActiveMenu(null);
    window.addEventListener("scroll", handleScroll, true);
    return () => window.removeEventListener("scroll", handleScroll, true);
  }, []);

  return (
    <div className="flex gap-2 items-center overflow-x-auto scrollbar-hide">
      {files.map((f) => (
        <div 
          key={f.id} 
          className={`flex items-center gap-2 px-3 py-1 border relative transition-all duration-300 ${
            activeFileId === f.id 
              ? "bg-accent text-black border-accent shadow-[0_0_10px_rgba(0,255,136,0.2)]" 
              : "border-border text-accent/60 hover:border-accent/40"
          }`}
        >
          <span 
            onClick={() => setActiveFileId(f.id)} 
            className="cursor-pointer text-[12px] whitespace-nowrap uppercase font-bold"
          >
            {f.name}
          </span>
          <button
            className="opacity-60 hover:opacity-100 transition-opacity p-1 tab-menu-trigger"
            onClick={(e) => {
              const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
              setActiveMenu(activeMenu?.id === f.id ? null : { id: f.id, rect });
            }}
          >
            <MoreHorizontal size={14} />
          </button>
          
          <AnimatePresence>
            {activeMenu?.id === f.id && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="fixed bg-card border border-accent p-2 z-[9999] flex flex-col gap-1 w-36 shadow-[0_10px_40px_rgba(0,0,0,0.8)] cyber-chamfer-sm"
                style={{ top: `${activeMenu.rect.bottom + 8}px`, left: `${activeMenu.rect.left}px` }}
              >
                <button 
                  className="text-[10px] text-left text-accent hover:bg-accent/10 px-3 py-2 flex items-center gap-2 transition-colors uppercase font-bold" 
                  onClick={() => { onRename(f.id, f.name); setActiveMenu(null); }}
                >
                  <Type size={12} /> Rename
                </button>
                <button 
                  className="text-[10px] text-left text-accent-secondary hover:bg-accent-secondary/10 px-3 py-2 flex items-center gap-2 transition-colors uppercase font-bold" 
                  onClick={() => { duplicateFile(f.id); setActiveMenu(null); toast("NODE_DUPLICATED", "success"); }}
                >
                  <CopyIcon size={12} /> Duplicate
                </button>
                <div className="h-px bg-border/50 my-1" />
                <button 
                  className="text-[10px] text-left text-destructive hover:bg-destructive/10 px-3 py-2 flex items-center gap-2 transition-colors uppercase font-bold" 
                  onClick={() => { onDelete(f.id); setActiveMenu(null); }}
                >
                  <Trash2 size={12} /> Delete
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
      <button 
        onClick={() => addFile("untitled.md", "# NEW_FRAGMENT")} 
        className="p-2 border border-border shrink-0 text-accent hover:border-accent transition-colors bg-card/30"
      >
        <Plus size={16} />
      </button>
    </div>
  );
}
