"use client";

import React, { useState, useRef } from "react";
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
import "katex/dist/katex.min.css";
import { mdxComponents } from "@/components/MDXComponents";
import { MermaidDiagram } from "@/components/MermaidDiagram";
import { MoreHorizontal, Plus, Copy, Check } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { motion, AnimatePresence } from "motion/react";

const playgroundComponents = { ...mdxComponents, mermaid: MermaidDiagram };
type File = { id: string; name: string; content: string };

export default function MarkdownPlayground() {
  const [files, setFiles] = useState<File[]>([{ id: "1", name: "untitled.md", content: "# MARKDOWN.EXE" }]);
  const [activeFileId, setActiveFileId] = useState("1");
  const [viewMode, setViewMode] = useState<"editor" | "split" | "preview">("split");
  const [modal, setModal] = useState<"import" | "export" | null>(null);
  const [githubUrl, setGithubUrl] = useState("");
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [renameModal, setRenameModal] = useState<{id: string, name: string} | null>(null);
  const [deleteModal, setDeleteModal] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const activeFile = files.find((f) => f.id === activeFileId) || files[0];
  const wordCount = activeFile.content.split(/\s+/).filter(Boolean).length;
  const charCount = activeFile.content.length;
  const readTime = Math.ceil(wordCount / 200);

  const updateFileContent = (content: string) => {
    setFiles(prev => prev.map(f => f.id === activeFileId ? { ...f, content } : f));
  };

  const addFile = (name: string, content: string) => {
    const newFile = { id: Date.now().toString(), name, content };
    setFiles([...files, newFile]);
    setActiveFileId(newFile.id);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(activeFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#fce803] font-mono p-4" onDragOver={e => e.preventDefault()} onDrop={e => {
        const file = e.dataTransfer.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (evt) => addFile(file.name, evt.target?.result as string);
            reader.readAsText(file);
        }
    }}>
      <header className="border-b border-border pb-4 mb-4 relative z-20">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-xl font-bold text-accent">MARKDOWN.EXE</h1>
          <div className="text-[10px] text-muted-foreground">
            {readTime} Min Read | {wordCount} Words | {charCount} Chars
          </div>
          <div className="flex bg-[#111] border border-accent/30 p-1">
            {["editor", "split", "preview"].map((mode) => (
              <button 
                key={mode}
                onClick={() => setViewMode(mode as any)} 
                className={`px-4 py-1.5 text-[10px] uppercase tracking-widest transition-all duration-300 ${
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
            <button onClick={() => setModal("import")} className="text-[10px] px-3 py-1.5 bg-accent/10 border border-accent/30 text-accent">IMPORT</button>
            <button onClick={() => setModal("export")} className="text-[10px] px-3 py-1.5 bg-accent/10 border border-accent/30 text-accent">EXPORT</button>
            <button onClick={handleCopy} className="text-[10px] px-3 py-1.5 bg-accent/10 border border-accent/30 text-accent flex items-center gap-1">
                {copied ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
                {copied ? "COPIED" : "COPY"}
            </button>
          </div>
        </div>

        <div className="flex gap-2 items-center mb-4 overflow-visible">
          {files.map(f => (
            <div key={f.id} className={`flex items-center gap-2 px-3 py-1 border relative ${activeFileId === f.id ? "bg-accent text-black" : "border-border"}`}>
              <span onClick={() => setActiveFileId(f.id)} className="cursor-pointer text-[12px] whitespace-nowrap">{f.name}</span>
              <div className="relative">
                <MoreHorizontal size={14} className="cursor-pointer" onClick={() => setActiveMenu(activeMenu === f.id ? null : f.id)} />
                {activeMenu === f.id && (
                  <div className="fixed bg-black border border-accent p-2 z-[999] flex flex-col gap-2 w-28 shadow-[0_0_10px_rgba(0,255,136,0.2)]">
                    <button className="text-[10px] text-left text-accent hover:text-white" onClick={() => { setRenameModal({id: f.id, name: f.name}); setActiveMenu(null); }}>RENAME</button>
                    <button className="text-[10px] text-left text-accent hover:text-white" onClick={() => { const file = files.find(x => x.id === f.id); if(file) addFile(file.name + " (copy)", file.content); setActiveMenu(null); }}>DUPLICATE</button>
                    <button className="text-[10px] text-left text-red-500 hover:text-red-300" onClick={() => { setDeleteModal(f.id); setActiveMenu(null); }}>DELETE</button>
                  </div>
                )}
              </div>
            </div>
          ))}
          <button onClick={() => addFile("new.md", "")} className="p-2 border border-border shrink-0"><Plus size={16}/></button>
        </div>
      </header>

      {/* Modals... */}
      <AnimatePresence mode="wait">
        <motion.main 
          key={viewMode}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className={`grid ${viewMode === "split" ? "grid-cols-2" : "grid-cols-1"} gap-4 h-[calc(100vh-300px)]`}
        >
          {(viewMode === "editor" || viewMode === "split") && (
            <div className="border border-border p-4 bg-card/5 overflow-auto">
               <Editor value={activeFile.content} onValueChange={updateFileContent} highlight={(code) => highlight(code, languages.markdown, "markdown")} padding={10} className="font-mono text-sm" />
            </div>
          )}
          {(viewMode === "preview" || viewMode === "split") && (
            <div ref={previewRef} className="markdown-body p-6 bg-card/5 border border-border/20 font-mono overflow-auto whitespace-pre-wrap">
              <div className="prose prose-invert max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath, remarkEmoji]} rehypePlugins={[rehypeKatex, rehypeSlug]} components={playgroundComponents as any}>
                  {activeFile.content}
                </ReactMarkdown>
              </div>
            </div>
          )}
        </motion.main>
      </AnimatePresence>
    </div>
  );
}