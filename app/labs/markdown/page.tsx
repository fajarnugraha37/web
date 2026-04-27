"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages as lezerLanguages } from "@codemirror/language-data";
import { vim, Vim, getCM } from "@replit/codemirror-vim";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkEmoji from "remark-emoji";
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import rehypeRaw from "rehype-raw";
import DOMPurify from "isomorphic-dompurify";
import "katex/dist/katex.min.css";
import { mdxComponents } from "@/components/molecules/MDXComponents";
import { MermaidDiagram } from "@/components/molecules/MermaidDiagram";
import {
  MoreHorizontal,
  Plus,
  Copy,
  Check,
  X,
  Download,
  Info,
  Lightbulb,
  AlertTriangle,
  AlertOctagon,
  MessageSquare,
  List as ListIcon,
  Save,
  FolderOpen,
  Maximize2,
  Minimize2,
  FileUp,
  FilePlus,
  Trash2,
  Copy as CopyIcon,
  Type,
  GitBranchIcon as Github,
  Globe,
} from "lucide-react";
import { MarkdownIcon, HtmlIcon, PdfIcon } from "@/components/atoms/Icons";
import { motion, AnimatePresence } from "motion/react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useMarkdownEditor } from "@/hooks/useMarkdownEditor";
import { ConfirmationModal } from "@/components/atoms/ConfirmationModal";
import { Button } from "@/components/atoms/Button";
import { toast } from "@/components/atoms/Toast";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// --- Components ---

const Alert = ({ children, type }: { children: React.ReactNode; type: string }) => {
  const icons: Record<string, any> = {
    note: Info,
    tip: Lightbulb,
    important: MessageSquare,
    warning: AlertTriangle,
    caution: AlertOctagon,
  };
  const Icon = icons[type] || Info;
  return (
    <div className={`markdown-alert markdown-alert-${type}`}>
      <p className="markdown-alert-title"><Icon size={16} />{type}</p>
      <div className="markdown-alert-content">{children}</div>
    </div>
  );
};

const customComponents = {
  ...mdxComponents,
  mermaid: MermaidDiagram,
  blockquote: (props: any) => {
    const text = props.children?.[1]?.props?.children?.[0] || "";
    const match = text.match(/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]/i);
    if (match) {
      const type = match[1].toLowerCase();
      const newChildren = React.Children.map(props.children, (child: any) => {
        if (child.props?.children?.[0] === text) {
          return {
            ...child,
            props: {
              ...child.props,
              children: [
                text.replace(/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*/i, ""),
                ...child.props.children.slice(1),
              ],
            },
          };
        }
        return child;
      });
      return <Alert type={type}>{newChildren}</Alert>;
    }
    return <blockquote {...props} />;
  },
};

