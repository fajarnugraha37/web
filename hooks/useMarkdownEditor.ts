"use client";

import { useRef, useCallback } from "react";
import { useMarkdownDocStore } from "@/lib/store/useMarkdownDocStore";
import { useMarkdownUIStore } from "@/lib/store/useMarkdownUIStore";
import { useIsMobile } from "./use-mobile";
import { MarkdownEditorRef } from "@/components/molecules/MarkdownEditorPane";

/**
 * Hook: useMarkdownEditor
 * Refactored for Zero-Lag.
 * Only returns structural/UI state. CONTENT updates are handled via direct leaf subscriptions.
 */
export function useMarkdownEditor() {
  const isMobile = useIsMobile();
  
  // Structural state (Stable - doesn't change on keystroke)
  const files = useMarkdownDocStore((state) => state.files);
  const activeFileId = useMarkdownDocStore((state) => state.activeFileId);
  const isLoaded = useMarkdownDocStore((state) => state.isLoaded);
  
  // Actions (Stable)
  const addFile = useMarkdownDocStore((state) => state.addFile);
  const updateContent = useMarkdownDocStore((state) => state.updateContent);
  const deleteFile = useMarkdownDocStore((state) => state.deleteFile);
  const renameFile = useMarkdownDocStore((state) => state.renameFile);
  const setActiveFileId = useMarkdownDocStore((state) => state.setActiveFile);
  const duplicateFile = useMarkdownDocStore((state) => state.duplicateFile);
  const updateFileMetadata = useMarkdownDocStore((state) => state.updateFileMetadata);
  
  // UI Store (Stable)
  const viewMode = useMarkdownUIStore((state) => state.viewMode);
  const setViewMode = useMarkdownUIStore((state) => state.setViewMode);
  const showToc = useMarkdownUIStore((state) => state.showToc);
  const setShowToc = useMarkdownUIStore((state) => state.setShowToc);
  const isFullScreen = useMarkdownUIStore((state) => state.isFullScreen);
  const setIsFullScreen = useMarkdownUIStore((state) => state.setIsFullScreen);

  // Refs for Scroll Sync
  const editorParentRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const editorPaneRef = useRef<MarkdownEditorRef>(null);
  const isSyncingScroll = useRef(false);

  // Scroll Sync Handlers
  const handleEditorScroll = useCallback(() => {
    if (viewMode !== "split" || isSyncingScroll.current || !editorParentRef.current || !previewRef.current)
      return;

    isSyncingScroll.current = true;
    const editorEl = editorParentRef.current.querySelector(".cm-scroller") as HTMLElement;
    if (editorEl) {
      const percentage = editorEl.scrollTop / (editorEl.scrollHeight - editorEl.clientHeight);
      previewRef.current.scrollTop = percentage * (previewRef.current.scrollHeight - previewRef.current.clientHeight);
    }
    setTimeout(() => { isSyncingScroll.current = false; }, 50);
  }, [viewMode]);

  const handlePreviewScroll = useCallback(() => {
    if (viewMode !== "split" || isSyncingScroll.current || !editorParentRef.current || !previewRef.current)
      return;

    isSyncingScroll.current = true;
    const editorEl = editorParentRef.current.querySelector(".cm-scroller") as HTMLElement;
    if (editorEl) {
      const percentage = previewRef.current!.scrollTop / (previewRef.current!.scrollHeight - previewRef.current!.clientHeight);
      editorEl.scrollTop = percentage * (editorEl.scrollHeight - editorEl.clientHeight);
    }
    setTimeout(() => { isSyncingScroll.current = false; }, 50);
  }, [viewMode]);

  return {
    files,
    activeFileId,
    setActiveFileId,
    activeFile: files.find((f) => f.id === activeFileId),
    updateFileContent: updateContent,
    addFile,
    duplicateFile,
    deleteFile,
    renameFile,
    updateFileMetadata,
    viewMode,
    setViewMode,
    isLoaded,
    syncStatus: "saved" as const,
    showToc,
    setShowToc,
    isFullScreen,
    setIsFullScreen,
    editorParentRef,
    previewRef,
    editorPaneRef,
    handleEditorScroll,
    handlePreviewScroll,
  };
}
