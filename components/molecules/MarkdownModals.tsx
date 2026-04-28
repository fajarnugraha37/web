"use client";

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Download, 
  FolderOpen, 
  GitBranchIcon as Github, 
  FilePlus, 
  Globe 
} from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { MarkdownIcon, HtmlIcon, PdfIcon } from "@/components/atoms/Icons";

interface MarkdownModalsProps {
  modal: "import" | "export" | "github" | null;
  setModal: (val: any) => void;
  githubUrl: string;
  setGithubUrl: (val: string) => void;
  onGithubFetch: () => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDownloadMd: () => void;
  onDownloadHtml: () => void;
  onDownloadPdf: () => void;
  renameState: { id: string; name: string } | null;
  setRenameState: (state: any) => void;
  onRenameConfirm: () => void;
}

/**
 * Molecule: MarkdownModals
 * Consolidates all interactive dialogs for the Markdown playground.
 */
export function MarkdownModals({
  modal,
  setModal,
  githubUrl,
  setGithubUrl,
  onGithubFetch,
  onFileUpload,
  onDownloadMd,
  onDownloadHtml,
  onDownloadPdf,
  renameState,
  setRenameState,
  onRenameConfirm,
}: MarkdownModalsProps) {
  return (
    <AnimatePresence>
      {/* Export Modal */}
      {modal === "export" && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-background/80 backdrop-blur-md" onClick={() => setModal(null)} />
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-sm bg-card border border-accent p-6 cyber-chamfer shadow-[0_0_50px_rgba(0,255,136,0.2)]">
             <h2 className="text-lg font-bold text-accent mb-6 uppercase tracking-widest flex items-center gap-2"><Download size={18} /> Export Fragment</h2>
             <div className="grid gap-3">
               <button onClick={onDownloadMd} className="flex items-center gap-3 p-4 bg-muted/30 border border-border hover:border-accent transition-all group">
                  <MarkdownIcon className="w-6 h-6 text-accent" />
                  <div className="text-left"><p className="text-xs font-bold uppercase">Markdown</p><p className="text-[8px] opacity-50 font-mono">RAW_SOURCE.md</p></div>
               </button>
               <button onClick={onDownloadHtml} className="flex items-center gap-3 p-4 bg-muted/30 border border-border hover:border-accent transition-all group">
                  <HtmlIcon className="w-6 h-6 text-accent" />
                  <div className="text-left"><p className="text-xs font-bold uppercase">HTML Document</p><p className="text-[8px] opacity-50 font-mono">WEB_ARCHIVE.html</p></div>
               </button>
               <button onClick={onDownloadPdf} className="flex items-center gap-3 p-4 bg-muted/30 border border-border hover:border-accent transition-all group">
                  <PdfIcon className="w-6 h-6 text-accent" />
                  <div className="text-left"><p className="text-xs font-bold uppercase">PDF Report</p><p className="text-[8px] opacity-50 font-mono">STATIC_RECORD.pdf</p></div>
               </button>
             </div>
          </motion.div>
        </div>
      )}

      {/* Import Modal */}
      {modal === "import" && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-background/80 backdrop-blur-md" onClick={() => setModal(null)} />
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-sm bg-card border border-accent p-6 cyber-chamfer shadow-[0_0_50px_rgba(0,255,136,0.2)]">
             <h2 className="text-lg font-bold text-accent mb-6 uppercase tracking-widest flex items-center gap-2"><FolderOpen size={18} /> Ingest Data</h2>
             <div className="grid gap-3">
               <button onClick={() => setModal("github")} className="flex items-center gap-3 p-4 bg-muted/30 border border-border hover:border-accent transition-all group">
                  <Github className="w-6 h-6 text-accent" />
                  <div className="text-left"><p className="text-xs font-bold uppercase">GitHub Source</p><p className="text-[8px] opacity-50 font-mono">REMOTE_FETCH.sh</p></div>
               </button>
               <label className="flex items-center gap-3 p-4 bg-muted/30 border border-border hover:border-accent transition-all group cursor-pointer">
                  <FilePlus className="w-6 h-6 text-accent" />
                  <div className="text-left"><p className="text-xs font-bold uppercase">Local File</p><p className="text-[8px] opacity-50 font-mono">UPLOAD_STREAM.bin</p></div>
                  <input type="file" className="hidden" onChange={onFileUpload} accept=".md,.mdx,.txt" />
               </label>
             </div>
          </motion.div>
        </div>
      )}

      {/* GitHub Handshake */}
      {modal === "github" && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-background/80 backdrop-blur-md" onClick={() => setModal("import")} />
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-md bg-card border border-accent-secondary p-6 cyber-chamfer shadow-[0_0_50px_rgba(255,0,255,0.1)]">
             <h2 className="text-lg font-bold text-accent-secondary mb-4 uppercase tracking-widest flex items-center gap-2"><Github size={18} /> GitHub Handshake</h2>
             <p className="text-[10px] font-mono text-muted-foreground mb-4 lowercase">// INPUT_RAW_CONTENT_URL_OR_BLOB_PATH</p>
             <input 
               autoFocus
               className="w-full bg-black/50 border border-accent-secondary/30 p-3 text-xs font-mono outline-none focus:border-accent-secondary mb-6 text-accent-secondary"
               placeholder="https://github.com/..." 
               value={githubUrl}
               onChange={(e) => setGithubUrl(e.target.value)}
               onKeyDown={(e) => e.key === "Enter" && onGithubFetch()}
             />
             <div className="flex justify-end gap-3">
                <Button variant="ghost" size="sm" onClick={() => setModal("import")}>ABORT</Button>
                <Button variant="secondary" size="sm" onClick={onGithubFetch}>CONNECT</Button>
             </div>
          </motion.div>
        </div>
      )}

      {/* Rename Modal */}
      {renameState && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-background/80 backdrop-blur-md" onClick={() => setRenameState(null)} />
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-sm bg-card border border-accent-tertiary p-6 cyber-chamfer shadow-[0_0_50px_rgba(0,212,255,0.1)]">
             <h2 className="text-lg font-bold text-accent-tertiary mb-4 uppercase tracking-widest flex items-center gap-2"><Globe size={18} /> Re-Label Node</h2>
             <input 
               autoFocus
               className="w-full bg-black/50 border border-accent-tertiary/30 p-3 text-xs font-mono outline-none focus:border-accent-tertiary mb-6 text-accent-tertiary"
               value={renameState.name}
               onChange={(e) => setRenameState({ ...renameState, name: e.target.value })}
               onKeyDown={(e) => e.key === "Enter" && onRenameConfirm()}
             />
             <div className="flex justify-end gap-3">
                <Button variant="ghost" size="sm" onClick={() => setRenameState(null)}>ABORT</Button>
                <Button variant="outline" size="sm" className="text-accent-tertiary border-accent-tertiary/50" onClick={onRenameConfirm}>UPDATE_LABEL</Button>
             </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
