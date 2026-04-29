# Architecture & Technical Design: Client-Side Translation

## 1. Overview
The `/labs/translate` feature provides an offline-capable, client-side translation playground using `transformers.js` and the ONNX Runtime Web. It runs the `Xenova/nllb-200-distilled-600M` model strictly within the browser, ensuring privacy and reducing server costs.

## 2. Next.js Integration & Route Isolation
To prevent impacting the rest of the application's bundle size and performance:
- **Route:** The feature lives exclusively under `/app/labs/translate` and is linked from the Laboratory Dashboard.
- **Component Strategy:** The core components use `"use client"` directives to ensure browser-only APIs are available. The heavy lifting is delegated entirely to a Web Worker to keep the main thread unblocked.
- **Navigation Updates:** Links to this lab are integrated into the HardwareNodesSection, MobileNav, Header, and Footer.

## 3. Web Worker Architecture
Inference with a 600M parameter model will block the main thread if executed directly.
- **Dedicated Worker:** All `transformers.js` logic resides in `lib/workers/translate.worker.ts`.
- **Communication:** The main thread and worker communicate via `postMessage`.
  - Main -> Worker: `INIT`, `TRANSLATE`, `DISPOSE`
  - Worker -> Main: `INIT_PROGRESS`, `READY`, `RESULT`, `ERROR`
- **Concurrency:** Managed by `useTranslationWorker` hook which guards the status to prevent multiple active inferences.

## 4. Model & Caching Strategy
- **Engine:** `@xenova/transformers` with ONNX Runtime Web
- **Model:** `Xenova/nllb-200-distilled-600M`
- **Quantization:** Enforced Q4 INT4 (`dtype: "q4"`) to keep the download size reasonable.
- **Environment Contextual Loading:** 
  - In **Development (`NODE_ENV === 'development'`)**, the application strictly fetches WASM and large ONNX models from local `/public/wasm` and `/public/models` directories to save bandwidth and improve iteration speed.
  - In **Production (SSG)**, the local models are ignored to keep the deployment artifact small, and the worker falls back to fetching from HuggingFace CDN (`env.allowLocalModels = false`). Browser caching is utilized (`env.useBrowserCache = true`).

## 5. Memory & Lifecycle Management
Memory leaks are the highest risk for this feature.
- **Pre-flight Check:** Use `navigator.deviceMemory`. If `< 4GB`, display a warning and enforce stricter input limits (200 characters instead of 300).
- **Strict Disposal:** The Web Worker and ONNX pipeline must be explicitly disposed of when the component unmounts.
- **Implementation:** Call `pipeline.dispose()` and `worker.terminate()` upon the `useEffect` cleanup.

## 6. Error & Capability Boundaries
- **Offline Support:** Verify `navigator.onLine` on initial load. If offline and the model isn't cached, show error toasts and disable inference.
- **Timeout Guard:** Implement an 8-second timeout per inference request in the main thread to catch hanging web workers.
