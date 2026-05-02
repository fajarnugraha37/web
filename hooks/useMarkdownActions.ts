"use client";

// @ts-ignore
import html2canvas from "html2canvas";
import { useState, useCallback } from "react";
import { toast } from "@/components/atoms/Toast";
import jsPDF from "jspdf";
import DOMPurify from "isomorphic-dompurify";
import { LabFile } from "@/types";
import { useMarkdownUIStore } from "@/lib/store/useMarkdownUIStore";
import { useGithubMarkdownMutation } from "./queries/useMarkdownQuery";

interface UseMarkdownActionsProps {
  activeFile: LabFile | undefined;
  activeContent: string;
  addFile: (name: string, content: string) => void;
  previewRef: React.RefObject<HTMLDivElement | null>;
}

export function useMarkdownActions({
  activeFile,
  activeContent,
  addFile,
  previewRef
}: UseMarkdownActionsProps) {
  const modal = useMarkdownUIStore((state) => state.activeModal);
  const setModal = useMarkdownUIStore((state) => state.openModal);
  const closeModal = useMarkdownUIStore((state) => state.closeModal);
  const [githubUrl, setGithubUrl] = useState("");
  const [copied, setCopied] = useState(false);

  const githubMutation = useGithubMarkdownMutation();

  const handleCopy = useCallback(() => {
    if (!activeContent) return;
    navigator.clipboard.writeText(activeContent);
    setCopied(true);
    toast("MARKDOWN_CONTENT_COPIED", "success");
    setTimeout(() => setCopied(false), 2000);
  }, [activeContent]);

  const handleFileUpload = useCallback((files_to_proc: FileList | null) => {
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
    closeModal();
  }, [addFile, closeModal]);

  const fetchFromGithub = useCallback(async () => {
    if (!githubUrl) return;
    
    githubMutation.mutate(githubUrl, {
      onSuccess: ({ name, text }) => {
        addFile(name, text);
        toast(`HANDSHAKE_SUCCESS: ${name}`, "success");
        closeModal();
        setGithubUrl("");
      },
      onError: () => {
        toast("GITHUB_HANDSHAKE_FAILED", "error");
      }
    });
  }, [githubUrl, addFile, closeModal, githubMutation]);

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
      const canvas = await html2canvas(iframeDoc.body, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#0a0a0f",
        width: 900
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save((activeFile?.name || "document").replace(".md", ".pdf"));
      toast("PDF_EXPORT_COMPLETE", "success");
    } catch (e) {
      toast("PDF_EXPORT_FAILED", "error");
    } finally {
      document.body.removeChild(iframe);
      closeModal();
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
    closeModal();
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
    closeModal();
  };

  return {
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
  };
}
