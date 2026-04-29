# Architecture & Technical Design: Client-Side Translation

## 1. Overview
The `/labs/translate` feature provides an offline-capable, client-side translation playground using `transformers.js` and the ONNX Runtime Web. It runs the `Xenova/nllb-200-distilled-600M` model strictly within the browser, ensuring privacy and reducing server costs.

## 2. Next.js Integration & Route Isolation
To prevent impacting the rest of the application's bundle size and performance:
- **Route:** The feature lives exclusively under `/app/labs/translate`.
- **Dynamic Imports:** The core React components that initialize the ML model and Web Worker MUST be dynamically imported with `ssr: false`.
  ```typescript
  import dynamic from 'next/dynamic';
  const TranslateLabContent = dynamic(() => import('@/components/organisms/TranslateLabContent'), { ssr: false });
  ```
- **Navigation Updates:** Links to this lab will be added to the Main Page (Laboratory Dashboard), Navbar (Mobile & Desktop), Footer, and `/labs` index page.

## 3. Web Worker Architecture
Inference with a 600M parameter model will block the main thread if executed directly.
- **Dedicated Worker:** All `transformers.js` logic must reside in a dedicated Web Worker (e.g., `translate.worker.ts`).
- **Communication:** The main thread and worker communicate via `postMessage`.
  - Main -> Worker: `INIT`, `TRANSLATE`, `DISPOSE`
  - Worker -> Main: `INIT_PROGRESS`, `READY`, `RESULT`, `ERROR`
- **Concurrency:** Implement a FIFO queue in the React hook, ensuring a maximum of 1 active inference request at a time.

## 4. Model & Caching Strategy
- **Engine:** `transformers.js@3.x`
- **Model:** `Xenova/nllb-200-distilled-600M`
- **Quantization:** Enforced Q4 INT4 (`dtype: "q4"`) to keep the download size around ~150MB.
- **Caching:** Browser IndexedDB via `env.useBrowserCache = true`. This ensures the 150MB payload is only downloaded once.

## 5. Memory & Lifecycle Management
Memory leaks are the highest risk for this feature.
- **Pre-flight Check:** Use `navigator.deviceMemory`. If `< 4GB`, display a warning and enforce stricter input limits.
- **Strict Disposal:** The Web Worker and ONNX pipeline must be explicitly disposed of when:
  1. The component unmounts.
  2. The user navigates away from the `/labs/translate` route.
  3. The page visibility changes to hidden for more than 60 seconds.
- **Implementation:** Call `pipeline.dispose()` and `worker.terminate()`.

## 6. Error & Capability Boundaries
- **WASM Support Check:** Detect if the browser supports WebAssembly. If not, disable the UI and show a clear error message.
- **Offline Support:** Verify `navigator.onLine` on initial load. If offline and the model isn't cached, disable the UI.
- **Timeout Guard:** Implement an `AbortController` in the worker with an 8-second timeout per inference request to prevent infinite hanging.
