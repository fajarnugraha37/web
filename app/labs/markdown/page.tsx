"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages as lezerLanguages } from "@codemirror/language-data";
import { vim } from "@replit/codemirror-vim";
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
import { mdxComponents } from "@/components/MDXComponents";
import { MermaidDiagram } from "@/components/MermaidDiagram";
import {
  MoreHorizontal,
  Plus,
  Copy,
  Check,
  X,
  Download,
  Github,
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
  GripVertical,
} from "lucide-react";
import { MarkdownIcon, HtmlIcon, PdfIcon } from "@/components/Icons";
import { motion, AnimatePresence } from "motion/react";
import { useIsMobile } from "@/hooks/use-mobile";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// --- GitHub Alerts Logic ---
const Alert = ({
  children,
  type,
}: {
  children: React.ReactNode;
  type: string;
}) => {
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
      <p className="markdown-alert-title">
        <Icon size={16} />
        {type}
      </p>
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
      // Remove the alert tag from the children
      const newChildren = React.Children.map(props.children, (child: any) => {
        if (child.props?.children?.[0] === text) {
          return {
            ...child,
            props: {
              ...child.props,
              children: [
                text.replace(
                  /^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*/i,
                  "",
                ),
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

const DropZone = ({
  onFileAdd,
}: {
  onFileAdd: (name: string, content: string) => void;
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        if (typeof evt.target?.result === "string") {
          onFileAdd(file.name, evt.target.result);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div
      onClick={() => fileInputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onDrop={(e) => {
        e.preventDefault();
        e.stopPropagation();
        const file = e.dataTransfer.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (evt) => {
            if (typeof evt.target?.result === "string") {
              onFileAdd(file.name, evt.target.result);
            }
          };
          reader.readAsText(file);
        }
      }}
      className="border border-dashed border-accent/20 bg-accent/5 hover:bg-accent/10 transition-all cursor-pointer py-8 px-4 text-center mb-4 group"
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".md,.mdx,.txt"
        className="hidden"
      />
      <p className="text-accent/60 group-hover:text-accent text-[10px] uppercase tracking-[0.2em] font-bold">
        Drop your Markdown file here or click to browse
      </p>
    </div>
  );
};

type File = { id: string; name: string; content: string };

export default function MarkdownPlayground() {
  const isMobile = useIsMobile();
  const [files, setFiles] = useState<File[]>([]);
  const [activeFileId, setActiveFileId] = useState("");
  const [viewMode, setViewMode] = useState<"editor" | "split" | "preview">(
    "split",
  );
  const [isLoaded, setIsLoaded] = useState(false);
  const [syncStatus, setSyncStatus] = useState<"idle" | "saving" | "saved">(
    "idle",
  );
  const [showToc, setShowToc] = useState(false);
  const [modal, setModal] = useState<"import" | "export" | null>(null);
  const [githubUrl, setGithubUrl] = useState("");
  const [activeMenu, setActiveMenu] = useState<{ id: string; rect: DOMRect } | null>(null);
  const [renameModal, setRenameModal] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [deleteModal, setDeleteModal] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [splitRatio, setSplitRatio] = useState(50); // percentage for editor
  const [isResizing, setIsResizing] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const editorParentRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const isSyncingScroll = useRef(false);

  // --- Resizing Logic ---
  const startResizing = useCallback(() => setIsResizing(true), []);
  const stopResizing = useCallback(() => setIsResizing(false), []);

  const resize = useCallback(
    (e: MouseEvent) => {
      if (!isResizing) return;
      const container = editorParentRef.current?.parentElement;
      if (!container) return;
      const containerRect = container.getBoundingClientRect();
      const newRatio =
        ((e.clientX - containerRect.left) / containerRect.width) * 100;
      if (newRatio > 20 && newRatio < 80) setSplitRatio(newRatio);
    },
    [isResizing],
  );

  useEffect(() => {
    if (isResizing) {
      window.addEventListener("mousemove", resize);
      window.addEventListener("mouseup", stopResizing);
    }
    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, [isResizing, resize, stopResizing]);

  // --- Outside Click Handling ---
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      //Whitelisting triggers and content to prevent premature closure
      if (activeMenu && !target.closest(".file-menu-trigger") && !target.closest(".file-menu-content")) {
        setActiveMenu(null);
      }
      if (modal && !target.closest(".modal-content")) {
        setModal(null);
      }
      if (renameModal && !target.closest(".modal-content")) {
        setRenameModal(null);
      }
      if (deleteModal && !target.closest(".modal-content")) {
        setDeleteModal(null);
      }
    };
    window.addEventListener("mousedown", handleOutsideClick);
    return () => window.removeEventListener("mousedown", handleOutsideClick);
  }, [activeMenu, modal, renameModal, deleteModal]);

  // Load from localStorage
  useEffect(() => {
    const savedFiles = localStorage.getItem("markdown-lab-files");
    const savedActiveId = localStorage.getItem("markdown-lab-active-id");
    if (savedFiles) {
      try {
        const parsed = JSON.parse(savedFiles);
        setFiles(parsed);
        if (savedActiveId) setActiveFileId(savedActiveId);
        else if (parsed.length > 0) setActiveFileId(parsed[0].id);
      } catch (e) {
        const initialFile = {
          id: "1",
          name: "untitled.md",
          content: "# MARKDOWN.EXE",
        };
        setFiles([initialFile]);
        setActiveFileId("1");
      }
    } else {
      const initialFile = {
        id: "1",
        name: "untitled.md",
        content: "# MARKDOWN.EXE",
      };
      setFiles([initialFile]);
      setActiveFileId("1");
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (isLoaded) {
      setSyncStatus("saving");
      localStorage.setItem("markdown-lab-files", JSON.stringify(files));
      localStorage.setItem("markdown-lab-active-id", activeFileId);
      const timer = setTimeout(() => setSyncStatus("saved"), 500);
      const idleTimer = setTimeout(() => setSyncStatus("idle"), 2000);
      return () => {
        clearTimeout(timer);
        clearTimeout(idleTimer);
      };
    }
  }, [files, activeFileId, isLoaded]);

  const activeFile = files.find((f) => f.id === activeFileId) || files[0];
  const wordCount =
    activeFile?.content?.split(/\s+/).filter(Boolean).length || 0;
  const charCount = activeFile?.content?.length || 0;
  const readTime = Math.ceil(wordCount / 200) || 0;

  const updateFileContent = (content: string) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === activeFileId ? { ...f, content } : f)),
    );
  };

  const addFile = (name: string, content: string) => {
    const newFile = { id: Date.now().toString(), name, content };
    setFiles([...files, newFile]);
    setActiveFileId(newFile.id);
  };

  // --- Scroll Synchronization ---
  const handleEditorScroll = useCallback(() => {
    if (
      viewMode !== "split" ||
      isSyncingScroll.current ||
      !editorParentRef.current ||
      !previewRef.current
    )
      return;

    isSyncingScroll.current = true;
    const editorEl = editorParentRef.current.querySelector(".cm-scroller");
    if (editorEl) {
      const percentage =
        editorEl.scrollTop / (editorEl.scrollHeight - editorEl.clientHeight);
      previewRef.current.scrollTop =
        percentage *
        (previewRef.current.scrollHeight - previewRef.current.clientHeight);
    }
    setTimeout(() => {
      isSyncingScroll.current = false;
    }, 50);
  }, [viewMode]);

  const handlePreviewScroll = useCallback(() => {
    if (
      viewMode !== "split" ||
      isSyncingScroll.current ||
      !editorParentRef.current ||
      !previewRef.current
    )
      return;

    isSyncingScroll.current = true;
    const editorEl = editorParentRef.current.querySelector(".cm-scroller");
    if (editorEl) {
      const percentage =
        previewRef.current.scrollTop /
        (previewRef.current.scrollHeight - previewRef.current.clientHeight);
      editorEl.scrollTop =
        percentage * (editorEl.scrollHeight - editorEl.clientHeight);
    }
    setTimeout(() => {
      isSyncingScroll.current = false;
    }, 50);
  }, [viewMode]);

  // --- Keyboard Shortcuts ---
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        setSyncStatus("saved");
        setTimeout(() => setSyncStatus("idle"), 2000);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "o") {
        e.preventDefault();
        setModal("import");
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "b") {
        // Simple bold implementation for now - actual selection wrapping needs CM API access
        e.preventDefault();
      }
    };
    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, []);

  const handleCopy = () => {
    if (!activeFile) return;
    navigator.clipboard.writeText(activeFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const generateExportHtml = (articleHtml: string, isForPdf = false) => {
    const sanitized = DOMPurify.sanitize(articleHtml);
    return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>${activeFile.name}</title>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;900&family=JetBrains+Mono:wght@400;700&display=swap');
      :root { --accent: #00ff88; --background: #0a0a0f; --foreground: #e0e0e0; --border: #2a2a3a; }
      body { font-family: 'JetBrains Mono', monospace; background: var(--background); color: var(--foreground); line-height: 1.8; padding: ${isForPdf ? "40px" : "3rem"}; max-width: 900px; margin: 0 auto; }
      h1, h2, h3 { font-family: 'Orbitron', sans-serif; text-transform: uppercase; }
      pre { background: #000; padding: 1.5rem; border: 1px solid var(--accent); border-left: 4px solid var(--accent); border-radius: 4px; }
      code { color: var(--accent); }
      blockquote { border-left: 4px solid #ff00ff; background: rgba(255, 0, 255, 0.05); padding: 1.5rem; }
      table { border-collapse: collapse; width: 100%; border: 1px solid var(--border); }
      th, td { border: 1px solid var(--border); padding: 1rem; }
    </style></head><body><h1>${activeFile.name}</h1><div class="content">${sanitized}</div></body></html>`;
  };

  const downloadPdf = async () => {
    if (!previewRef.current) return;
    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.left = "-10000px";
    document.body.appendChild(iframe);
    const iframeDoc = iframe.contentWindow?.document;
    if (!iframeDoc) return;
    const previewHtml =
      previewRef.current.querySelector(".prose")?.innerHTML ||
      previewRef.current.innerHTML;
    const sanitizedHtml = previewHtml.replace(/okl(ab|ch)\([^)]+\)/g, "#888");
    iframeDoc.open();
    iframeDoc.write(generateExportHtml(sanitizedHtml, true));
    iframeDoc.close();
    await new Promise((resolve) => setTimeout(resolve, 2000));
    iframe.style.width = "900px";
    iframe.style.height = `${iframeDoc.body.scrollHeight}px`;
    try {
      const canvas = await html2canvas(iframeDoc.body, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#0a0a0f",
        width: 900,
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(activeFile.name.replace(".md", ".pdf"));
    } finally {
      document.body.removeChild(iframe);
      setModal(null);
    }
  };

  const downloadHtml = () => {
    if (!previewRef.current) return;
    const previewHtml =
      previewRef.current.querySelector(".prose")?.innerHTML ||
      previewRef.current.innerHTML;
    const blob = new Blob([generateExportHtml(previewHtml)], {
      type: "text/html;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = activeFile.name.replace(".md", ".html");
    link.click();
    setModal(null);
  };

  if (!isLoaded || !activeFile) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center font-mono text-accent">
        <div className="animate-pulse tracking-[0.4em] uppercase">
          Initializing_System...
        </div>
      </div>
    );
  }

  // --- TOC Extraction ---
  const headings = activeFile.content.match(/^#{1,3} .+/gm) || [];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#fce803] font-mono p-4">
      <header className="border-b border-border pb-4 mb-4 relative z-20">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 mb-6">
          <div className="flex flex-col gap-1 items-center md:items-start text-center md:text-left">
            <h1 className="text-2xl font-bold text-accent tracking-tighter">
              MARKDOWN.EXE
            </h1>
            <div className="flex items-center gap-3 text-[9px] text-muted-foreground uppercase tracking-wider">
              <span>
                {readTime} Min Read | {wordCount} Words | {charCount} Chars
              </span>
              {syncStatus !== "idle" && (
                <span
                  className={`flex items-center gap-1 ${syncStatus === "saved" ? "text-green-500" : "text-yellow-500"}`}
                >
                  <Save size={10} />
                  {syncStatus === "saving" ? "SYNCING..." : "SYNC_SUCCESS"}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col items-center md:items-end gap-4">
            <div className="flex bg-[#111] border border-accent/30 p-1 w-fit">
              {(isMobile
                ? ["editor", "preview"]
                : ["editor", "split", "preview"]
              ).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode as any)}
                  className={`px-6 py-1.5 text-[10px] uppercase tracking-widest transition-all duration-300 ${
                    viewMode === mode
                      ? "bg-accent text-black font-bold shadow-[0_0_10px_rgba(0,255,136,0.5)]"
                      : "text-accent hover:bg-accent/10"
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setModal("import")}
                className="text-[10px] px-4 py-2 bg-accent/10 border border-accent/30 text-accent flex items-center gap-2 hover:bg-accent/20 transition-colors"
              >
                <FolderOpen size={12} /> IMPORT
              </button>
              <button
                onClick={() => setModal("export")}
                className="text-[10px] px-4 py-2 bg-accent/10 border border-accent/30 text-accent flex items-center gap-2 hover:bg-accent/20 transition-colors"
              >
                <Download size={12} /> EXPORT
              </button>
              <button
                onClick={handleCopy}
                className="text-[10px] px-4 py-2 bg-accent/10 border border-accent/30 text-accent flex items-center gap-2 hover:bg-accent/20 transition-colors"
              >
                {copied ? (
                  <Check size={12} className="text-green-500" />
                ) : (
                  <Copy size={12} />
                )}
                {copied ? "COPIED" : "COPY"}
              </button>
              <button
                onClick={() => setShowToc(!showToc)}
                className={`hidden lg:block text-[10px] px-4 py-2 border transition-colors ${showToc ? "bg-accent text-black border-accent" : "bg-accent/10 border-accent/30 text-accent"}`}
              >
                <ListIcon size={12} />
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-2 items-center mb-4 overflow-x-auto pb-2 scrollbar-hide">
          {files.map((f) => (
            <div
              key={f.id}
              className={`flex items-center gap-2 px-3 py-1 border relative ${activeFileId === f.id ? "bg-accent text-black border-accent" : "border-border text-accent/60"}`}
            >
              <span
                onClick={() => setActiveFileId(f.id)}
                className="cursor-pointer text-[12px] whitespace-nowrap uppercase font-bold"
              >
                {f.name}
              </span>
              <MoreHorizontal
                size={14}
                className="cursor-pointer opacity-60 hover:opacity-100 file-menu-trigger"
                onClick={(e) => {
                  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                  setActiveMenu(activeMenu?.id === f.id ? null : { id: f.id, rect });
                }}
              />
              {activeMenu?.id === f.id && (
                <div 
                  className="fixed bg-black border border-accent p-2 z-[9999] flex flex-col gap-2 w-32 shadow-[0_0_20px_rgba(0,255,136,0.3)] file-menu-content" 
                  style={{ 
                    top: `${activeMenu.rect.bottom + 8}px`, 
                    left: `${activeMenu.rect.left}px`,
                    clipPath: "polygon(0 0, 90% 0, 100% 10%, 100% 100%, 10% 100%, 0 90%)" 
                  }}
                >
                  <button
                    className="text-[9px] text-left text-accent hover:text-white px-2 py-1 hover:bg-accent/10 transition-colors"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setRenameModal({ id: f.id, name: f.name });
                      setActiveMenu(null);
                    }}
                  >
                    RENAME_TAB
                  </button>
                  <button
                    className="text-[9px] text-left text-accent hover:text-white px-2 py-1 hover:bg-accent/10 transition-colors"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      const file = files.find((x) => x.id === f.id);
                      if (file) addFile(file.name + " (copy)", file.content);
                      setActiveMenu(null);
                    }}
                  >
                    DUPLICATE
                  </button>
                  <button
                    className="text-[9px] text-left text-red-500 hover:text-red-300 px-2 py-1 hover:bg-red-500/10 transition-colors"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setDeleteModal(f.id);
                      setActiveMenu(null);
                    }}
                  >
                    WIPE_DATA
                  </button>
                </div>
              )}
            </div>
          ))}
          <button
            onClick={() => addFile("new.md", "")}
            className="p-2 border border-border shrink-0 text-accent hover:border-accent transition-colors"
          >
            <Plus size={16} />
          </button>
        </div>
        <DropZone onFileAdd={addFile} />
      </header>

      {/* --- MODALS --- */}
      <AnimatePresence>
        {modal === "import" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="modal-content bg-[#050505] border border-accent/40 p-8 max-w-md w-full shadow-[0_0_50px_rgba(0,255,136,0.15)] relative overflow-hidden"
              style={{
                clipPath:
                  "polygon(0 0, 95% 0, 100% 5%, 100% 100%, 5% 100%, 0 95%)",
              }}
            >
              {/* Corner Accents */}
              <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-accent" />
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-accent" />

              <div className="flex justify-between items-center mb-8 border-b border-accent/20 pb-4">
                <div className="flex flex-col">
                  <h2 className="text-xl font-black text-accent tracking-[0.2em] uppercase italic italic-neon">
                    Import_Module
                  </h2>
                  <span className="text-[8px] text-accent/40 uppercase tracking-widest">
                    SYS//NETWORK_INITIALIZED
                  </span>
                </div>
                <button
                  onClick={() => setModal(null)}
                  className="text-accent hover:text-white hover:scale-110 transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] text-accent font-black uppercase tracking-[0.3em] flex items-center gap-2">
                    <span className="w-1 h-1 bg-accent" /> TARGET_URL
                  </label>
                  <div className="flex gap-2 p-1 bg-accent/5 border border-accent/20 focus-within:border-accent/60 transition-colors">
                    <input
                      type="text"
                      placeholder="https://raw.githubusercontent.com/..."
                      value={githubUrl}
                      onChange={(e) => setGithubUrl(e.target.value)}
                      className="flex-1 bg-transparent p-2 text-xs text-accent focus:outline-none font-mono placeholder:text-accent/20"
                    />
                    <button
                      onClick={async () => {
                        try {
                          const res = await fetch(githubUrl);
                          const text = await res.text();
                          addFile(
                            githubUrl.split("/").pop() || "imported.md",
                            text,
                          );
                          setModal(null);
                        } catch (e) {
                          alert("CONNECTION_ERROR");
                        }
                      }}
                      className="bg-accent text-black px-6 py-2 text-[10px] font-black uppercase hover:brightness-125 transition-all glow-btn"
                    >
                      FETCH
                    </button>
                  </div>
                </div>
                <div className="text-center pt-4">
                  <p className="text-[8px] text-accent/30 uppercase tracking-[0.4em]">
                    OR_USE_MAIN_DROPZONE_BUFFERS
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {modal === "export" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="modal-content bg-[#050505] border border-accent/40 p-8 max-w-lg w-full shadow-[0_0_50px_rgba(0,255,136,0.15)] relative overflow-hidden"
              style={{
                clipPath:
                  "polygon(0 0, 95% 0, 100% 5%, 100% 100%, 5% 100%, 0 95%)",
              }}
            >
              {/* Corner Accents */}
              <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-accent" />
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-accent" />

              <div className="flex justify-between items-center mb-8 border-b border-accent/20 pb-4">
                <div className="flex flex-col">
                  <h2 className="text-xl font-black text-accent tracking-[0.2em] uppercase italic">
                    Export_Sequence
                  </h2>
                  <span className="text-[8px] text-accent/40 uppercase tracking-widest">
                    SELECT_OUTPUT_FORMAT
                  </span>
                </div>
                <button
                  onClick={() => setModal(null)}
                  className="text-accent hover:text-white hover:scale-110 transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    id: "md",
                    name: "Markdown",
                    sub: "RAW_SRC.md",
                    icon: MarkdownIcon,
                    fn: () => {
                      const blob = new Blob([activeFile.content], {
                        type: "text/markdown",
                      });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = activeFile.name;
                      a.click();
                      setModal(null);
                    },
                  },
                  {
                    id: "html",
                    name: "HTML_Doc",
                    sub: "WEB_ARCH.html",
                    icon: HtmlIcon,
                    fn: downloadHtml,
                  },
                  {
                    id: "pdf",
                    name: "PDF_Report",
                    sub: "STAT_REC.pdf",
                    icon: PdfIcon,
                    fn: downloadPdf,
                  },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={opt.fn}
                    className="flex flex-col items-center gap-4 p-6 border border-accent/20 bg-accent/5 hover:bg-accent/10 hover:border-accent/60 group transition-all relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-8 h-8 bg-accent/10 -mr-4 -mt-4 rotate-45 group-hover:bg-accent/20 transition-all" />
                    <opt.icon className="w-10 h-10 text-accent group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_rgba(0,255,136,0.5)] transition-all" />
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] font-black uppercase tracking-[0.1em] text-accent">
                        {opt.name}
                      </span>
                      <span className="text-[7px] opacity-40 uppercase font-mono tracking-tighter">
                        {opt.sub}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}

        {renameModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="modal-content bg-[#050505] border border-accent/40 p-8 max-w-sm w-full relative"
              style={{
                clipPath:
                  "polygon(0 0, 90% 0, 100% 10%, 100% 100%, 10% 100%, 0 90%)",
              }}
            >
              <h2 className="text-lg font-black text-accent mb-6 uppercase tracking-[0.2em] italic">
                Rename_Module
              </h2>
              <input
                type="text"
                value={renameModal.name}
                onChange={(e) =>
                  setRenameModal({ ...renameModal, name: e.target.value })
                }
                className="w-full bg-accent/5 border border-accent/30 p-3 text-xs text-accent focus:border-accent outline-none mb-6 font-mono"
              />
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setRenameModal(null)}
                  className="px-4 py-2 text-[9px] text-accent/60 uppercase font-black tracking-widest hover:text-accent transition-colors"
                >
                  CANCEL
                </button>
                <button
                  onClick={() => {
                    setFiles(
                      files.map((f) =>
                        f.id === renameModal.id
                          ? { ...f, name: renameModal.name }
                          : f,
                      ),
                    );
                    setRenameModal(null);
                  }}
                  className="bg-accent text-black px-6 py-2 text-[9px] font-black uppercase hover:brightness-125 transition-all"
                >
                  APPLY_CHANGES
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {deleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="modal-content bg-[#050000] border border-red-500/40 p-8 max-w-sm w-full relative"
              style={{
                clipPath:
                  "polygon(0 0, 90% 0, 100% 10%, 100% 100%, 10% 100%, 0 90%)",
              }}
            >
              <h2 className="text-lg font-black text-red-500 mb-2 uppercase tracking-[0.2em] italic">
                WIPE_MODULE?
              </h2>
              <p className="text-[10px] text-red-500/60 mb-8 font-mono uppercase tracking-widest leading-loose">
                // CRITICAL_WARNING:
                <br />
                All sector data will be permanently overwritten. Operation
                cannot be reversed.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setDeleteModal(null)}
                  className="px-4 py-2 text-[9px] text-accent/60 uppercase font-black tracking-widest"
                >
                  ABORT
                </button>
                <button
                  onClick={() => {
                    const newFiles = files.filter((f) => f.id !== deleteModal);
                    if (newFiles.length === 0) {
                      setFiles([
                        {
                          id: Date.now().toString(),
                          name: "untitled.md",
                          content: "",
                        },
                      ]);
                      setActiveFileId("1");
                    } else {
                      setFiles(newFiles);
                      if (activeFileId === deleteModal)
                        setActiveFileId(newFiles[0].id);
                    }
                    setDeleteModal(null);
                  }}
                  className="bg-red-600 text-white px-6 py-2 text-[9px] font-black uppercase hover:bg-red-500 transition-all shadow-[0_0_15px_rgba(239,68,68,0.3)]"
                >
                  EXECUTE_WIPE
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex gap-4 h-[calc(100vh-420px)] min-h-[500px] relative">
        <motion.main
          key={viewMode}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 flex gap-0 overflow-hidden relative"
        >
          {/* EDITOR PANE */}
          {(viewMode === "editor" || (viewMode === "split" && !isMobile)) && (
            <div
              ref={editorParentRef}
              onScroll={handleEditorScroll}
              style={{
                width: viewMode === "split" ? `${splitRatio}%` : "100%",
              }}
              className="border border-accent/20 bg-card/5 overflow-hidden relative group hover:border-accent/40 transition-colors flex flex-col h-full"
            >
              <div className="absolute top-2 right-4 text-[8px] text-accent/20 uppercase tracking-[0.2em] z-10 pointer-events-none">
                -- VIM_MODE_ACTIVE --
              </div>

              {!activeFile.content && (
                <div className="absolute top-12 left-12 text-accent/20 pointer-events-none font-mono text-sm animate-pulse z-10">
                  Type or paste your markdown here...
                </div>
              )}

              <CodeMirror
                value={activeFile.content}
                height="100%"
                theme={vscodeDark}
                extensions={[
                  vim(),
                  markdown({
                    base: markdownLanguage,
                    codeLanguages: lezerLanguages,
                  }),
                ]}
                onChange={(value) => updateFileContent(value)}
                className="text-sm font-mono flex-1 overflow-hidden"
                basicSetup={{
                  lineNumbers: true,
                  foldGutter: true,
                  dropCursor: true,
                  syntaxHighlighting: true,
                  highlightActiveLine: true,
                  autocompletion: true,
                }}
              />
            </div>
          )}

          {/* RESIZE DIVIDER */}
          {viewMode === "split" && !isMobile && (
            <div
              onMouseDown={startResizing}
              className={`w-1 cursor-col-resize hover:bg-accent/40 transition-colors flex items-center justify-center group ${isResizing ? "bg-accent" : "bg-transparent"}`}
            >
              <div className="h-8 w-px bg-accent/20 group-hover:bg-accent/60" />
            </div>
          )}

          {/* PREVIEW PANE */}
          {(viewMode === "preview" || (viewMode === "split" && !isMobile)) && (
            <div
              ref={previewRef}
              onScroll={handlePreviewScroll}
              style={{
                width: viewMode === "split" ? `${100 - splitRatio}%` : "100%",
              }}
              className="markdown-body p-6 bg-card/5 border border-border/20 font-mono overflow-auto relative h-full"
            >
              {/* Full Screen Toggle */}
              <button
                onClick={() => setIsFullScreen(true)}
                className="absolute top-4 right-4 p-2 bg-accent/10 border border-accent/20 text-accent hover:bg-accent hover:text-black transition-all z-20"
                title="Full Screen Preview"
              >
                <Maximize2 size={14} />
              </button>

              <div className="prose prose-invert max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm, remarkMath, remarkEmoji]}
                  rehypePlugins={[rehypeKatex, rehypeSlug, rehypeRaw]}
                  components={customComponents as any}
                >
                  {DOMPurify.sanitize(activeFile?.content || "")}
                </ReactMarkdown>
              </div>
            </div>
          )}
        </motion.main>

        {/* --- TOC SIDEBAR --- */}
        <AnimatePresence>
          {showToc && (
            <motion.aside
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              className="w-64 border border-accent/20 bg-card/5 p-4 overflow-auto hidden lg:block"
            >
              <h3 className="text-[10px] font-bold text-accent uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                <ListIcon size={12} /> CONTENT_STRUCTURE
              </h3>
              <div className="space-y-2">
                {headings.map((h, i) => {
                  const level = h.match(/^#+/)?.[0].length || 1;
                  const text = h.replace(/^#+ /, "");
                  const id = text.toLowerCase().replace(/\s+/g, "-");
                  return (
                    <button
                      key={i}
                      onClick={() => {
                        const el = document.getElementById(id);
                        if (el) el.scrollIntoView({ behavior: "smooth" });
                      }}
                      className={`block text-left text-[10px] hover:text-accent transition-colors truncate w-full ${level === 1 ? "font-bold text-accent/80" : level === 2 ? "pl-2 text-accent/60" : "pl-4 text-accent/40"}`}
                    >
                      {"> ".repeat(level - 1)}
                      {text}
                    </button>
                  );
                })}
                {headings.length === 0 && (
                  <span className="text-[9px] opacity-40 uppercase">
                    NO_HEADINGS_FOUND
                  </span>
                )}
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>

      {/* --- FULL SCREEN PREVIEW OVERLAY --- */}
      <AnimatePresence>
        {isFullScreen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[500] bg-[#0a0a0f] p-8 md:p-20 overflow-auto"
          >
            <button
              onClick={() => setIsFullScreen(false)}
              className="fixed opacity-50 top-24 right-6 p-4 bg-accent text-black rounded-full shadow-[0_0_30px_rgba(0,255,136,0.6)] hover:scale-110 active:scale-95 transition-all z-[510] border-2 border-black"
              title="Exit Full Screen (ESC)"
            >
              <Minimize2 size={24} />
            </button>

            <div className="max-w-4xl mx-auto markdown-body prose prose-invert">
              <div className="text-[10px] text-accent/40 uppercase tracking-[0.3em] mb-12 border-b border-accent/20 pb-4 flex justify-between">
                <span>Zen_Mode::Active</span>
                <span>{activeFile.name}</span>
              </div>
              <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkMath, remarkEmoji]}
                rehypePlugins={[rehypeKatex, rehypeSlug, rehypeRaw]}
                components={customComponents as any}
              >
                {DOMPurify.sanitize(activeFile?.content || "")}
              </ReactMarkdown>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
