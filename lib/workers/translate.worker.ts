import { pipeline, env } from '@xenova/transformers';

// Configuration for offline caching and WASM
env.allowLocalModels = false;
env.useBrowserCache = true;

let translatorPipeline: any = null;
let isInitializing = false;

self.addEventListener('message', async (event: MessageEvent) => {
  const { type, payload, id } = event.data;

  try {
    switch (type) {
      case 'INIT':
        if (!translatorPipeline && !isInitializing) {
          isInitializing = true;
          translatorPipeline = await pipeline('translation', 'Xenova/nllb-200-distilled-600M', {
            quantized: true,
            progress_callback: (data: any) => {
              self.postMessage({ type: 'INIT_PROGRESS', payload: data });
            },
          });
          isInitializing = false;
          self.postMessage({ type: 'READY' });
        } else if (translatorPipeline) {
          self.postMessage({ type: 'READY' }); // Already initialized
        }
        break;

      case 'TRANSLATE':
        if (!translatorPipeline) {
          throw new Error("Pipeline not initialized");
        }
        
        const { text, src, tgt } = payload;
        
        // Ensure inputs are provided
        if (!text || !src || !tgt) {
           throw new Error("Missing required parameters for translation");
        }

        // Output results
        const result = await translatorPipeline(text, {
          src_lang: src,
          tgt_lang: tgt,
        });

        self.postMessage({ 
          type: 'RESULT', 
          id, 
          payload: result[0]?.translation_text || "" 
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
