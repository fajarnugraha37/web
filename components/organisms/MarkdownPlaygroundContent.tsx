"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useMarkdownEditor } from "@/hooks/useMarkdownEditor";
import { useMarkdownActions } from "@/hooks/useMarkdownActions";
import { useMarkdownUIStore } from "@/lib/store/useMarkdownUIStore";
import { useMarkdownDocStore } from "@/lib/store/useMarkdownDocStore";
import { ConfirmationModal } from "@/components/atoms/ConfirmationModal";
import { toast } from "@/components/atoms/Toast";
import { List as ListIcon, Minimize2, FileText } from "lucide-react";
import { PageHeader } from "@/components/molecules/PageHeader";
import { MarkdownToolbar } from "@/components/molecules/MarkdownToolbar";
import { MarkdownSidebar } from "./MarkdownSidebar";
import { MarkdownEditorArea } from "./MarkdownEditorArea";
import { MarkdownPreviewArea } from "./MarkdownPreviewArea";
import { MarkdownModals } from "@/components/molecules/MarkdownModals";
import { ContentEditorSaveForm } from "@/components/molecules/ContentEditorSaveForm";
import { ContentEditorSearchModal } from "@/components/molecules/ContentEditorSearchModal";
import { AssetsPickerModal } from "@/components/molecules/AssetsPickerModal";
import { StatusBar } from "@/components/molecules/StatusBar";
import { MarkdownPreviewPane } from "@/components/molecules/MarkdownPreviewPane";

import { ENV } from "@/lib/env";

import { useDeleteBlogMutation } from "@/hooks/queries/useMarkdownQuery";

/**
 * Organism: MarkdownPlaygroundContent
 * Orchestrator for the Markdown Lab.
 * Includes layout animations and mobile adaptive logic.
 */
export function MarkdownPlaygroundContent() {
  const isMobile = useIsMobile();
  
  const {
    files,
    activeFileId,
    setActiveFileId,
    activeFile,
    updateFileContent,
    addFile,
    duplicateFile,
    deleteFile,
    renameFile,
    updateFileMetadata,
    viewMode,
    setViewMode,
    isLoaded,
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

  const previewContent = useMarkdownDocStore(state => state.previewContent);
  const headings = previewContent?.match(/^#{1,3} .+/gm) || [];

  // Mobile Adaptive Logic: Force preview if split is active on mobile
  useEffect(() => {
    if (isMobile && viewMode === "split") {
      setViewMode("preview");
    }
  }, [isMobile, viewMode, setViewMode]);

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
    activeContent: previewContent,
    addFile, 
    previewRef 
  });

  const activeModal = useMarkdownUIStore(state => state.activeModal);
  const openModal = useMarkdownUIStore(state => state.openModal);
  const closeModal = useMarkdownUIStore(state => state.closeModal);

  const deleteBlogMutation = useDeleteBlogMutation();

  const [renameState, setRenameState] = useState<{ id: string; name: string } | null>(null);
  const [deleteId, setDeleteState] = useState<string | null>(null);
  const [splitRatio, setSplitRatio] = useState(50);
  const [isResizing, setIsResizing] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [searchModalMode, setSearchModalMode] = useState<'open' | 'delete'>('open');
  const isWriteMode = ENV.IS_WRITE_MODE;

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
    openModal('search');
  };

  const handleContentSelect = async (slug: string, data?: any) => {
    if (searchModalMode === 'delete') {
      deleteBlogMutation.mutate(slug, {
        onSuccess: () => {
          toast("Post deleted successfully", "success");
        },
        onError: (err: any) => {
          toast(err.message, "error");
        }
      });
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

      <div className="flex flex-col lg:flex-row justify-between lg:items-end gap-4 mb-2 shrink-0">
        <MarkdownSidebar 
          files={files}
          activeFileId={activeFileId}
          setActiveFileId={setActiveFileId}
          addFile={addFile}
          duplicateFile={duplicateFile}
          onRenameRequest={(id, name) => setRenameState({ id, name })}
          onDeleteRequest={(id) => setDeleteState(id)}
        />
        <MarkdownToolbar 
          viewMode={viewMode}
          setViewMode={setViewMode}
          isMobile={isMobile}
          onImport={() => openModal("import")}
          onExport={() => openModal("export")}
          onCopy={handleCopy}
          copied={copied}
          showToc={showToc}
          setShowToc={setShowToc}
          onOpenMetadata={() => openModal("metadata")}
          onOpenContentEditor={handleOpenContentEditor}
        />
      </div>

      <div className="shrink-0 rounded-sm overflow-hidden border border-accent/20">
        <StatusBar />
      </div>

      <div className="flex gap-4 flex-1 min-h-0 relative mt-2">
        <AnimatePresence mode="wait">
          <motion.div 
            key={viewMode + (isMobile ? '-mobile' : '-desktop')}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.1, ease: "easeOut" }}
            className="flex-1 flex gap-0 border border-border/50 bg-[#0a0a0a] relative overflow-hidden"
            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setIsDragOver(false); handleFileUpload(e.dataTransfer.files); }}
          >
            <MarkdownEditorArea 
              viewMode={viewMode}
              isMobile={isMobile}
              editorParentRef={editorParentRef}
              editorPaneRef={editorPaneRef}
              handleEditorScroll={handleEditorScroll}
              splitRatio={splitRatio}
              onOpenAssets={() => openModal("assets")}
              isDragOver={isDragOver}
            />

            {viewMode === "split" && !isMobile && (
              <div 
                onMouseDown={() => setIsResizing(true)} 
                className={`w-1 cursor-col-resize hover:bg-accent/40 transition-colors flex items-center justify-center ${isResizing ? "bg-accent" : "bg-transparent"} z-10`}
              >
                <div className="h-8 w-px bg-accent/20" />
              </div>
            )}

            <MarkdownPreviewArea 
              viewMode={viewMode}
              isMobile={isMobile}
              previewRef={previewRef}
              handlePreviewScroll={handlePreviewScroll}
              setIsFullScreen={setIsFullScreen}
              splitRatio={splitRatio}
            />
          </motion.div>
        </AnimatePresence>

        <AnimatePresence>
          {showToc && (
            <motion.aside 
              initial={{ x: 300, opacity: 0 }} 
              animate={{ x: 0, opacity: 1 }} 
              exit={{ x: 300, opacity: 0 }} 
              className="w-64 border border-accent/20 bg-card/5 p-4 overflow-auto hidden lg:block shrink-0"
            >
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
        isOpen={activeModal === "search"}
        mode={searchModalMode}
        onClose={closeModal}
        onSelect={handleContentSelect}
      />

      <AssetsPickerModal 
        isOpen={activeModal === "assets"}
        onClose={closeModal}
        onSelect={handleAssetSelect}
      />

      {isWriteMode && (
        <ContentEditorSaveForm 
          isOpen={activeModal === "metadata"}
          onClose={closeModal}
          activeFile={activeFile}
          activeContent={previewContent}
          updateFileMetadata={updateFileMetadata}
          onSaveSuccess={() => toast("Post saved successfully", "success")}
        />
      )}
    </div>
  );
}
