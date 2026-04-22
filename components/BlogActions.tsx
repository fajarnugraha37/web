"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Copy,
  Download,
  Share2,
  Check,
  Link as LinkIcon,
  X,
} from "lucide-react";
import {
  XIcon,
  LinkedInIcon,
  WhatsAppIcon,
  TelegramIcon,
  FacebookIcon,
  MarkdownIcon,
  HtmlIcon,
  PdfIcon,
} from "./Icons";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { motion, AnimatePresence } from "motion/react";

interface BlogActionsProps {
  title: string;
  slug: string;
  content: string;
}

export const BlogActions = ({ title, slug, content }: BlogActionsProps) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedMd, setCopiedMd] = useState(false);
  const [activeMenu, setActiveMenu] = useState<"export" | "share" | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const url =
    typeof window !== "undefined"
      ? window.location.href
      : `https://fajarnugraha37.github.io/web/blogs/${slug}`;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
      setActiveMenu(null);
    } catch (e) {
      alert("Clipboard access denied.");
    }
  };

  const handleCopyMarkdown = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedMd(true);
      setTimeout(() => setCopiedMd(false), 2000);
    } catch (e) {
      alert("Clipboard access denied.");
    }
  };

  const downloadMd = () => {
    const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = `${slug}.md`;
    link.click();
    URL.revokeObjectURL(blobUrl);
    setActiveMenu(null);
  };

  const generateExportHtml = (articleHtml: string, isForPdf = false) => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
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
  <div class="export-info">[ ${isForPdf ? "PDF_REPORT" : "ARCHIVE_EXPORT"} :: ${new Date().toISOString()} ]</div>
  <h1>${title}</h1>
  <div class="content">
    ${articleHtml}
  </div>
  <footer style="margin-top: 6rem; border-top: 1px solid var(--border); padding-top: 2rem; font-size: 0.8rem; color: #666; font-family: 'JetBrains Mono', monospace;">
    <p>ORIGINAL_SOURCE: <a href="${url}">${url}</a></p>
    <p>© ${new Date().getFullYear()} SYS//OP. ALL_RIGHTS_RESERVED.</p>
  </footer>
