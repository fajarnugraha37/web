"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { LabFile, ViewMode } from "@/types";
import { useIsMobile } from "./use-mobile";
import { MarkdownEditorRef } from "@/components/molecules/MarkdownEditorPane";

export function useMarkdownEditor() {
  const [files, setFiles] = useState<LabFile[]>([]);
  const [activeFileId, setActiveFileId] = useState<string>("");
  
  const contentRef = useRef<string>("");
  const [previewContent, setPreviewContent] = useState<string>("");
  
  const [viewMode, setViewMode] = useState<ViewMode>("split");
  const [isLoaded, setIsLoaded] = useState(false);
  const [syncStatus, setSyncStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [showToc, setShowToc] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const isMobile = useIsMobile();
  const editorParentRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const editorPaneRef = useRef<MarkdownEditorRef>(null);
  const isSyncingScroll = useRef(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const previewTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 1. DRY: Use useIsMobile to force 'preview' mode on mobile
  useEffect(() => {
    if (isMobile && viewMode === "split") {
      setViewMode("preview");
    }
  }, [isMobile, viewMode]);

  // Load from localStorage
  useEffect(() => {
    const savedFiles = localStorage.getItem("markdown-lab-files");
    const savedActiveId = localStorage.getItem("markdown-lab-active-id");
    const savedViewMode = localStorage.getItem("markdown-lab-view-mode");

    const fetchDefaultContent = async () => {
      try {
        const res = await fetch(
          "https://raw.githubusercontent.com/fajarnugraha37/fajarnugraha37.github.io/refs/heads/main/README.md"
        );
        const text = await res.text();
        const initialFile = { id: "1", name: "README.md", content: text };
        setFiles([initialFile]);
        setActiveFileId("1");
        contentRef.current = text;
        setPreviewContent(text);
      } catch (e) {
        const fallbackFile = { id: "1", name: "untitled.md", content: "# MARKDOWN.EXE" };
        setFiles([fallbackFile]);
        setActiveFileId("1");
        contentRef.current = "# MARKDOWN.EXE";
        setPreviewContent("# MARKDOWN.EXE");
      } finally {
        // Initial view determination
        if (savedViewMode) {
          setViewMode(savedViewMode as ViewMode);
        } else {
          setViewMode(window.innerWidth < 768 ? "preview" : "split");
        }
        setIsLoaded(true);
      }
    };

    if (savedFiles) {
      try {
        const parsed = JSON.parse(savedFiles);
        if (parsed.length > 0) {
          setFiles(parsed);
          const activeId = savedActiveId || parsed[0].id;
          const initialContent = parsed.find((f: any) => f.id === activeId)?.content || "";
          setActiveFileId(activeId);
          contentRef.current = initialContent;
          setPreviewContent(initialContent);
          
          if (savedViewMode) {
            setViewMode(savedViewMode as ViewMode);
          } else {
            setViewMode(window.innerWidth < 768 ? "preview" : "split");
          }
          setIsLoaded(true);
        } else {
          fetchDefaultContent();
        }
      } catch (e) {
        fetchDefaultContent();
      }
    } else {
      fetchDefaultContent();
    }
  }, []);

  // Save ViewMode preference
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("markdown-lab-view-mode", viewMode);
    }
  }, [viewMode, isLoaded]);

  const persistFiles = useCallback((newFiles: LabFile[], newActiveId: string) => {
    localStorage.setItem("markdown-lab-files", JSON.stringify(newFiles));
    localStorage.setItem("markdown-lab-active-id", newActiveId);
  }, []);

  // Sync contentRef back to the files array and localStorage (Debounced)
  useEffect(() => {
    if (!isLoaded || !activeFileId) return;

    const syncToStorage = () => {
      setSyncStatus("saving");
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      
      saveTimeoutRef.current = setTimeout(() => {
        setFiles(prev => {
          const newFiles = prev.map(f => f.id === activeFileId ? { ...f, content: contentRef.current } : f);
          persistFiles(newFiles, activeFileId);
          return newFiles;
        });
        
        setSyncStatus("saved");
        const idleTimer = setTimeout(() => setSyncStatus("idle"), 2000);
        return () => clearTimeout(idleTimer);
      }, 1000);
    };

    syncToStorage();
  }, [previewContent, activeFileId, isLoaded, persistFiles]);

  const updateFileContent = useCallback((content: string) => {
    contentRef.current = content; 
    
    if (previewTimeoutRef.current) clearTimeout(previewTimeoutRef.current);
    previewTimeoutRef.current = setTimeout(() => {
      setPreviewContent(content);
    }, 300);
  }, []);

  const switchActiveFile = useCallback((id: string) => {
    const file = files.find(f => f.id === id);
    if (file) {
      setActiveFileId(id);
      contentRef.current = file.content;
      setPreviewContent(file.content);
      persistFiles(files, id);
    }
  }, [files, persistFiles]);

  const addFile = useCallback((name: string, content: string) => {
    const newId = Date.now().toString();
    const newFile = { id: newId, name, content };
    setFiles((prev) => {
      const newFiles = [...prev, newFile];
      persistFiles(newFiles, newId);
      return newFiles;
    });
    setActiveFileId(newId);
    contentRef.current = content;
    setPreviewContent(content);
    return newId;
  }, [persistFiles]);

  const duplicateFile = useCallback((id: string) => {
    const original = files.find(f => f.id === id);
    if (!original) return;
    const newId = Date.now().toString();
    const newFile = { 
      id: newId, 
      name: `${original.name.replace('.md', '')}_copy.md`, 
      content: original.content 
    };
    setFiles(prev => {
      const newFiles = [...prev, newFile];
      persistFiles(newFiles, newId);
      return newFiles;
    });
    setActiveFileId(newId);
    contentRef.current = original.content;
    setPreviewContent(original.content);
  }, [files, persistFiles]);

  const deleteFile = useCallback((id: string) => {
    setFiles((prev) => {
      const newFiles = prev.filter((f) => f.id !== id);
      if (newFiles.length === 0) {
        const fallbackId = Date.now().toString();
        const fallback = { id: fallbackId, name: "untitled.md", content: "" };
        setActiveFileId(fallbackId);
        contentRef.current = "";
        setPreviewContent("");
        persistFiles([fallback], fallbackId);
        return [fallback];
      }
      if (activeFileId === id) {
        setActiveFileId(newFiles[0].id);
        contentRef.current = newFiles[0].content;
        setPreviewContent(newFiles[0].content);
        persistFiles(newFiles, newFiles[0].id);
      } else {
        persistFiles(newFiles, activeFileId);
      }
      return newFiles;
    });
  }, [activeFileId, persistFiles]);

  const renameFile = useCallback((id: string, newName: string) => {
    setFiles((prev) => {
      const newFiles = prev.map((f) => (f.id === id ? { ...f, name: newName } : f));
      persistFiles(newFiles, activeFileId);
      return newFiles;
    });
  }, [activeFileId, persistFiles]);

  const updateFileMetadata = useCallback((id: string, metadata: any) => {
    setFiles((prev) => {
      const newFiles = prev.map((f) => (f.id === id ? { ...f, metadata: { ...f.metadata, ...metadata } } : f));
      persistFiles(newFiles, activeFileId);
      return newFiles;
    });
  }, [activeFileId, persistFiles]);

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
    setActiveFileId: switchActiveFile,
    activeFile: files.find(f => f.id === activeFileId),
    activeContent: contentRef.current,
    previewContent,
    updateFileContent,
    addFile,
    duplicateFile,
    deleteFile,
    renameFile,
    updateFileMetadata,
    viewMode,
    setViewMode,
    isLoaded,
    syncStatus,
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
