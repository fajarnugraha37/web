import { useState, useEffect, useCallback, useRef } from 'react';

export type TranslationStatus = 'idle' | 'downloading' | 'loading' | 'ready' | 'translating' | 'error';

export interface TranslationProgress {
  file: string;
  status: string;
  name: string;
  progress: number;
  loaded: number;
  total: number;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';
  message: string;
}

interface TranslateOptions {
  text: string;
  src: string;
  tgt: string;
}

export function useTranslationWorker() {
  const [status, setStatus] = useState<TranslationStatus>('idle');
  const [progressItems, setProgressItems] = useState<Record<string, TranslationProgress>>({});
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const workerRef = useRef<Worker | null>(null);
  const resolveRef = useRef<((value: string) => void) | null>(null);
  const rejectRef = useRef<((reason?: any) => void) | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const addLog = useCallback((level: LogEntry['level'], message: string) => {
    setLogs((prev) => {
      const newLogs = [
        ...prev,
        {
          id: Math.random().toString(36).substring(7),
          timestamp: new Date().toLocaleTimeString(),
          level,
          message,
        },
      ];
      // Limit to 100 logs to prevent memory bloat and UI lag
      if (newLogs.length > 100) {
        return newLogs.slice(newLogs.length - 100);
      }
      return newLogs;
    });
  }, []);

  const initWorker = useCallback(() => {
    if (workerRef.current) return;

    try {
      addLog('INFO', 'Initializing Web Worker...');
      workerRef.current = new Worker(new URL('@/lib/workers/translate.worker.ts', import.meta.url), {
        type: 'module'
      });
      
      workerRef.current.addEventListener('message', (event) => {
        const { type, payload } = event.data;
        
        switch (type) {
          case 'INIT_PROGRESS':
            addLog('INFO', 'Initializeion progress: ' + JSON.stringify(payload));
            setStatus('downloading');
            if (payload.status === 'progress' || payload.status === 'initiate') {
              addLog('INFO', `Downloading ${payload.file}: ${payload.progress}% (${payload.loaded}/${payload.total} bytes)`);
              setProgressItems(prev => ({
                ...prev,
                [payload.file]: payload
              }));
            } else if (payload.status === 'done') {
              addLog('INFO', `Finished downloading ${payload.file}`);
              setProgressItems(prev => {
                const next = { ...prev };
                delete next[payload.file];
                return next;
              });
            } else {
              addLog('INFO', `Status update for ${payload.file}: ${payload.status}`);
            }
            break;
          case 'READY':
            setStatus('ready');
            addLog('INFO', 'Pipeline ready');
            break;
          case 'RESULT':
            addLog('INFO', 'Received translation result: ' + JSON.stringify(payload));
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            setStatus('ready');
            if (resolveRef.current) {
              resolveRef.current(payload);
              resolveRef.current = null;
              rejectRef.current = null;
            }
            break;
          case 'ERROR':
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            addLog('ERROR', `Worker error: ${payload}`);
            if (rejectRef.current) {
              setStatus('ready'); // Pipeline is still functional, just this inference failed
              rejectRef.current(new Error(payload));
              resolveRef.current = null;
              rejectRef.current = null;
            } else {
              setStatus('error');
            }
            break;
          case 'DISPOSED':
            addLog('INFO', 'Pipeline disposed');
            setStatus('idle');
            break;
          default:
            addLog('WARN', `Unknown message type from worker: ${type}`);
            break;
        }
      });
      
      workerRef.current.addEventListener('error', (err) => {
        addLog('ERROR', `Worker global error: ${err.message || JSON.stringify(err || 'unknown error')}`);
        if (status != 'ready' && status != 'translating') {
          setStatus('error');
        }
      });

      setStatus('loading');
      addLog('INFO', 'Sending INIT command to worker...');
      workerRef.current.postMessage({ type: 'INIT' });
    } catch (e: any) {
      addLog('ERROR', `Failed to create worker: ${e.message}`);
      setStatus('error');
    }
  }, [addLog]);

  const translate = useCallback(async ({ text, src, tgt }: TranslateOptions): Promise<string> => {
    if (!workerRef.current || status === 'idle' || status === 'downloading' || status === 'loading') {
      addLog('WARN', 'Cannot translate: Pipeline not ready');
      throw new Error('Pipeline not ready');
    }

    if (status === 'translating') {
      addLog('WARN', 'Cannot translate: Already translating');
      throw new Error('Translation in progress');
    }

    setStatus('translating');
    addLog('INFO', `Translating ${text.length} chars from ${src} to ${tgt}...`);
    
    return new Promise((resolve, reject) => {
      resolveRef.current = resolve;
      rejectRef.current = reject;
      
      const id = Math.random().toString(36).substring(7);
      
      // 60-second timeout guard
      timeoutRef.current = setTimeout(() => {
        addLog('ERROR', 'Inference timeout (8s)');
        setStatus('error');
        reject(new Error('Inference timeout'));
      }, 60000);

      workerRef.current!.postMessage({
        type: 'TRANSLATE',
        id,
        payload: { text, src, tgt }
      });
    });
  }, [status, addLog]);

  const dispose = useCallback(() => {
    if (workerRef.current) {
      addLog('DEBUG', 'Sending DISPOSE command...');
      workerRef.current.postMessage({ type: 'DISPOSE' });
      workerRef.current.terminate();
      workerRef.current = null;
      setStatus('idle');
    }
  }, [addLog]);

  const clearLogs = useCallback(() => {
    setLogs([]);
  }, []);

  return {
    status,
    progressItems,
    logs,
    initWorker,
    translate,
    dispose,
    addLog,
    clearLogs
  };
}
