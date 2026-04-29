import { pipeline, env } from '@xenova/transformers';

// Configure to use local WASM files instead of jsdelivr
env.backends.onnx.wasm.wasmPaths = '/wasm/';

// Configuration for offline caching and WASM
const isDev = process.env.NODE_ENV === 'development';
env.allowLocalModels = isDev;
env.localModelPath = '/models/'; // ALWAYS explicitly set this to a string to prevent minification bugs with S.replace in Xenova pathJoin
env.useBrowserCache = true;

let translatorPipeline: any = null;
let isInitializing = false;

self.addEventListener('message', async (event: MessageEvent) => {
  const { type, payload, id } = event.data;

  try {
    console.log(`Worker received message: ${type}`, payload);
    switch (type) {
      case 'INIT':
        if (!translatorPipeline && !isInitializing) {
          console.log('Initializing translation pipeline...');
          isInitializing = true;
          const lastProgressTime = new Map<string, number>();
          
          translatorPipeline = await pipeline('translation', 'Xenova/nllb-200-distilled-600M', {
            quantized: true,
            progress_callback: (data: any) => {
              // Throttle 'progress' events to max 10 times per second per file
              if (data.status === 'progress' && data.file) {
                const now = performance.now();
                const last = lastProgressTime.get(data.file) || 0;
                if (now - last < 100) return;
                lastProgressTime.set(data.file, now);
              }
              self.postMessage({ type: 'INIT_PROGRESS', payload: data });
            },
          });
          isInitializing = false;
          self.postMessage({ type: 'READY' });
        } else if (translatorPipeline) {
          console.log('Translation pipeline already initialized');
          self.postMessage({ type: 'READY' }); // Already initialized
        } else {
          console.log('Translation pipeline is currently initializing');
        }
        break;

      case 'TRANSLATE':
        if (!translatorPipeline) {
          throw new Error("Pipeline not initialized");
        }
        
        const { text, src, tgt } = payload;
        
        // Ensure inputs are provided and strictly strings
        if (!text || !src || !tgt) {
           throw new Error("Missing required parameters for translation");
        }
        
        const safeText = typeof text === 'string' ? text : String(text);

        // Output results
        const result = await translatorPipeline(safeText, {
          src_lang: String(src),
          tgt_lang: String(tgt),
        });

        // Safely extract the translation text to avoid "undefined" strings
        console.log('Raw translation result:', result);
        let output = result;
        if (Array.isArray(result) && result.length > 0) {
          output = result.map((item: any) => item.translation_text || "No translation_text field").join(' ');
        } else if (typeof result === 'object' && 'translation_text' in result) {
          output = result.translation_text;
        } 

        self.postMessage({ 
          type: 'RESULT', 
          id, 
          payload: output
        });
        break;

      case 'DISPOSE':
        if (translatorPipeline) {
          await translatorPipeline.dispose();
          translatorPipeline = null;
        }
        isInitializing = false;
        self.postMessage({ type: 'DISPOSED' });
        break;

      default:
        console.warn(`Unknown message type: ${type}`);
    }
  } catch (error: any) {
    self.postMessage({ type: 'ERROR', id, payload: error.message });
    isInitializing = false;
  }
});