export default function MarkdownPlayground() {
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

  const [modal, setModal] = useState<"import" | "export" | "github" | null>(null);
  const [githubUrl, setGithubUrl] = useState("");
  const [activeMenu, setActiveMenu] = useState<{ id: string; rect: DOMRect } | null>(null);
  const [renameState, setRenameState] = useState<{ id: string; name: string } | null>(null);
  const [deleteId, setDeleteState] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [splitRatio, setSplitRatio] = useState(50);
  const [isResizing, setIsResizing] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  
  // Statistics - Calculated from the instant activeContent ref
  const wordCount = activeContent?.split(/\s+/).filter(Boolean).length || 0;
  const charCount = activeContent?.length || 0;
  const readTime = Math.ceil(wordCount / 200) || 0;

  // Handle click outside for tab menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (activeMenu && !(event.target as HTMLElement).closest(".tab-menu-trigger")) {
        setActiveMenu(null);
      }
    };
    if (activeMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activeMenu]);

  // Resizing
  const resize = useCallback((e: MouseEvent) => {
    if (!isResizing) return;
    const container = editorParentRef.current?.parentElement;
    if (!container) return;
    const containerRect = container.getBoundingClientRect();
    const newRatio = ((e.clientX - containerRect.left) / containerRect.width) * 100;
    if (newRatio > 20 && newRatio < 80) setSplitRatio(newRatio);
  }, [isResizing, editorParentRef]);

  useEffect(() => {
    if (isResizing) {
      window.addEventListener("mousemove", resize);
      window.addEventListener("mouseup", () => setIsResizing(false));
    }
    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", () => setIsResizing(false));
    };
  }, [isResizing, resize]);

  // Actions
  const handleCopy = () => {
    if (!activeContent) return;
    navigator.clipboard.writeText(activeContent);
    setCopied(true);
    toast("MARKDOWN_CONTENT_COPIED", "success");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement> | React.DragEvent) => {
    let files_to_proc: FileList | null = null;
    if ("files" in e.target && e.target.files) {
      files_to_proc = e.target.files;
    } else if ("dataTransfer" in e && e.dataTransfer.files) {
      files_to_proc = e.dataTransfer.files;
    }

    if (!files_to_proc) return;

    Array.from(files_to_proc).forEach(file => {
      if (file.name.endsWith(".md") || file.name.endsWith(".mdx") || file.name.endsWith(".txt")) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          const content = ev.target?.result as string;
          addFile(file.name, content);
          toast(`INGESTED: ${file.name}`, "success");
        };
        reader.readAsText(file);
      }
    });
    setModal(null);
  };

  const fetchFromGithub = async () => {
    if (!githubUrl) return;
    try {
      let rawUrl = githubUrl;
      if (githubUrl.includes("github.com") && !githubUrl.includes("raw.githubusercontent.com")) {
        rawUrl = githubUrl
          .replace("github.com", "raw.githubusercontent.com")
          .replace("/blob/", "/");
      }
      const res = await fetch(rawUrl);
      if (!res.ok) throw new Error("Failed to fetch");
      const text = await res.text();
      const name = rawUrl.split("/").pop() || "github_import.md";
      addFile(name, text);
      toast(`HANDSHAKE_SUCCESS: ${name}`, "success");
      setModal(null);
      setGithubUrl("");
    } catch (e) {
      toast("GITHUB_HANDSHAKE_FAILED", "error");
    }
  };

  const generateExportHtml = (articleHtml: string, isForPdf = false) => {
    const sanitized = DOMPurify.sanitize(articleHtml);
    return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>${activeFile?.name || "export"}</title>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;900&family=JetBrains+Mono:wght@400;700&display=swap');
      :root { --accent: #00ff88; --background: #0a0a0f; --foreground: #e0e0e0; --border: #2a2a3a; }
      body { font-family: 'JetBrains Mono', monospace; background: var(--background); color: var(--foreground); line-height: 1.8; padding: ${isForPdf ? "40px" : "3rem"}; max-width: 900px; margin: 0 auto; }
      h1, h2, h3 { font-family: 'Orbitron', sans-serif; text-transform: uppercase; }
      pre { background: #000; padding: 1.5rem; border: 1px solid var(--accent); border-left: 4px solid var(--accent); border-radius: 4px; overflow-x: auto; }
      code { color: var(--accent); font-family: 'JetBrains Mono', monospace; }
      blockquote { border-left: 4px solid #ff00ff; background: rgba(255, 0, 255, 0.05); padding: 1.5rem; }
      table { border-collapse: collapse; width: 100%; border: 1px solid var(--border); }
      th, td { border: 1px solid var(--border); padding: 1rem; }
    </style></head><body><h1>${activeFile?.name || "export"}</h1><div class="content">${sanitized}</div></body></html>`;
  };

  const downloadPdf = async () => {
    if (!previewRef.current) return;
    toast("GENERATING_PDF_REPORT...", "info");
    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.left = "-10000px";
    document.body.appendChild(iframe);
    const iframeDoc = iframe.contentWindow?.document;
    if (!iframeDoc) return;
    const previewHtml = previewRef.current.querySelector(".prose")?.innerHTML || previewRef.current.innerHTML;
    const sanitizedHtml = previewHtml.replace(/okl(ab|ch)\([^)]+\)/g, "#888");
    iframeDoc.open();
    iframeDoc.write(generateExportHtml(sanitizedHtml, true));
    iframeDoc.close();
    await new Promise((resolve) => setTimeout(resolve, 2000));
    iframe.style.width = "900px";
    iframe.style.height = `${iframeDoc.body.scrollHeight}px`;
    try {
      const canvas = await html2canvas(iframeDoc.body, { scale: 2, useCORS: true, backgroundColor: "#0a0a0f", width: 900 });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
      pdf.save((activeFile?.name || "document").replace(".md", ".pdf"));
      toast("PDF_EXPORT_COMPLETE", "success");
    } catch (e) {
      toast("PDF_EXPORT_FAILED", "error");
    } finally {
      document.body.removeChild(iframe);
      setModal(null);
    }
  };

  const downloadHtml = () => {
    if (!previewRef.current) return;
    const previewHtml = previewRef.current.querySelector(".prose")?.innerHTML || previewRef.current.innerHTML;
    const blob = new Blob([generateExportHtml(previewHtml)], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = (activeFile?.name || "document").replace(".md", ".html");
    link.click();
    toast("HTML_EXPORT_COMPLETE", "success");
    setModal(null);
  };

  const downloadMd = () => {
    if (!activeContent) return;
    const blob = new Blob([activeContent], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = activeFile?.name || "document.md";
    link.click();
    toast("MARKDOWN_EXPORT_COMPLETE", "success");
    setModal(null);
  };

  if (!isLoaded || !activeFileId) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center font-mono text-accent">
        <div className="animate-pulse tracking-[0.4em] uppercase">Initializing_System...</div>
      </div>
    );
  }

  const headings = previewContent.match(/^#{1,3} .+/gm) || [];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-foreground font-mono p-4">
      <header className="border-b border-border pb-4 mb-4 relative z-20">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 mb-6">
          <div className="flex flex-col gap-1 items-center md:items-start">
            <h1 className="text-2xl font-bold text-accent tracking-tighter">MARKDOWN.EXE</h1>
            <div className="flex items-center gap-3 text-[9px] text-muted-foreground uppercase">
              <span>{readTime} Min Read | {wordCount} Words | {charCount} Chars</span>
              {syncStatus !== "idle" && (
                <span className={`flex items-center gap-1 ${syncStatus === "saved" ? "text-green-500" : "text-yellow-500"}`}>
                  <Save size={10} />
                  {syncStatus === "saving" ? "SYNCING..." : "SYNC_SUCCESS"}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col items-center md:items-end gap-4">
            <div className="flex bg-[#111] border border-accent/30 p-1">
              {(isMobile ? ["editor", "preview"] : ["editor", "split", "preview"]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode as any)}
                  className={`px-6 py-1.5 text-[10px] uppercase tracking-widest transition-all ${
                    viewMode === mode ? "bg-accent text-black font-bold shadow-[0_0_10px_rgba(0,255,136,0.5)]" : "text-accent hover:bg-accent/10"
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="xs" onClick={() => setModal("import")} className="gap-2 px-4 py-3 h-auto">
                <FolderOpen size={12} /> IMPORT
              </Button>
              <Button variant="outline" size="xs" onClick={() => setModal("export")} className="gap-2 px-4 py-3 h-auto">
                <Download size={12} /> EXPORT
              </Button>
              <Button variant="outline" size="xs" onClick={handleCopy} className="gap-2 px-4 py-3 h-auto">
                {copied ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
                {copied ? "COPIED" : "COPY"}
              </Button>
              <Button variant="outline" size="xs" onClick={() => setShowToc(!showToc)} className={`hidden lg:flex px-4 py-3 h-auto ${showToc ? "bg-accent text-black border-accent" : ""}`}>
                <ListIcon size={12} />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex gap-2 items-center mb-4 overflow-x-auto pb-2 scrollbar-hide">
          {files.map((f) => (
            <div key={f.id} className={`flex items-center gap-2 px-3 py-1 border relative ${activeFileId === f.id ? "bg-accent text-black border-accent shadow-[0_0_10px_rgba(0,255,136,0.2)]" : "border-border text-accent/60"}`}>
              <span onClick={() => setActiveFileId(f.id)} className="cursor-pointer text-[12px] whitespace-nowrap uppercase font-bold">{f.name}</span>
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
                    <button className="text-[10px] text-left text-accent hover:bg-accent/10 px-3 py-2 flex items-center gap-2 transition-colors uppercase font-bold" onClick={() => { setRenameState({ id: f.id, name: f.name }); setActiveMenu(null); }}>
                      <Type size={12} /> Rename
                    </button>
                    <button className="text-[10px] text-left text-accent-secondary hover:bg-accent-secondary/10 px-3 py-2 flex items-center gap-2 transition-colors uppercase font-bold" onClick={() => { duplicateFile(f.id); setActiveMenu(null); toast("NODE_DUPLICATED", "success"); }}>
                      <CopyIcon size={12} /> Duplicate
                    </button>
                    <div className="h-px bg-border/50 my-1" />
                    <button className="text-[10px] text-left text-destructive hover:bg-destructive/10 px-3 py-2 flex items-center gap-2 transition-colors uppercase font-bold" onClick={() => { setDeleteState(f.id); setActiveMenu(null); }}>
                      <Trash2 size={12} /> Delete
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
          <button onClick={() => addFile("untitled.md", "# NEW_FRAGMENT")} className="p-2 border border-border shrink-0 text-accent hover:border-accent transition-colors bg-card/30">
            <Plus size={16} />
          </button>
        </div>

        <div 
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setIsDragOver(false); handleFileUpload(e); }}
          className={`border-2 border-dashed rounded-lg p-6 transition-all flex flex-col items-center justify-center gap-3 relative overflow-hidden ${isDragOver ? "border-accent bg-accent/5" : "border-border/30 bg-card/5"}`}
        >
          <div className="absolute inset-0 cyber-grid-bg opacity-5 pointer-events-none" />
          <FileUp size={24} className={isDragOver ? "text-accent animate-bounce" : "text-muted-foreground opacity-40"} />
          <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest text-center">
            Drop your markdown file here or <label className="text-accent cursor-pointer hover:underline">click to browse <input type="file" className="hidden" onChange={handleFileUpload} accept=".md,.mdx,.txt" /></label>
          </p>
        </div>
      </header>

      <div className="flex gap-4 h-[calc(100vh-380px)] min-h-[450px] relative">
        <motion.main key={viewMode} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex gap-0 overflow-hidden relative">
          {(viewMode === "editor" || (viewMode === "split" && !isMobile)) && (
            <div ref={editorParentRef} onScroll={handleEditorScroll} style={{ width: viewMode === "split" && !isMobile ? `${splitRatio}%` : "100%" }} className="border border-accent/20 bg-card/5 overflow-hidden relative group hover:border-accent/40 transition-colors flex flex-col h-full">
              <div className="absolute top-2 right-4 text-[8px] text-accent/20 uppercase tracking-[0.2em] z-10 pointer-events-none">-- VIM_MODE_ACTIVE --</div>
              <CodeMirror
                value={activeFile?.content || ""}
                height="100%"
                theme={vscodeDark}
                extensions={[
                  vim(), 
                  markdown({ base: markdownLanguage, codeLanguages: lezerLanguages })
                ]}
                onCreateEditor={(view) => {
                  const cm = getCM(view);
                  // 2. Simulasikan penekanan tombol 'i'
                  if (cm) {
                    Vim.handleKey(cm, 'i', 'user');
                  }
                }}
                onChange={updateFileContent}
                className="text-sm font-mono flex-1 overflow-hidden"
                autoFocus={true}
                basicSetup={{ 
                  lineNumbers: true, 
                  foldGutter: true, 
                  dropCursor: true, 
                  syntaxHighlighting: true, 
                  highlightActiveLine: true, 
                  autocompletion: true, 
                  defaultKeymap: true 
                }}
              />
            </div>
          )}

          {viewMode === "split" && !isMobile && (
            <div onMouseDown={() => setIsResizing(true)} className={`w-1 cursor-col-resize hover:bg-accent/40 transition-colors flex items-center justify-center ${isResizing ? "bg-accent" : "bg-transparent"}`}>
              <div className="h-8 w-px bg-accent/20" />
            </div>
          )}

          {(viewMode === "preview" || (viewMode === "split" && !isMobile)) && (
            <div ref={previewRef} onScroll={handlePreviewScroll} style={{ width: viewMode === "split" && !isMobile ? `${100 - splitRatio}%` : "100%" }} className="markdown-body p-6 md:p-10 bg-card/5 border border-border/20 font-mono overflow-auto relative h-full">
              <button onClick={() => setIsFullScreen(true)} className="absolute top-4 right-4 p-2 bg-accent/10 border border-accent/20 text-accent hover:bg-accent hover:text-black transition-all z-20"><Maximize2 size={14} /></button>
              <div className="prose prose-invert max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath, remarkEmoji]} rehypePlugins={[rehypeKatex, rehypeSlug, rehypeRaw]} components={customComponents as any}>
                  {DOMPurify.sanitize(previewContent || "")}
                </ReactMarkdown>
              </div>
            </div>
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
              <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath, remarkEmoji]} rehypePlugins={[rehypeKatex, rehypeSlug, rehypeRaw]} components={customComponents as any}>
                {DOMPurify.sanitize(previewContent || "")}
              </ReactMarkdown>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals for Import/Export/Rename */}
      <AnimatePresence>
        {modal === "export" && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-background/80 backdrop-blur-md" onClick={() => setModal(null)} />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-sm bg-card border border-accent p-6 cyber-chamfer shadow-[0_0_50px_rgba(0,255,136,0.2)]">
               <h2 className="text-lg font-bold text-accent mb-6 uppercase tracking-widest flex items-center gap-2"><Download size={18} /> Export Fragment</h2>
               <div className="grid gap-3">
                 <button onClick={downloadMd} className="flex items-center gap-3 p-4 bg-muted/30 border border-border hover:border-accent transition-all group">
                    <MarkdownIcon className="w-6 h-6 text-accent" />
                    <div className="text-left"><p className="text-xs font-bold uppercase">Markdown</p><p className="text-[8px] opacity-50 font-mono">RAW_SOURCE.md</p></div>
                 </button>
                 <button onClick={downloadHtml} className="flex items-center gap-3 p-4 bg-muted/30 border border-border hover:border-accent transition-all group">
                    <HtmlIcon className="w-6 h-6 text-accent" />
                    <div className="text-left"><p className="text-xs font-bold uppercase">HTML Document</p><p className="text-[8px] opacity-50 font-mono">WEB_ARCHIVE.html</p></div>
                 </button>
                 <button onClick={downloadPdf} className="flex items-center gap-3 p-4 bg-muted/30 border border-border hover:border-accent transition-all group">
                    <PdfIcon className="w-6 h-6 text-accent" />
                    <div className="text-left"><p className="text-xs font-bold uppercase">PDF Report</p><p className="text-[8px] opacity-50 font-mono">STATIC_RECORD.pdf</p></div>
                 </button>
               </div>
            </motion.div>
          </div>
        )}

        {modal === "import" && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-background/80 backdrop-blur-md" onClick={() => setModal(null)} />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-sm bg-card border border-accent p-6 cyber-chamfer shadow-[0_0_50px_rgba(0,255,136,0.2)]">
               <h2 className="text-lg font-bold text-accent mb-6 uppercase tracking-widest flex items-center gap-2"><FolderOpen size={18} /> Ingest Data</h2>
               <div className="grid gap-3">
                 <button onClick={() => { setModal("github"); }} className="flex items-center gap-3 p-4 bg-muted/30 border border-border hover:border-accent transition-all group">
                    <Github className="w-6 h-6 text-accent" />
                    <div className="text-left"><p className="text-xs font-bold uppercase">GitHub Source</p><p className="text-[8px] opacity-50 font-mono">REMOTE_FETCH.sh</p></div>
                 </button>
                 <label className="flex items-center gap-3 p-4 bg-muted/30 border border-border hover:border-accent transition-all group cursor-pointer">
                    <FilePlus className="w-6 h-6 text-accent" />
                    <div className="text-left"><p className="text-xs font-bold uppercase">Local File</p><p className="text-[8px] opacity-50 font-mono">UPLOAD_STREAM.bin</p></div>
                    <input type="file" className="hidden" onChange={handleFileUpload} accept=".md,.mdx,.txt" />
                 </label>
               </div>
            </motion.div>
          </div>
        )}

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
                 onKeyDown={(e) => e.key === "Enter" && fetchFromGithub()}
               />
               <div className="flex justify-end gap-3">
                  <Button variant="ghost" size="sm" onClick={() => setModal("import")}>ABORT</Button>
                  <Button variant="secondary" size="sm" onClick={fetchFromGithub}>CONNECT</Button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ConfirmationModal 
        isOpen={!!deleteId} 
        onClose={() => setDeleteState(null)} 
        onConfirm={() => deleteId && deleteFile(deleteId)}
        title="Wipe Fragment"
        message="This operation will permanently purge the selected knowledge fragment from local buffer memory. This action cannot be undone."
        variant="destructive"
        confirmLabel="PURGE_FILE"
      />

      <AnimatePresence>
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
                 onKeyDown={(e) => e.key === "Enter" && (renameFile(renameState.id, renameState.name), setRenameState(null), toast("LABEL_UPDATED", "success"))}
               />
               <div className="flex justify-end gap-3">
                  <Button variant="ghost" size="sm" onClick={() => setRenameState(null)}>ABORT</Button>
                  <Button variant="outline" size="sm" className="text-accent-tertiary border-accent-tertiary/50" onClick={() => { renameFile(renameState.id, renameState.name); setRenameState(null); toast("LABEL_UPDATED", "success"); }}>UPDATE_LABEL</Button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