</body>
</html>`;
  };

  const downloadHtml = () => {
    const article = document.querySelector("article");
    if (!article) return;

    const contentElement = article.querySelector(".markdown-body");
    const articleHtml = contentElement?.innerHTML || article.innerHTML;
    const finalHtml = generateExportHtml(articleHtml);

    const blob = new Blob([finalHtml], { type: "text/html;charset=utf-8" });
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = `${slug}.html`;
    link.click();
    URL.revokeObjectURL(blobUrl);
    setActiveMenu(null);
  };

  const downloadPdf = async () => {
    const article = document.querySelector("article");
    if (!article) return;

    setIsExporting(true);
    setActiveMenu(null);

    const contentElement = article.querySelector(".markdown-body");
    const articleHtml = contentElement?.innerHTML || article.innerHTML;

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

    // Deep sanitize the HTML content to remove any references to complex CSS variables or modern color formats
    const sanitizedHtml = articleHtml.replace(/okl(ab|ch)\([^)]+\)/g, "#888");

    const finalHtml = generateExportHtml(sanitizedHtml, true);
    iframeDoc.open();
    iframeDoc.write(finalHtml);
    iframeDoc.close();

    // Give fonts and resources time to load in the isolated context
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

      pdf.save(`${slug}.pdf`);
    } catch (error) {
      console.error("PDF generation failed", error);
      alert(
        "PDF generation failed. This is likely due to security restrictions on modern CSS parsers. Please use the 'HTML' export option for a high-fidelity archive.",
      );
    } finally {
      if (document.body.contains(iframe)) {
        document.body.removeChild(iframe);
      }
      setIsExporting(false);
    }
  };

  const shareLinks = [
    {
      name: "X",
      icon: <XIcon className="w-4 h-4" />,
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    },
    {
      name: "LinkedIn",
      icon: <LinkedInIcon className="w-4 h-4" />,
      url: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
    },
    {
      name: "WhatsApp",
      icon: <WhatsAppIcon className="w-4 h-4" />,
      url: `https://api.whatsapp.com/send?text=${encodeURIComponent(title + " " + url)}`,
    },
    {
      name: "Telegram",
      icon: <TelegramIcon className="w-4 h-4" />,
      url: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    },
    {
      name: "Facebook",
      icon: <FacebookIcon className="w-4 h-4" />,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    },
  ];

  return (
    <div
      id="blog-actions"
      className={`flex items-center gap-3 my-8 relative z-40 ${isExporting ? "opacity-0" : "opacity-100"} transition-opacity`}
      ref={menuRef}
    >
      {/* Copy Button */}
      <button
        onClick={handleCopyMarkdown}
        className="flex items-center gap-2 px-4 py-2 bg-card border border-border hover:border-accent hover:text-accent rounded-md transition-all text-xs font-mono group shadow-lg"
        title="Copy Markdown"
      >
        {copiedMd ? (
          <Check className="w-4 h-4 text-green-500" />
        ) : (
          <Copy className="w-4 h-4" />
        )}
        <span className="hidden sm:inline text-[10px]">COPY</span>
      </button>

      {/* Export Button */}
      <div className="relative">
        <button
          onClick={() =>
            setActiveMenu(activeMenu === "export" ? null : "export")
          }
          className={`flex items-center gap-2 px-4 py-2 border rounded-md transition-all text-xs font-mono shadow-lg ${activeMenu === "export" ? "bg-accent text-black border-accent" : "bg-card border-border hover:border-accent hover:text-accent"}`}
        >
          <Download className="w-4 h-4" />
          <span className="hidden sm:inline text-[10px]">EXPORT</span>
        </button>

        <AnimatePresence>
          {activeMenu === "export" && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute top-full left-0 mt-2 w-56 bg-background/95 backdrop-blur-xl border border-border rounded-lg shadow-2xl z-50 overflow-hidden"
            >
              <button
                onClick={downloadMd}
                className="flex items-center gap-3 w-full px-4 py-4 hover:bg-accent hover:text-black transition-colors text-[10px] font-mono border-b border-border/30 group"
              >
                <MarkdownIcon className="w-5 h-5 text-accent group-hover:text-black" />
                <div className="flex flex-col items-start text-left">
                  <span className="font-bold">MARKDOWN</span>
                  <span className="opacity-60 text-[8px]">RAW_SOURCE.md</span>
                </div>
              </button>
              <button
                onClick={downloadHtml}
                className="flex items-center gap-3 w-full px-4 py-4 hover:bg-accent hover:text-black transition-colors text-[10px] font-mono border-b border-border/30 group"
              >
                <HtmlIcon className="w-5 h-5 text-accent group-hover:text-black" />
                <div className="flex flex-col items-start text-left">
                  <span className="font-bold">HTML_DOC</span>
                  <span className="opacity-60 text-[8px]">
                    WEB_ARCHIVE.html
                  </span>
                </div>
              </button>
              <button
                onClick={downloadPdf}
                className="flex items-center gap-3 w-full px-4 py-4 hover:bg-accent hover:text-black transition-colors text-[10px] font-mono group"
              >
                <PdfIcon className="w-5 h-5 text-accent group-hover:text-black" />
                <div className="flex flex-col items-start text-left">
                  <span className="font-bold">PDF_REPORT</span>
                  <span className="opacity-60 text-[8px]">
                    STATIC_RECORD.pdf
                  </span>
                </div>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Share Button */}
      <div className="relative">
        <button
          onClick={() => setActiveMenu(activeMenu === "share" ? null : "share")}
          className={`flex items-center gap-2 px-4 py-2 border rounded-md transition-all text-xs font-mono shadow-lg ${activeMenu === "share" ? "bg-accent text-black border-accent" : "bg-card border-border hover:border-accent hover:text-accent"}`}
        >
          <Share2 className="w-4 h-4" />
          <span className="hidden sm:inline text-[10px]">SHARE</span>
        </button>

        <AnimatePresence>
          {activeMenu === "share" && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute top-full lg:right-0 sm:left-0 mt-2 w-56 bg-background/95 backdrop-blur-xl border border-border rounded-lg shadow-2xl z-50 overflow-hidden"
            >
              <div className="grid grid-cols-2 gap-1 p-1 border-b border-border/30">
                {shareLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex flex-col items-center justify-center gap-2 py-3 hover:bg-accent hover:text-black transition-all rounded text-[8px] font-mono group"
                    onClick={() => setActiveMenu(null)}
                  >
                    <span className="text-accent group-hover:text-black transition-colors">
                      {link.icon}
                    </span>
                    <span>{link.name.toUpperCase()}</span>
                  </a>
                ))}
              </div>
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-3 w-full px-4 py-4 hover:bg-accent hover:text-black transition-colors text-[10px] font-mono group"
              >
                <span className="text-accent group-hover:text-black transition-colors">
                  {copiedLink ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <LinkIcon className="w-4 h-4" />
                  )}
                </span>
                <div className="flex flex-col items-start text-left">
                  <span className="font-bold">COPY_LINK</span>
                  <span className="opacity-60 text-[8px]">
                    DIRECT_ACCESS_URL
                  </span>
                </div>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
