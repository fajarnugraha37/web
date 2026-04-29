"use client";

import React, { useState, useEffect, useRef } from "react";
import { useTranslationWorker } from "@/hooks/useTranslationWorker";
import { useTranslationParams } from "@/hooks/useTranslationParams";
import { useIsMobile } from "@/hooks/use-mobile";
import { LanguageSelect } from "@/components/molecules/LanguageSelect";
import { TranslationProgress } from "@/components/atoms/TranslationProgress";
import { CharacterCounter } from "@/components/atoms/CharacterCounter";
import { TerminalLogViewer } from "@/components/molecules/TerminalLogViewer";
import { ConfirmationModal } from "@/components/atoms/ConfirmationModal";
import { Button } from "@/components/atoms/Button";
import { toast } from "@/components/atoms/Toast";
import { PageTransition } from "@/components/atoms/PageTransition";
import { ArrowRightLeft, Download, Play, AlertTriangle } from "lucide-react";

export function TranslateLabContent() {
  const isMobile = useIsMobile();
  const {
    status,
    progressData,
    logs,
    initWorker,
    translate,
    dispose,
    addLog,
    clearLogs
  } = useTranslationWorker();
  
  const { src, tgt, setSrc, setTgt, swap, isRtl } = useTranslationParams();

  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [memoryLimit, setMemoryLimit] = useState(300);
  const [isOffline, setIsOffline] = useState(false);

  // Streaming simulation state
  const [displayedOutput, setDisplayedOutput] = useState("");
  const streamIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Memory & Offline Guards on Mount
  useEffect(() => {
    const memory = navigator.deviceMemory || 4;
    if (memory < 4) {
      setMemoryLimit(200);
      toast("RAM device terdeteksi rendah. Batas karakter dikurangi.", "warning");
      addLog('WARN', `memory: ${memory}GB - Setting limit to 200`);
    }

    const handleOffline = () => setIsOffline(true);
    const handleOnline = () => setIsOffline(false);

    if (!navigator.onLine) setIsOffline(true);

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, [addLog]);

  // Strict Lifecycle Management
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        // In a real app, maybe a timeout here to dispose if hidden for > 60s
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      dispose();
    };
  }, [dispose]);

  // Simulate Streaming
  const simulateStreaming = (fullText: string) => {
    setDisplayedOutput("");
    if (streamIntervalRef.current) clearInterval(streamIntervalRef.current);
    
    const words = fullText.split(/(\s+)/);
    let currentIndex = 0;

    streamIntervalRef.current = setInterval(() => {
      if (currentIndex < words.length) {
        setDisplayedOutput((prev) => prev + words[currentIndex]);
        currentIndex++;
      } else {
        if (streamIntervalRef.current) clearInterval(streamIntervalRef.current);
      }
    }, 50); // 50ms per token
  };

  const handleTranslate = async (force: boolean = false) => {
    if (isOffline && status === 'idle') {
      toast("Offline. Model belum diunduh.", "error");
      return;
    }

    if (inputText.length > memoryLimit && !force) {
      setIsModalOpen(true);
      return;
    }

    if (force) {
      addLog('WARN', `[OVERRIDE: ${inputText.length} chars]`);
    }

    try {
      setDisplayedOutput("");
      setOutputText("");
      const result = await translate({ text: inputText, src, tgt });
      setOutputText(result);
      simulateStreaming(result);
    } catch (error: any) {
      toast(error.message || "Proses terhenti. Kurangi teks atau refresh.", "error");
    }
  };

  const handleInit = () => {
    if (isOffline) {
      toast("Tidak ada koneksi internet untuk unduhan awal.", "error");
      return;
    }
    initWorker();
  };

  // Convert structured logs to strings for the Terminal Viewer
  const logStrings = logs.map(l => `[${l.timestamp}] [${l.level}] ${l.message}`);

  return (
    <PageTransition>
      <div className="flex flex-col gap-6 py-8 max-w-5xl mx-auto px-4 md:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-6">
          <div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tighter uppercase cyber-glitch-text" data-text="TRANSLATION NODE">
              TRANSLATION <span className="text-accent-tertiary">NODE</span>
            </h1>
            <p className="text-muted-foreground font-mono text-xs uppercase tracking-[0.2em] mt-2">
              Client-Side NLLB-200 / Zero-Server Inference
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            {status === 'idle' && (
              <Button onClick={handleInit} disabled={isOffline} className="gap-2" variant="cyber">
                <Download className="w-4 h-4" /> Initialize Engine
              </Button>
            )}
            {status === 'downloading' && (
               <div className="text-accent text-xs font-mono animate-pulse">DOWNLOADING MODEL...</div>
            )}
            {status === 'loading' && (
               <div className="text-accent text-xs font-mono animate-pulse">LOADING WORKER █</div>
            )}
            {status === 'ready' && (
              <div className="px-3 py-1 border border-accent text-accent text-[10px] font-mono uppercase bg-accent/10">
                ✅ Pipeline Active
              </div>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        {status === 'downloading' && <TranslationProgress progressData={progressData} />}

        {/* System Warning */}
        {memoryLimit < 300 && (
          <div className="p-3 border border-accent-tertiary/30 bg-accent-tertiary/10 text-accent-tertiary text-xs font-mono flex items-center gap-2">
             <AlertTriangle className="w-4 h-4" />
             RAM device rendah. Batas karakter diturunkan untuk mencegah OOM crash.
          </div>
        )}
        {isOffline && status === 'idle' && (
           <div className="p-3 border border-destructive/30 bg-destructive/10 text-destructive text-xs font-mono flex items-center gap-2">
           <AlertTriangle className="w-4 h-4" />
           Koneksi terputus. Model perlu diunduh saat online.
        </div>
        )}

        {/* Translation Playground Area */}
        <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-[1fr_auto_1fr]'} items-stretch`}>
          
          {/* Source Pane */}
          <div className="flex flex-col gap-2 border border-border p-4 bg-card/50 cyber-chamfer-sm">
            <LanguageSelect label="Source Language" value={src} onChange={setSrc} disabled={status === 'translating'} />
            <textarea
              className="w-full h-40 bg-transparent border-none resize-none focus:ring-0 text-sm font-sans mt-2 outline-none"
              placeholder="Enter text to translate..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={status === 'translating'}
            />
            <div className="flex justify-between items-center mt-2">
              <CharacterCounter current={inputText.length} max={memoryLimit} warningThreshold={memoryLimit - 20} />
            </div>
          </div>

          {/* Controls */}
          <div className={`flex ${isMobile ? 'flex-row' : 'flex-col'} justify-center items-center gap-4 py-2`}>
            <button 
              onClick={swap} 
              disabled={status === 'translating'}
              className="p-3 border border-border bg-muted/20 hover:border-accent hover:text-accent transition-all cyber-chamfer group disabled:opacity-50"
              title="Swap Languages"
            >
              <ArrowRightLeft className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
            </button>
            <Button 
               variant="glitch" 
               className="gap-2"
               onClick={() => handleTranslate(false)}
               disabled={status !== 'ready' || inputText.trim().length === 0}
            >
              <Play className="w-4 h-4" /> {isMobile ? "Translate" : ""}
            </Button>
          </div>

          {/* Target Pane */}
          <div className="flex flex-col gap-2 border border-border p-4 bg-card/50 cyber-chamfer-sm">
            <LanguageSelect label="Target Language" value={tgt} onChange={setTgt} disabled={status === 'translating'} />
            <div 
              className={`w-full h-40 overflow-y-auto text-sm font-sans mt-2 ${isRtl ? 'text-right' : 'text-left'}`}
              dir={isRtl ? 'rtl' : 'ltr'}
              style={isRtl ? { paddingInlineStart: '1rem' } : {}}
            >
              {displayedOutput ? (
                 <span>{displayedOutput}</span>
              ) : (
                <span className="text-muted-foreground/50 italic">Translation output will appear here...</span>
              )}
              {status === 'translating' && <span className="inline-block w-1.5 h-3 bg-accent animate-blink ml-1" />}
            </div>
          </div>
        </div>

        {/* Debug Terminal */}
        <div className="mt-8">
           <TerminalLogViewer logs={logStrings} onClear={clearLogs} />
        </div>

        <ConfirmationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={() => handleTranslate(true)}
          title="Memory Warning"
          message={`Teks melebihi batas aman (${memoryLimit} karakter). Hal ini dapat menyebabkan browser crash (Out of Memory) pada beberapa perangkat. Tetap lanjutkan?`}
          variant="warning"
        />

      </div>
    </PageTransition>
  );
}
