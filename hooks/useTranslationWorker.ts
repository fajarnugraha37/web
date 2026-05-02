import { useEffect, useCallback, useRef, useState } from 'react';
import { useTranslationStore } from '@/lib/store/useTranslationStore';

/**
 * Hook: useTranslationWorker
 * Orchestrates the machine translation Web Worker and its lifecycle.
 */
export function useTranslationWorker() {
  const workerRef = useRef<Worker | null>(null);

  const status = useTranslationStore((state) => state.status);
  const setStatus = useTranslationStore((state) => state.setStatus);
  const updateProgress = useTranslationStore((state) => state.updateProgress);
  const addLog = useTranslationStore((state) => state.addLog);
  const clearLogs = useTranslationStore((state) => state.clearLogs);

  const progressItems = useTranslationStore((state) => state.progressItems);
  const logs = useTranslationStore((state) => state.logs);

  const [hasAgreed, setHasAgreed] = useState(false);

  useEffect(() => {
    const agreed = localStorage.getItem("translate_lab_agreed");
    if (agreed === "true") setHasAgreed(true);
  }, []);

  const confirmAgreement = useCallback(() => {
    localStorage.setItem("translate_lab_agreed", "true");
    setHasAgreed(true);
  }, []);

  const initWorker = useCallback(() => {
    if (workerRef.current || !hasAgreed) return;
    
    addLog('info', 'Initializing Translation Pipeline...');
    setStatus('loading');

    // Create worker
    const worker = new Worker(
      new URL('@/lib/workers/translate.worker.ts', import.meta.url),
      { type: 'module' }
    );
    workerRef.current = worker;

    // Set up message listener
    worker.addEventListener('message', (e) => {
      const { type, payload } = e.data;

      switch (type) {
        case 'INIT_PROGRESS':
          // Xenova progress callback data
          if (payload.status === 'initiate') {
            setStatus('downloading');
            addLog('info', `Downloading Model: ${payload.file}...`);
          } else if (payload.status === 'progress') {
            updateProgress({
              file: payload.file,
              progress: payload.progress,
              loaded: payload.loaded,
              total: payload.total
            });
          } else if (payload.status === 'done') {
            addLog('info', `Resource cached: ${payload.file}`);
          }
          break;
          
        case 'READY':
          setStatus('ready');
          addLog('info', 'Neural network loaded and ready.');
          break;

        case 'ERROR':
          // Initialization errors are fatal
          if (status === 'downloading' || status === 'loading') {
             setStatus('error');
             addLog('error', `Hardware Fault: ${payload}`);
          } else {
             // Inference error
             addLog('error', `Inference Fault: ${payload}`);
             setStatus('ready'); 
          }
          break;
      }
    });

    // START INITIALIZATION
    worker.postMessage({ type: 'INIT' });

  }, [addLog, setStatus, updateProgress, status, hasAgreed]);

  const translate = useCallback((text: string, src: string, tgt: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!workerRef.current) {
        reject(new Error("Worker not initialized"));
        return;
      }

      setStatus('translating');
      addLog('info', `Translating from ${src} to ${tgt}...`);
      
      const id = Date.now().toString();

      const handleMessage = (e: MessageEvent) => {
        const { type, id: msgId, payload } = e.data;
        
        if (msgId === id) {
          if (type === 'RESULT') {
            workerRef.current?.removeEventListener('message', handleMessage);
            setStatus('ready');
            addLog('info', 'Translation complete.');
            resolve(payload);
          } else if (type === 'ERROR') {
            workerRef.current?.removeEventListener('message', handleMessage);
            setStatus('ready');
            addLog('error', `Translation failed: ${payload}`);
            reject(new Error(payload));
          }
        }
      };

      workerRef.current.addEventListener('message', handleMessage);

      workerRef.current.postMessage({
        type: 'TRANSLATE',
        id,
        payload: { text, src, tgt }
      });
    });
  }, [addLog, setStatus]);

  const dispose = useCallback(() => {
    if (workerRef.current) {
      workerRef.current.terminate();
      workerRef.current = null;
      setStatus('idle');
      addLog('warn', 'Pipeline terminated. Memory cleared.');
    }
  }, [addLog, setStatus]);

  return {
    status,
    progressItems,
    logs,
    hasAgreed,
    confirmAgreement,
    initWorker,
    translate,
    dispose,
    addLog,
    clearLogs
  };
}
