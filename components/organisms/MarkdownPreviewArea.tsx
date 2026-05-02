"use client";

import React from "react";
import { MarkdownPreviewPane } from "@/components/molecules/MarkdownPreviewPane";
import { useMarkdownDocStore } from "@/lib/store/useMarkdownDocStore";

interface MarkdownPreviewAreaProps {
  viewMode: string;
  isMobile: boolean;
  previewRef: React.RefObject<HTMLDivElement | null>;
  handlePreviewScroll: () => void;
  setIsFullScreen: (full: boolean) => void;
  splitRatio: number;
}

/**
 * Organism: MarkdownPreviewArea
 * Subscribes directly to previewContent to isolate heavy MDX rendering.
 */
export function MarkdownPreviewArea({
  viewMode,
  isMobile,
  previewRef,
  handlePreviewScroll,
  setIsFullScreen,
  splitRatio
}: MarkdownPreviewAreaProps) {
  const content = useMarkdownDocStore(state => state.previewContent);
  
  if (!(viewMode === "preview" || (viewMode === "split" && !isMobile))) return null;

  return (
    <div className="flex flex-col h-full overflow-hidden" style={{ width: viewMode === "split" && !isMobile ? `${100 - splitRatio}%` : "100%" }}>
      <MarkdownPreviewPane 
        content={content}
        previewRef={previewRef}
        onScroll={handlePreviewScroll}
        onFullScreen={() => setIsFullScreen(true)}
        width="100%"
      />
    </div>
  );
}
