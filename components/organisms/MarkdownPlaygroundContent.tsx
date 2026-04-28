"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useMarkdownEditor } from "@/hooks/useMarkdownEditor";
import { useMarkdownActions } from "@/hooks/useMarkdownActions";
import { ConfirmationModal } from "@/components/atoms/ConfirmationModal";
import { toast } from "@/components/atoms/Toast";
import { FileUp, List as ListIcon, Minimize2 } from "lucide-react";
import { MarkdownToolbar } from "@/components/molecules/MarkdownToolbar";
import { FileTabs } from "@/components/molecules/FileTabs";
import { MarkdownEditorPane } from "@/components/molecules/MarkdownEditorPane";
import { MarkdownPreviewPane } from "@/components/molecules/MarkdownPreviewPane";
import { MarkdownModals } from "@/components/molecules/MarkdownModals";

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

  if (!isLoaded || !activeFileId) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center font-mono text-accent">
        <div className="animate-pulse tracking-[0.4em] uppercase">Initializing_System...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-foreground font-mono p-4">
      <header className="border-b border-border pb-4 mb-4 relative z-20">
        <MarkdownToolbar 
          viewMode={viewMode}
          setViewMode={setViewMode}
          isMobile={isMobile}
          readTime={readTime}
          wordCount={wordCount}
          charCount={charCount}
          syncStatus={syncStatus}
          onImport={() => setModal("import")}
          onExport={() => setModal("export")}
          onCopy={handleCopy}
          copied={copied}
          showToc={showToc}
          setShowToc={setShowToc}
        />

        <FileTabs 
          files={files}
          activeFileId={activeFileId}
          setActiveFileId={setActiveFileId}
          addFile={addFile}
          duplicateFile={duplicateFile}
          onRename={(id, name) => setRenameState({ id, name })}
          onDelete={(id) => setDeleteState(id)}
        />

        <div 
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setIsDragOver(false); handleFileUpload(e.dataTransfer.files); }}
          className={`border-2 border-dashed rounded-lg p-6 transition-all flex flex-col items-center justify-center gap-3 relative overflow-hidden ${
            isDragOver ? "border-accent bg-accent/5" : "border-border/30 bg-card/5"
          }`}
        >
          <div className="absolute inset-0 cyber-grid-bg opacity-5 pointer-events-none" />
          <FileUp size={24} className={isDragOver ? "text-accent animate-bounce" : "text-muted-foreground opacity-40"} />
          <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest text-center">
            Drop your markdown file here or <label className="text-accent cursor-pointer hover:underline">click to browse <input type="file" className="hidden" onChange={(e) => handleFileUpload(e.target.files)} accept=".md,.mdx,.txt" /></label>
          </p>
        </div>
      </header>

      <div className="flex gap-4 h-[calc(100vh-380px)] min-h-[450px] relative">
        <motion.main key={viewMode} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex gap-0 overflow-hidden relative">
          {(viewMode === "editor" || (viewMode === "split" && !isMobile)) && (
            <MarkdownEditorPane 
              activeFile={activeFile}
              updateFileContent={updateFileContent}
              editorParentRef={editorParentRef}
              onScroll={handleEditorScroll}
              width={viewMode === "split" && !isMobile ? `${splitRatio}%` : "100%"}
            />
          )}

          {viewMode === "split" && !isMobile && (
            <div 
              onMouseDown={() => setIsResizing(true)} 
              className={`w-1 cursor-col-resize hover:bg-accent/40 transition-colors flex items-center justify-center ${isResizing ? "bg-accent" : "bg-transparent"}`}
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
        </motion.main>

        <AnimatePresence>
          {showToc && (
            <motion.aside initial={{ x: 300, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 300, opacity: 0 }} className="w-64 border border-accent/20 bg-card/5 p-4 overflow-auto hidden lg:block">
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
    </div>
  );
}
