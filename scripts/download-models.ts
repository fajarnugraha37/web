import fs from 'fs';
import path from 'path';
import { Readable } from 'stream';
import { finished } from 'stream/promises';

const WASM_DIR = path.join(process.cwd(), 'public', 'wasm');
const MODEL_DIR = path.join(process.cwd(), 'public', 'models', 'Xenova', 'nllb-200-distilled-600M');
const ONNX_DIR = path.join(MODEL_DIR, 'onnx');

const WASM_URLS = [
  'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.14.0/dist/ort-wasm.wasm',
  'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.14.0/dist/ort-wasm-simd.wasm',
  'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.14.0/dist/ort-wasm-threaded.wasm',
  'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.14.0/dist/ort-wasm-simd-threaded.wasm'
];

const MODEL_URLS = [
  { url: 'https://huggingface.co/Xenova/nllb-200-distilled-600M/resolve/main/config.json', dest: path.join(MODEL_DIR, 'config.json') },
  { url: 'https://huggingface.co/Xenova/nllb-200-distilled-600M/resolve/main/generation_config.json', dest: path.join(MODEL_DIR, 'generation_config.json') },
  { url: 'https://huggingface.co/Xenova/nllb-200-distilled-600M/resolve/main/special_tokens_map.json', dest: path.join(MODEL_DIR, 'special_tokens_map.json') },
  { url: 'https://huggingface.co/Xenova/nllb-200-distilled-600M/resolve/main/tokenizer.json', dest: path.join(MODEL_DIR, 'tokenizer.json') },
  { url: 'https://huggingface.co/Xenova/nllb-200-distilled-600M/resolve/main/tokenizer_config.json', dest: path.join(MODEL_DIR, 'tokenizer_config.json') },
  { url: 'https://huggingface.co/Xenova/nllb-200-distilled-600M/resolve/main/onnx/decoder_model_merged_quantized.onnx', dest: path.join(ONNX_DIR, 'decoder_model_merged_quantized.onnx') },
  { url: 'https://huggingface.co/Xenova/nllb-200-distilled-600M/resolve/main/onnx/encoder_model_quantized.onnx', dest: path.join(ONNX_DIR, 'encoder_model_quantized.onnx') },
];

async function downloadFile(url: string, destPath: string) {
  if (fs.existsSync(destPath)) {
    console.log(`[SKIP] Already exists: ${path.basename(destPath)}`);
    return;
  }
  console.log(`[DOWNLOAD] Fetching ${path.basename(destPath)}...`);
  
  const res = await fetch(url);
  if (!res.ok || !res.body) {
    throw new Error(`Failed to fetch ${url}: ${res.statusText}`);
  }
  
  const fileStream = fs.createWriteStream(destPath);
  // @ts-ignore
  await finished(Readable.fromWeb(res.body).pipe(fileStream));
  console.log(`[DONE] Saved to ${destPath}`);
}

async function main() {
  fs.mkdirSync(WASM_DIR, { recursive: true });
  fs.mkdirSync(MODEL_DIR, { recursive: true });
  fs.mkdirSync(ONNX_DIR, { recursive: true });

  console.log('--- Downloading WASM files ---');
  for (const url of WASM_URLS) {
    const filename = path.basename(url);
    await downloadFile(url, path.join(WASM_DIR, filename));
  }

  console.log('\n--- Downloading Model files ---');
  for (const file of MODEL_URLS) {
    await downloadFile(file.url, file.dest);
  }

  console.log('\nAll downloads completed successfully!');
}

main().catch(console.error);