"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useMarkdownEditor } from "@/hooks/useMarkdownEditor";
import { useMarkdownActions } from "@/hooks/useMarkdownActions";
import { ConfirmationModal } from "@/components/atoms/ConfirmationModal";
import { toast } from "@/components/atoms/Toast";
import { FileUp, List as ListIcon, Minimize2, FileText } from "lucide-react";
import { PageHeader } from "@/components/molecules/PageHeader";
import { MarkdownToolbar } from "@/components/molecules/MarkdownToolbar";
import { FileTabs } from "@/components/molecules/FileTabs";
import { MarkdownEditorPane } from "@/components/molecules/MarkdownEditorPane";
import { MarkdownPreviewPane } from "@/components/molecules/MarkdownPreviewPane";
import { MarkdownModals } from "@/components/molecules/MarkdownModals";
import { ContentEditorSaveForm } from "@/components/molecules/ContentEditorSaveForm";
import { ContentEditorSearchModal } from "@/components/molecules/ContentEditorSearchModal";
import { AssetsPickerModal } from "@/components/molecules/AssetsPickerModal";
import { StatusBar } from "@/components/molecules/StatusBar";

import { ENV } from "@/lib/env";

/**
 * Organism: MarkdownPlaygroundContent
 * The primary orchestrator for the Markdown Laboratory workspace.
 */
