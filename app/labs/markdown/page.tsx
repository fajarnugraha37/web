"use client";

import React, { useState, useRef, useEffect } from "react";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs";
import "prismjs/components/prism-markdown";
import "prismjs/themes/prism-tomorrow.css";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkEmoji from "remark-emoji";
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import rehypeRaw from "rehype-raw";
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
} from "lucide-react";
import { MarkdownIcon, HtmlIcon, PdfIcon } from "@/components/Icons";
import { motion, AnimatePresence } from "motion/react";
import { useIsMobile } from "@/hooks/use-mobile";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const playgroundComponents = { ...mdxComponents, mermaid: MermaidDiagram };

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
        setFiles([{ id: "1", name: "untitled.md", content: "# MARKDOWN.EXE" }]);
        setActiveFileId("1");
      }
    } else {
      setFiles([{ id: "1", name: "untitled.md", content: "# MARKDOWN.EXE" }]);
      setActiveFileId("1");
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("markdown-lab-files", JSON.stringify(files));
      localStorage.setItem("markdown-lab-active-id", activeFileId);
    }
  }, [files, activeFileId, isLoaded]);

  const [modal, setModal] = useState<"import" | "export" | null>(null);
  const [githubUrl, setGithubUrl] = useState("");
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [renameModal, setRenameModal] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [deleteModal, setDeleteModal] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<any>(null);

  useEffect(() => {
    if (isMobile && viewMode === "split") {
      setViewMode("editor");
    }
  }, [isMobile, viewMode]);

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

  const handleCopy = () => {
    if (!activeFile) return;
    navigator.clipboard.writeText(activeFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isLoaded || !activeFile) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center font-mono text-accent">
        <div className="animate-pulse">INITIALIZING_SYSTEM...</div>
      </div>
    );
  }

  const generateExportHtml = (articleHtml: string, isForPdf = false) => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${activeFile.name}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;900&family=JetBrains+Mono:wght@400;700&display=swap');
    :root { 
      --accent: #00ff88; 
      --accent-secondary: #ff00ff;
      --accent-tertiary: #00d4ff;
      --background: #0a0a0f; 
      --foreground: #e0e0e0; 
      --card: #12121a;
      --border: #2a2a3a;
    }
    body { 
      font-family: 'JetBrains Mono', monospace;
      background: var(--background);
      color: var(--foreground);
      line-height: 1.8;
      padding: ${isForPdf ? "40px" : "3rem"};
      max-width: 900px;
      margin: 0 auto;
    }
    h1, h2, h3 { font-family: 'Orbitron', sans-serif; text-transform: uppercase; letter-spacing: -0.05em; }
    h1 { color: #fff; font-size: ${isForPdf ? "2.5rem" : "3.5rem"}; margin-bottom: 2rem; font-weight: 900; line-height: 1.1; }
    h2 { color: var(--accent-tertiary); border-bottom: 1px solid var(--border); padding-bottom: 0.5rem; margin-top: 3rem; font-size: 1.8rem; }
    pre { background: #000; padding: 1.5rem; border: 1px solid var(--accent-tertiary); border-left: 4px solid var(--accent-tertiary); overflow-x: auto; border-radius: 4px; margin: 2rem 0; box-shadow: inset 0 0 20px rgba(0,0,0,0.5); }
    code { font-family: 'JetBrains Mono', monospace; color: var(--accent); }
    pre code { color: var(--accent-tertiary); }
    blockquote { border-left: 4px solid var(--accent-secondary); background: rgba(255, 0, 255, 0.05); padding: 1.5rem; margin: 2rem 0; font-style: italic; color: #aaa; }
    table { border-collapse: collapse; width: 100%; margin: 2.5rem 0; border: 1px solid var(--border); }
    th, td { border: 1px solid var(--border); padding: 1rem; text-align: left; }
    th { background: rgba(255,255,255,0.05); color: var(--accent); font-weight: bold; }
    img { max-width: 100%; height: auto; border: 1px solid var(--border); border-radius: 8px; }
    a { color: var(--accent); text-decoration: none; border-bottom: 1px dashed var(--accent); }
    hr { border: 0; border-top: 1px solid var(--border); margin: 4rem 0; }
    .export-info { font-size: 0.7rem; opacity: 0.5; margin-bottom: 2rem; font-family: 'JetBrains Mono', monospace; }
  </style>
</head>
<body>
  <div class="export-info">[ PDF_REPORT :: ${new Date().toISOString()} ]</div>
  <h1>${activeFile.name}</h1>
  <div class="content">
    ${articleHtml}
  </div>
  <footer style="margin-top: 6rem; border-top: 1px solid var(--border); padding-top: 2rem; font-size: 0.8rem; color: #666; font-family: 'JetBrains Mono', monospace;">
    <p>© ${new Date().getFullYear()} SYS//OP. ALL_RIGHTS_RESERVED.</p>
  </footer>
</body>
</html>`;
  };

  const downloadPdf = async () => {
    if (!previewRef.current) return;

    // Create a hidden iframe for complete style isolation
    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.left = "-10000px";
    iframe.style.top = "0";
    iframe.style.width = "900px";
    iframe.style.height = "1000px";
    document.body.appendChild(iframe);

    const iframeDoc = iframe.contentWindow?.document;
    if (!iframeDoc) return;

    // Get HTML from preview area
    const previewHtml =
      previewRef.current.querySelector(".prose")?.innerHTML ||
      previewRef.current.innerHTML;

    // Deep sanitize the HTML content to remove any references to complex CSS variables or modern color formats
    const sanitizedHtml = previewHtml.replace(/okl(ab|ch)\([^)]+\)/g, "#888");

    const finalHtml = generateExportHtml(sanitizedHtml, true);
    iframeDoc.open();
    iframeDoc.write(finalHtml);
    iframeDoc.close();

    // Give fonts and resources time to load
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Adjust height to content
    iframe.style.height = `${iframeDoc.body.scrollHeight}px`;

    try {
      const canvas = await html2canvas(iframeDoc.body, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#0a0a0f",
        logging: false,
        width: 900,
        windowWidth: 900,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      // Multi-page logic
      const pageHeight = pdf.internal.pageSize.getHeight();
      let heightLeft = pdfHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(activeFile.name.replace(".md", ".pdf"));
    } catch (error) {
      console.error("PDF generation failed", error);
      alert("PDF generation failed. Please use HTML export for high fidelity.");
    } finally {
      if (document.body.contains(iframe)) {
        document.body.removeChild(iframe);
      }
      setModal(null);
    }
  };

  const downloadHtml = () => {
    if (!previewRef.current) return;
    const previewHtml =
      previewRef.current.querySelector(".prose")?.innerHTML ||
      previewRef.current.innerHTML;
    const finalHtml = generateExportHtml(previewHtml);

    const blob = new Blob([finalHtml], { type: "text/html;charset=utf-8" });
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = activeFile.name.replace(".md", ".html");
    link.click();
    URL.revokeObjectURL(blobUrl);
    setModal(null);
  };

  return (
    <div
      className="min-h-screen bg-[#0a0a0a] text-[#fce803] font-mono p-4"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        const file = e.dataTransfer.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (evt) =>
            addFile(file.name, evt.target?.result as string);
          reader.readAsText(file);
        }
      }}
    >
      <header className="border-b border-border pb-4 mb-4 relative z-20">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 mb-6">
          <div className="flex flex-col gap-1 items-center md:items-start text-center md:text-left">
            <h1 className="text-2xl font-bold text-accent tracking-tighter">
              MARKDOWN.EXE
            </h1>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
              {readTime} Min Read | {wordCount} Words | {charCount} Chars
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
                className="text-[10px] px-4 py-2 bg-accent/10 border border-accent/30 text-accent hover:bg-accent/20 transition-colors"
              >
                IMPORT
              </button>
              <button
                onClick={() => setModal("export")}
                className="text-[10px] px-4 py-2 bg-accent/10 border border-accent/30 text-accent hover:bg-accent/20 transition-colors"
              >
                EXPORT
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
            </div>
          </div>
        </div>

        <div className="flex gap-2 items-center mb-4 overflow-x-auto pb-2 scrollbar-hide">
          {files.map((f) => (
            <div
              key={f.id}
              className={`flex items-center gap-2 px-3 py-1 border relative ${activeFileId === f.id ? "bg-accent text-black" : "border-border"}`}
            >
              <span
                onClick={() => setActiveFileId(f.id)}
                className="cursor-pointer text-[12px] whitespace-nowrap"
              >
                {f.name}
              </span>
              <div className="relative">
                <MoreHorizontal
                  size={14}
                  className="cursor-pointer"
                  onClick={() =>
                    setActiveMenu(activeMenu === f.id ? null : f.id)
                  }
                />
                {activeMenu === f.id && (
                  <div className="fixed bg-black border border-accent p-2 z-[999] flex flex-col gap-2 w-28 shadow-[0_0_10px_rgba(0,255,136,0.2)]">
                    <button
                      className="text-[10px] text-left text-accent hover:text-white"
                      onClick={() => {
                        setRenameModal({ id: f.id, name: f.name });
                        setActiveMenu(null);
                      }}
                    >
                      RENAME
                    </button>
                    <button
                      className="text-[10px] text-left text-accent hover:text-white"
                      onClick={() => {
                        const file = files.find((x) => x.id === f.id);
                        if (file) addFile(file.name + " (copy)", file.content);
                        setActiveMenu(null);
                      }}
                    >
                      DUPLICATE
                    </button>
                    <button
                      className="text-[10px] text-left text-red-500 hover:text-red-300"
                      onClick={() => {
                        setDeleteModal(f.id);
                        setActiveMenu(null);
                      }}
                    >
                      DELETE
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
          <button
            onClick={() => addFile("new.md", "")}
            className="p-2 border border-border shrink-0"
          >
            <Plus size={16} />
          </button>
        </div>

        <DropZone onFileAdd={addFile} />
      </header>

      <AnimatePresence>
        {modal === "import" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-black border border-accent p-6 max-w-md w-full shadow-[0_0_20px_rgba(0,255,136,0.2)]"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-accent tracking-tighter uppercase">
                  Import Markdown
                </h2>
                <button
                  onClick={() => setModal(null)}
                  className="text-accent hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] text-accent/60 uppercase font-bold">
                    GitHub / External URL
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="https://raw.githubusercontent.com/..."
                      value={githubUrl}
                      onChange={(e) => setGithubUrl(e.target.value)}
                      className="flex-1 bg-black border border-accent/30 p-2 text-sm text-accent focus:border-accent outline-none"
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
                          alert("Failed to fetch content");
                        }
                      }}
                      className="bg-accent text-black px-4 py-2 text-[10px] font-bold uppercase"
                    >
                      Fetch
                    </button>
                  </div>
                </div>
                <div className="border-t border-accent/20 pt-4 text-center">
                  <p className="text-[10px] text-accent/40 uppercase mb-4">
                    Or use the dropzone on the main screen
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
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-black border border-accent p-6 max-w-lg w-full shadow-[0_0_20px_rgba(0,255,136,0.2)]"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-accent tracking-tighter uppercase">
                  Export File
                </h2>
                <button
                  onClick={() => setModal(null)}
                  className="text-accent hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => {
                    const blob = new Blob([activeFile.content], {
                      type: "text/markdown",
                    });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = activeFile.name;
                    a.click();
                    setModal(null);
                  }}
                  className="flex flex-col items-center gap-3 p-4 border border-accent/30 hover:bg-accent/10 transition-colors group"
                >
                  <MarkdownIcon className="w-8 h-8 text-accent group-hover:scale-110 transition-transform" />
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] font-bold uppercase tracking-wider">
                      Markdown
                    </span>
                    <span className="text-[8px] opacity-40">RAW_SOURCE.md</span>
                  </div>
                </button>
                <button
                  onClick={downloadHtml}
                  className="flex flex-col items-center gap-3 p-4 border border-accent/30 hover:bg-accent/10 transition-colors group"
                >
                  <HtmlIcon className="w-8 h-8 text-accent group-hover:scale-110 transition-transform" />
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] font-bold uppercase tracking-wider">
                      HTML_DOC
                    </span>
                    <span className="text-[8px] opacity-40">
                      WEB_ARCHIVE.html
                    </span>
                  </div>
                </button>
                <button
                  onClick={downloadPdf}
                  className="flex flex-col items-center gap-3 p-4 border border-accent/30 hover:bg-accent/10 transition-colors group"
                >
                  <PdfIcon className="w-8 h-8 text-accent group-hover:scale-110 transition-transform" />
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] font-bold uppercase tracking-wider">
                      PDF_REPORT
                    </span>
                    <span className="text-[8px] opacity-40">
                      STATIC_RECORD.pdf
                    </span>
                  </div>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {renameModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-black border border-accent p-6 max-w-sm w-full shadow-[0_0_20px_rgba(0,255,136,0.2)]"
            >
              <h2 className="text-lg font-bold text-accent mb-4 uppercase">
                Rename File
              </h2>
              <input
                type="text"
                value={renameModal.name}
                onChange={(e) =>
                  setRenameModal({ ...renameModal, name: e.target.value })
                }
                className="w-full bg-black border border-accent/30 p-2 text-sm text-accent focus:border-accent outline-none mb-4"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setRenameModal(null)}
                  className="px-4 py-2 text-[10px] text-accent/60 uppercase font-bold"
                >
                  Cancel
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
                  className="bg-accent text-black px-4 py-2 text-[10px] font-bold uppercase"
                >
                  Apply
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
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-black border border-red-500 p-6 max-w-sm w-full shadow-[0_0_20px_rgba(239,68,68,0.2)]"
            >
              <h2 className="text-lg font-bold text-red-500 mb-2 uppercase">
                Delete File?
              </h2>
              <p className="text-sm text-red-500/60 mb-6">
                This action is permanent and cannot be undone.
              </p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setDeleteModal(null)}
                  className="px-4 py-2 text-[10px] text-accent/60 uppercase font-bold"
                >
                  Cancel
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
                  className="bg-red-500 text-white px-4 py-2 text-[10px] font-bold uppercase"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.main
          key={viewMode}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className={`grid ${viewMode === "split" ? "grid-cols-2" : "grid-cols-1"} gap-4 h-[calc(100vh-550px)] md:h-[calc(100vh-420px)] min-h-[400px]`}
        >
          {(viewMode === "editor" || viewMode === "split") && (
            <div 
              className="border border-accent/20 p-4 bg-card/5 overflow-auto relative group hover:border-accent/40 transition-colors cursor-text"
              onClick={() => {
                const textarea = document.querySelector(".markdown-editor textarea") as HTMLTextAreaElement;
                if (textarea) textarea.focus();
              }}
            >
              <div className="absolute top-2 right-4 text-[8px] text-accent/20 uppercase tracking-[0.2em] pointer-events-none group-hover:text-accent/40 transition-colors">
                -- VIM_MODE_ACTIVE --
              </div>

              {!activeFile.content && (
                <div className="absolute top-8 left-8 text-accent/20 pointer-events-none font-mono text-sm animate-pulse">
                  Type or paste your markdown here...
                </div>
              )}

              <Editor
                value={activeFile.content}
                onValueChange={updateFileContent}
                highlight={(code) =>
                  highlight(code, languages.markdown, "markdown")
                }
                padding={10}
                className="font-mono text-sm markdown-editor min-h-full"
                textareaClassName="outline-none focus:ring-0"
              />
            </div>
          )}

          {(viewMode === "preview" || viewMode === "split") && (
            <div
              ref={previewRef}
              className="markdown-body p-6 bg-card/5 border border-border/20 font-mono overflow-auto whitespace-pre-wrap"
            >
              <div className="prose prose-invert max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm, remarkMath, remarkEmoji]}
                  rehypePlugins={[rehypeKatex, rehypeSlug, rehypeRaw]}
                  components={playgroundComponents as any}
                >
                  {activeFile?.content || ""}
                </ReactMarkdown>
              </div>
            </div>
          )}
        </motion.main>
      </AnimatePresence>
    </div>
  );
}
