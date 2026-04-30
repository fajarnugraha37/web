"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useTranslationWorker } from "@/hooks/useTranslationWorker";
import { useTranslationParams } from "@/hooks/useTranslationParams";
import { useIsMobile } from "@/hooks/use-mobile";
import { PageHeader } from "@/components/molecules/PageHeader";
import { LanguageSelect } from "@/components/molecules/LanguageSelect";
import { TranslationProgress } from "@/components/atoms/TranslationProgress";
import { CharacterCounter } from "@/components/atoms/CharacterCounter";
import { TerminalLogViewer } from "@/components/molecules/TerminalLogViewer";
import { ConfirmationModal } from "@/components/atoms/ConfirmationModal";
import { Button } from "@/components/atoms/Button";
import { toast } from "@/components/atoms/Toast";
import { PageTransition } from "@/components/atoms/PageTransition";
import { ArrowRightLeft, Download, Play, AlertTriangle, Loader2 } from "lucide-react";

export function TranslateLabContent() {
  const router = useRouter();
  const isMobile = useIsMobile();
  const {
    status,
    progressItems,
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

  // Warning Modal State
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [hasAgreed, setHasAgreed] = useState(false);

  // Streaming simulation state
  const [displayedOutput, setDisplayedOutput] = useState("");
  const streamIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Check agreement on mount
  useEffect(() => {
    const agreed = localStorage.getItem("translate_lab_agreed");
    if (agreed === "true") {
      setHasAgreed(true);
    } else {
      setShowWarningModal(true);
    }
  }, []);

  // Auto-initialize engine on mount (only if agreed)
  useEffect(() => {
    if (!isOffline && status === 'idle' && hasAgreed) {
      initWorker();
    }
  }, [isOffline, status, initWorker, hasAgreed]);

  // Handle fatal errors (e.g., OOM during initialization)
  useEffect(() => {
    if (status === 'error') {
      toast("Translation engine encountered a fatal error. Your device might be out of memory or connection lost. Please refresh the page.", "error");
      setIsModalOpen(false); // Close any open modals
    }
  }, [status]);

  // Memory & Offline Guards on Mount
  useEffect(() => {
    const memory = navigator.deviceMemory || 4;
    if (memory < 4) {
      setMemoryLimit(200);
      toast("Device RAM detected as low. Character limit reduced.", "warning");
      addLog('WARN', `memory: ${memory}GB - Setting limit to 200`);
    }

    const handleOffline = () => setIsOffline(true);
    const handleOnline = () => setIsOffline(false);

    if (!navigator.onLine) setIsOffline(true);

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    // Request persistent storage to protect the 600MB model from browser eviction
    if (navigator.storage && navigator.storage.persist) {
      navigator.storage.persist().then(isPersisted => {
        if (isPersisted) {
          console.log("Storage successfully persisted.");
        } else {
          console.log("Storage persistence not granted.");
        }
      });
    }

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
    
    // Safety check in case undefined or object slips through
    const safeText = typeof fullText === 'string' ? fullText : String(fullText);
    const words = safeText.split(/(\s+)/);
    setDisplayedOutput(words.join('')); // Show full text immediately for now, can implement token-by-token if desired

    let currentIndex = 0;
    // streamIntervalRef.current = setInterval(() => {
    //   if (currentIndex < words.length) {
    //     setDisplayedOutput((prev) => {
    //       console.log(`Streaming token: "${words[currentIndex]}"`, words, prev, words[currentIndex]); // Debug log for each token
    //       return prev + (words[currentIndex] ?? '');
    //     });
    //     currentIndex++;
    //   } else {
    //     if (streamIntervalRef.current) clearInterval(streamIntervalRef.current);
    //   }
    // }, 50); // 50ms per token
  };

  const handleTranslate = async (force: boolean = false, overrideSrc?: string, overrideTgt?: string) => {
    const activeSrc = overrideSrc || src;
    const activeTgt = overrideTgt || tgt;

    if (isOffline && status === 'idle') {
      toast("Offline. Model not downloaded.", "error");
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
      const result = await translate({ text: inputText, src: activeSrc, tgt: activeTgt });
      console.log('Translation result received in component:', result);
      setOutputText(result);
      simulateStreaming(result);
    } catch (error: any) {
      toast(error.message || "Process halted. Reduce text or refresh.", "error");
    }
  };

  const handleInit = () => {
    if (isOffline) {
      toast("No internet connection for initial download.", "error");
      return;
    }
    initWorker();
  };

  const handleAgree = () => {
    localStorage.setItem("translate_lab_agreed", "true");
    setHasAgreed(true);
    setShowWarningModal(false);
  };

  const handleCancel = () => {
    setShowWarningModal(false);
    router.back();
  };

  // Convert structured logs to strings for the Terminal Viewer
  const logStrings = logs.map(l => `[${l.timestamp}] [${l.level}] ${l.message}`);

  return (
    <PageTransition>
      <div className="flex flex-col gap-6 py-8 max-w-5xl mx-auto px-4 md:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2">
          <div className="flex-1">
            <PageHeader 
              title="TRANSLATION"
              accentText="NODE"
              tagText="DATA_STREAM // NEURAL_NETWORK"
              tagIcon={Loader2}
              subtitle="Client-Side NLLB-200 / Zero-Server Inference"
              className="mb-0"
            />
          </div>
          
          <div className="flex items-center gap-2 mb-4">
            {status === 'idle' && (
              <div className="text-muted-foreground text-xs font-mono">WAITING FOR ENGINE...</div>
            )}
            {status === 'downloading' && (
               <div className="text-accent text-xs font-mono animate-pulse">DOWNLOADING MODEL...</div>
            )}
            {status === 'loading' && (
               <div className="text-accent text-xs font-mono animate-pulse">LOADING WORKER █</div>
            )}
            {status === 'ready' && (
              <div className="px-3 py-1 border border-accent text-accent text-[10px] font-mono uppercase bg-accent/10">
                Pipeline Active
              </div>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        {status === 'downloading' && progressItems && (
          <div className="flex flex-col gap-2 p-4 border border-border bg-card/50">
            {Object.values(progressItems).map((item) => (
              <TranslationProgress key={item.file} progressData={item} />
            ))}
          </div>
        )}

        {/* System Warning */}
        {memoryLimit < 300 && (
          <div className="p-3 border border-accent-tertiary/30 bg-accent-tertiary/10 text-accent-tertiary text-xs font-mono flex items-center gap-2">
             <AlertTriangle className="w-4 h-4" />
             Device RAM is low. Character limit is lowered to prevent OOM crashes.
          </div>
        )}
        {isOffline && status === 'idle' && (
           <div className="p-3 border border-destructive/30 bg-destructive/10 text-destructive text-xs font-mono flex items-center gap-2">
           <AlertTriangle className="w-4 h-4" />
           Connection lost. Model needs to be downloaded while online.
        </div>
        )}

        {/* Translation Playground Area */}
        <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-[1fr_auto_1fr]'} items-stretch`}>
          
          {/* Source Pane */}
          <div className="flex flex-col gap-2 border border-border p-4 bg-card/50">
            <LanguageSelect 
              label="Source Language" 
              value={src} 
              onChange={(newSrc) => {
                setSrc(newSrc);
                if (inputText.trim().length > 0 && status === 'ready') {
                  handleTranslate(false, newSrc, tgt);
                }
              }} 
              disabled={status === 'translating'} 
            />
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
              onClick={() => {
                swap();
                if (inputText.trim().length > 0 && status === 'ready') {
                  handleTranslate(false, tgt, src);
                }
              }} 
              disabled={status === 'translating'}
              className="p-3 border border-border bg-muted/20 hover:border-accent hover:text-accent transition-all cyber-chamfer group disabled:opacity-50 flex items-center justify-center w-12 h-12"
              title="Swap Languages"
            >
              {status === 'translating' ? (
                <Loader2 className="w-5 h-5 animate-spin text-accent" />
              ) : (
                <ArrowRightLeft className="w-5 h-5 group-hover:rotate-180 transition-transform duration-300" />
              )}
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
          <div className="flex flex-col gap-2 border border-border p-4 bg-card/50">
            <LanguageSelect 
              label="Target Language" 
              value={tgt} 
              onChange={(newTgt) => {
                setTgt(newTgt);
                if (inputText.trim().length > 0 && status === 'ready') {
                  handleTranslate(false, src, newTgt);
                }
              }} 
              disabled={status === 'translating'} 
            />
            <div 
              className={`w-full h-40 overflow-y-auto text-sm font-sans mt-2 whitespace-pre-wrap ${isRtl ? 'text-right' : 'text-left'}`}
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
          message={`The text exceeds the safe limit (${memoryLimit} characters). This may cause the browser to crash (Out of Memory) on some devices. Continue anyway?`}
          variant="warning"
        />

        <ConfirmationModal
          isOpen={showWarningModal}
          onClose={() => setShowWarningModal(false)}
          onConfirm={handleAgree}
          onCancel={handleCancel}
          title="Computation & Data Warning"
          message="This feature will download an AI model of approximately ~1GB to your device. This process requires a stable internet connection, a large data quota, and sufficient CPU and RAM resources. Continue?"
          variant="accent"
          confirmLabel="AGREE"
          cancelLabel="CANCEL"
        />

      </div>
    </PageTransition>
  );
}
