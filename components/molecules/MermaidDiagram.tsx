"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import mermaid from "mermaid";
import {
  ZoomIn,
  Copy,
  Download,
  Image as ImageIcon,
  X,
  Plus,
  Minus,
  RotateCcw,
} from "lucide-react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "@/components/atoms/Toast";

mermaid.initialize({
  startOnLoad: false,
  theme: "dark",
  securityLevel: "loose",
});

export const MermaidDiagram = ({ chart }: { chart: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgCode, setSvgCode] = useState<string>("");
  const [isZoomed, setIsZoomed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    let isMounted = true;
    const renderDiagram = async () => {
      try {
        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
        const { svg } = await mermaid.render(id, chart);
        if (isMounted) setSvgCode(svg);
      } catch (error) {
        console.error("Mermaid rendering error", error);
      }
    };
    renderDiagram();
    return () => {
      isMounted = false;
    };
  }, [chart]);

  const handleCopy = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(chart);
        // FIXED: Using themed toast instead of native browser popup
        toast("DIAGRAM_SOURCE_COPIED", "success");
      } else {
        throw new Error("Clipboard API not available");
      }
    } catch (err) {
      console.error(err);
      toast("CLIPBOARD_ACCESS_DENIED", "error");
    }
  };

  const handleDownloadSVG = () => {
    const blob = new Blob([svgCode], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "diagram.svg";
    link.click();
    URL.revokeObjectURL(url);
    toast("SVG_EXPORT_INITIATED", "info");
  };

  const handleDownloadPNG = () => {
    if (!containerRef.current) return;
    const svgElement = containerRef.current.querySelector("svg");
    if (!svgElement) return;

    const clonedSvg = svgElement.cloneNode(true) as SVGSVGElement;
    const bbox = svgElement.getBoundingClientRect();
    const width = bbox.width || 800;
    const height = bbox.height || 600;

    clonedSvg.setAttribute("width", width.toString());
    clonedSvg.setAttribute("height", height.toString());
    clonedSvg.setAttribute("xmlns", "http://www.w3.org/2000/svg");

    const svgData = new XMLSerializer().serializeToString(clonedSvg);
    const base64 = btoa(unescape(encodeURIComponent(svgData)));
    const dataUrl = `data:image/svg+xml;base64,${base64}`;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = width * 2;
      canvas.height = height * 2;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.scale(2, 2);
        ctx.drawImage(img, 0, 0, width, height);
        try {
          const pngUrl = canvas.toDataURL("image/png");
          const link = document.createElement("a");
          link.href = pngUrl;
          link.download = "diagram.png";
          link.click();
          toast("PNG_EXPORT_COMPLETE", "success");
        } catch (e) {
          toast("PNG_EXPORT_FAILED", "error");
        }
      }
    };
    img.src = dataUrl;
  };

  const closeZoom = useCallback(() => {
    setIsZoomed(false);
  }, []);

  const modalContent = (
    <AnimatePresence>
      {isZoomed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 md:p-8"
          onClick={closeZoom}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="relative w-full max-w-6xl h-[80vh] flex flex-col items-center justify-center bg-card rounded-xl border border-accent/30 shadow-[0_0_50px_rgba(var(--accent-rgb),0.2)] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center bg-background/50 backdrop-blur-md border-b border-border/50 z-20">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                <span className="text-[10px] font-mono text-accent uppercase tracking-[0.2em]">
                  Diagram_Node::Inspected
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex bg-background/80 border border-border rounded-md p-0.5">
                  <button onClick={handleCopy} className="p-2 hover:bg-accent hover:text-black rounded-md transition-all group" title="Copy Raw">
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={handleDownloadSVG} className="p-2 hover:bg-accent hover:text-black rounded-md transition-all group" title="Save SVG">
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
                <button onClick={closeZoom} className="p-2 bg-accent/10 border border-accent/20 rounded-md hover:bg-accent hover:text-black transition-all">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <TransformWrapper initialScale={1} centerOnInit={true} minScale={0.1} maxScale={8}>
              {({ zoomIn, zoomOut, resetTransform }) => (
                <>
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-1.5 bg-background/90 backdrop-blur-md border border-accent/30 rounded-full p-1.5 shadow-2xl">
                    <button onClick={() => zoomIn()} className="p-3 hover:bg-accent hover:text-black rounded-full transition-all">
                      <Plus className="w-5 h-5" />
                    </button>
                    <button onClick={() => zoomOut()} className="p-3 hover:bg-accent hover:text-black rounded-full transition-all">
                      <Minus className="w-5 h-5" />
                    </button>
                    <button onClick={() => resetTransform()} className="p-3 hover:bg-accent hover:text-black rounded-full transition-all">
                      <RotateCcw className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing pt-16">
                    <TransformComponent wrapperStyle={{ width: "100%", height: "100%" }} contentStyle={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <div className="p-12 md:p-24 flex items-center justify-center" dangerouslySetInnerHTML={{ __html: svgCode }} />
                    </TransformComponent>
                  </div>
                </>
              )}
            </TransformWrapper>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <div className="relative group my-8 p-4 border border-border/50 rounded-lg bg-card/30 overflow-x-auto">
        <div className="absolute top-2 right-2 flex gap-1.5 z-10 bg-background/90 p-1 rounded-md backdrop-blur-md border border-border shadow-lg opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all">
          <button onClick={() => setIsZoomed(true)} className="p-2 hover:bg-accent hover:text-black rounded-md transition-colors" aria-label="Zoom"><ZoomIn className="w-4 h-4" /></button>
          <button onClick={handleCopy} className="p-2 hover:bg-accent hover:text-black rounded-md transition-colors" aria-label="Copy code"><Copy className="w-4 h-4" /></button>
          <button onClick={handleDownloadSVG} className="p-2 hover:bg-accent hover:text-black rounded-md transition-colors" aria-label="Download SVG"><Download className="w-4 h-4" /></button>
          <button onClick={handleDownloadPNG} className="p-2 hover:bg-accent hover:text-black rounded-md transition-colors" aria-label="Download PNG"><ImageIcon className="w-4 h-4" /></button>
        </div>
        <div ref={containerRef} className="flex justify-center items-center min-w-full" dangerouslySetInnerHTML={{ __html: svgCode }} />
      </div>
      {mounted && createPortal(modalContent, document.body)}
    </>
  );
};
