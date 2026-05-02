"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FileUp } from "lucide-react";
import { MarkdownEditorPane } from "@/components/molecules/MarkdownEditorPane";

interface MarkdownEditorAreaProps {
  viewMode: string;
  isMobile: boolean;
  editorParentRef: React.RefObject<HTMLDivElement | null>;
  editorPaneRef: React.RefObject<any>;
  handleEditorScroll: () => void;
  splitRatio: number;
  onOpenAssets: () => void;
  isDragOver: boolean;
}

export function MarkdownEditorArea({
  viewMode,
  isMobile,
  editorParentRef,
  editorPaneRef,
  handleEditorScroll,
  splitRatio,
  onOpenAssets,
  isDragOver
}: MarkdownEditorAreaProps) {
  if (!(viewMode === "editor" || (viewMode === "split" && !isMobile))) return null;

  return (
    <div className="relative flex flex-col h-full overflow-hidden" style={{ width: viewMode === "split" && !isMobile ? `${splitRatio}%` : "100%" }}>
      <AnimatePresence>
        {isDragOver && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="absolute inset-0 z-50 bg-black/80 border-2 border-dashed border-accent flex flex-col items-center justify-center backdrop-blur-sm"
          >
            <FileUp size={48} className="text-accent animate-bounce mb-4" />
            <p className="text-accent font-bold tracking-widest uppercase text-xl">Drop file to import</p>
          </motion.div>
        )}
      </AnimatePresence>

      <MarkdownEditorPane 
        ref={editorPaneRef}
        editorParentRef={editorParentRef}
        onScroll={handleEditorScroll}
        width="100%"
        onOpenAssets={onOpenAssets}
      />
    </div>
  );
}
