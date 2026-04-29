import { pipeline, env } from '@xenova/transformers';

// Configure to use local WASM files instead of jsdelivr
env.backends.onnx.wasm.wasmPaths = '/wasm/';

// Configuration for offline caching and WASM
const isDev = process.env.NODE_ENV === 'development';
env.allowLocalModels = isDev;
if (isDev) {
  env.localModelPath = '/models/';
}
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
          translatorPipeline = await pipeline('translation', 'Xenova/nllb-200-distilled-600M', {
            quantized: true,
            progress_callback: (data: any) => {
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
        
        // Ensure inputs are provided
        if (!text || !src || !tgt) {
           throw new Error("Missing required parameters for translation");
        }

        // Output results
        const result = await translatorPipeline(text, {
          src_lang: src,
          tgt_lang: tgt,
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