export function MarkdownPlaygroundContent() {
  const isMobile = useIsMobile();
  const {
    files,
    activeFileId,
    setActiveFileId,
    activeFile,
    activeContent,
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
  } = useMarkdownEditor();

  const {
    modal,
    setModal,
    githubUrl,
    setGithubUrl,
    copied,
    handleCopy,
    handleFileUpload,
    fetchFromGithub,
    downloadPdf,
    downloadHtml,
    downloadMd,
  } = useMarkdownActions({ 
    activeFile, 
    activeContent, 
    addFile, 
    previewRef 
  });

  const [renameState, setRenameState] = useState<{ id: string; name: string } | null>(null);
  const [deleteId, setDeleteState] = useState<string | null>(null);
  const [splitRatio, setSplitRatio] = useState(50);
  const [isResizing, setIsResizing] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchModalMode, setSearchModalMode] = useState<'open' | 'delete'>('open');
  const [assetsModalOpen, setAssetsModalOpen] = useState(false);
  const [metadataModalOpen, setMetadataModalOpen] = useState(false);
  const isWriteMode = ENV.IS_WRITE_MODE;

  // Statistics
  const wordCount = activeContent?.split(/\s+/).filter(Boolean).length || 0;
  const charCount = activeContent?.length || 0;
  const readTime = Math.ceil(wordCount / 200) || 0;

  const headings = previewContent.match(/^#{1,3} .+/gm) || [];

  // Resizing logic
  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const container = editorParentRef.current?.parentElement;
      if (!container) return;
      const containerRect = container.getBoundingClientRect();
      const newRatio = ((e.clientX - containerRect.left) / containerRect.width) * 100;
      if (newRatio > 20 && newRatio < 80) setSplitRatio(newRatio);
    };
    const handleUp = () => setIsResizing(false);
    
    if (isResizing) {
      window.addEventListener("mousemove", handleMove);
      window.addEventListener("mouseup", handleUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    };
  }, [isResizing, editorParentRef]);

  const handleOpenContentEditor = (action: 'open' | 'delete') => {
    setSearchModalMode(action);
    setSearchModalOpen(true);
  };

  const handleContentSelect = async (slug: string, data?: any) => {
    if (searchModalMode === 'delete') {
      try {
        const res = await fetch(`/api/labs/markdown/${slug}`, {
          method: "DELETE",
        });
        if (res.ok) {
          toast("Post deleted successfully", "success");
        } else {
          throw new Error("Failed to delete");
        }
      } catch (err: any) {
        toast(err.message, "error");
      }
    } else if (data) {
      const newId = addFile(`${slug}.mdx`, data.content);
      updateFileMetadata(newId, {
        slug,
        title: data.title,
        description: data.description,
        tags: data.tags
      });
      toast("Content loaded successfully", "success");
    }
  };

  const handleAssetSelect = (injectionText: string) => {
    if (editorPaneRef.current) {
      editorPaneRef.current.insertTextAtCursor(injectionText);
      toast("Asset injected", "success");
    }
  };

  if (!isLoaded || !activeFileId) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center font-mono text-accent">
        <div className="animate-pulse tracking-[0.4em] uppercase">Initializing_System...</div>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-hidden bg-[#0a0a0a] text-foreground font-mono flex flex-col p-4 max-w-[1400px] mx-auto">
      <PageHeader 
        title="MARKDOWN"
        accentText="PLAYGROUND.EXE"
        tagText="DATA_STREAM // TEXT_EDITOR"
        tagIcon={FileText}
        subtitle="Live Markdown editor with split-pane preview"
        className="mb-6 shrink-0"
      />

      {/* Pane Header: FileTabs (Left) + ViewModes & Actions (Right) */}
      <div className="flex flex-col lg:flex-row justify-between lg:items-end gap-4 mb-2 shrink-0">
        <div className="flex-1 overflow-hidden">
          <FileTabs 
            files={files}
            activeFileId={activeFileId}
            setActiveFileId={setActiveFileId}
            addFile={addFile}
            duplicateFile={duplicateFile}
            onRename={(id, name) => setRenameState({ id, name })}
            onDelete={(id) => setDeleteState(id)}
          />
        </div>
        <MarkdownToolbar 
          viewMode={viewMode}
          setViewMode={setViewMode}
          isMobile={isMobile}
          onImport={() => setModal("import")}
          onExport={() => setModal("export")}
          onCopy={handleCopy}
          copied={copied}
          showToc={showToc}
          setShowToc={setShowToc}
          onOpenMetadata={() => setMetadataModalOpen(true)}
          onOpenContentEditor={handleOpenContentEditor}
        />
      </div>

      {/* Status Bar */}
      <div className="shrink-0 rounded-sm overflow-hidden border border-accent/20">
        <StatusBar 
          readTime={readTime}
          wordCount={wordCount}
          charCount={charCount}
          syncStatus={syncStatus}
        />
      </div>

      <div className="flex gap-4 flex-1 min-h-0 relative">
        <motion.div 
          key={viewMode} 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          className="flex-1 flex flex-col border border-border/50 bg-[#0a0a0a] relative overflow-hidden"
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setIsDragOver(false); handleFileUpload(e.dataTransfer.files); }}
        >
          {/* Smart Dropzone Overlay */}
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

          <div className="flex-1 flex gap-0 overflow-hidden relative">
            {(viewMode === "editor" || (viewMode === "split" && !isMobile)) && (
              <MarkdownEditorPane 
                ref={editorPaneRef}
                activeFile={activeFile}
                updateFileContent={updateFileContent}
                editorParentRef={editorParentRef}
                onScroll={handleEditorScroll}
                width={viewMode === "split" && !isMobile ? `${splitRatio}%` : "100%"}
                onOpenAssets={() => setAssetsModalOpen(true)}
              />
            )}

            {viewMode === "split" && !isMobile && (
              <div 
                onMouseDown={() => setIsResizing(true)} 
                className={`w-1 cursor-col-resize hover:bg-accent/40 transition-colors flex items-center justify-center ${isResizing ? "bg-accent" : "bg-transparent"} z-10`}
              >
                <div className="h-8 w-px bg-accent/20" />
              </div>
            )}

            {(viewMode === "preview" || (viewMode === "split" && !isMobile)) && (
              <MarkdownPreviewPane 
                content={previewContent}
                previewRef={previewRef}
                onScroll={handlePreviewScroll}
                onFullScreen={() => setIsFullScreen(true)}
                width={viewMode === "split" && !isMobile ? `${100 - splitRatio}%` : "100%"}
              />
            )}
          </div>
        </motion.div>

        <AnimatePresence>
          {showToc && (
            <motion.aside initial={{ x: 300, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 300, opacity: 0 }} className="w-64 border border-accent/20 bg-card/5 p-4 overflow-auto hidden lg:block shrink-0">
              <h3 className="text-[10px] font-bold text-accent uppercase tracking-[0.2em] mb-4 flex items-center gap-2"><ListIcon size={12} /> STRUCTURE</h3>
              <div className="space-y-2">
                {headings.map((h, i) => {
                  const level = h.match(/^#+/)?.[0].length || 1;
                  const text = h.replace(/^#+ /, "");
                  const id = text.toLowerCase().replace(/\s+/g, "-");
                  return (
                    <button key={i} onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })} className={`block text-left text-[10px] hover:text-accent truncate w-full ${level === 1 ? "font-bold text-accent/80" : level === 2 ? "pl-2 text-accent/60" : "pl-4 text-accent/40"}`}>
                      {"> ".repeat(level - 1)}{text}
                    </button>
                  );
                })}
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isFullScreen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[500] bg-[#0a0a0f] p-8 md:p-20 overflow-auto">
            <button onClick={() => setIsFullScreen(false)} className="fixed top-24 right-6 p-4 bg-accent text-black rounded-full z-[510]"><Minimize2 size={24} /></button>
            <div className="max-w-4xl mx-auto markdown-body prose prose-invert">
              <MarkdownPreviewPane 
                content={previewContent}
                previewRef={previewRef}
                onScroll={() => {}}
                onFullScreen={() => setIsFullScreen(false)}
                width="100%"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <MarkdownModals 
        modal={modal}
        setModal={setModal}
        githubUrl={githubUrl}
        setGithubUrl={setGithubUrl}
        onGithubFetch={fetchFromGithub}
        onFileUpload={(e) => handleFileUpload(e.target.files)}
        onDownloadMd={downloadMd}
        onDownloadHtml={downloadHtml}
        onDownloadPdf={downloadPdf}
        renameState={renameState}
        setRenameState={setRenameState}
        onRenameConfirm={() => {
          if (renameState) {
            renameFile(renameState.id, renameState.name);
            setRenameState(null);
            toast("LABEL_UPDATED", "success");
          }
        }}
      />

      <ConfirmationModal 
        isOpen={!!deleteId} 
        onClose={() => setDeleteState(null)} 
        onConfirm={() => {
          if (deleteId) {
            deleteFile(deleteId);
            setDeleteState(null);
          }
        }}
        title="Wipe Fragment"
        message="This operation will permanently purge the selected knowledge fragment from local buffer memory. This action cannot be undone."
        variant="destructive"
        confirmLabel="PURGE_FILE"
      />

      <ContentEditorSearchModal 
        isOpen={searchModalOpen}
        mode={searchModalMode}
        onClose={() => setSearchModalOpen(false)}
        onSelect={handleContentSelect}
      />

      <AssetsPickerModal 
        isOpen={assetsModalOpen}
        onClose={() => setAssetsModalOpen(false)}
        onSelect={handleAssetSelect}
      />

      {isWriteMode && (
        <ContentEditorSaveForm 
          isOpen={metadataModalOpen}
          onClose={() => setMetadataModalOpen(false)}
          activeFile={activeFile}
          activeContent={activeContent}
          updateFileMetadata={updateFileMetadata}
          onSaveSuccess={() => toast("Post saved successfully", "success")}
        />
      )}
    </div>
  );
}
