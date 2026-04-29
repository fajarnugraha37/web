# Risks & Mitigations

As a client-side ML feature, several unique risks exist. The implementation MUST include these mitigations.

## 1. Out of Memory (OOM) Crashes
**Risk:** Browsers on mid-to-low-tier mobile devices may crash when allocating memory for a 600M parameter model (~400-550MB active RAM).
**Mitigations:**
- **Pre-flight Check:** Disable or warn if `navigator.deviceMemory < 4`.
- **Input Limits:** Hard limit of 300 characters. Longer sequences require exponentially more memory in transformers.
- **Worker Isolation:** Running in a Web Worker prevents the main UI thread from freezing during heavy allocation.
- **Explicit Disposal:** The pipeline must be destroyed (`pipeline.dispose()`) immediately when leaving the route.

## 2. Unintended Bundle Bloat
**Risk:** `transformers.js` and ONNX Runtime Web are large dependencies. Importing them globally will ruin the performance of the main site (blog, about page, etc.).
**Mitigations:**
- **Strict Dynamic Imports:** Any React component importing or instantiating the worker must use `next/dynamic` with `ssr: false`.
- **Worker File:** The worker script itself should be loaded asynchronously.

## 3. Poor User Experience on First Load
**Risk:** Downloading ~150MB takes time. Users might think the app is broken.
**Mitigations:**
- **Explicit Opt-in:** Require the user to click a button to start the download. Do not auto-download on page visit.
- **Granular Progress:** Use the `pipeline` progress callback to show real-time percentage and downloaded MBs.
- **IndexedDB Caching:** Ensure `env.useBrowserCache = true` so subsequent visits are instant.

## 4. Hanging Inferences
**Risk:** The inference loop gets stuck, leaving the user with a permanent loading state.
**Mitigations:**
- **Timeout Controller:** Wrap the inference call in a `Promise.race` with an `AbortController` set to 8 seconds.
- **Concurrency Lock:** Only allow 1 inference in the queue. Disable the "Translate" button while processing.

## 5. Environment Compatibility
**Risk:** The browser doesn't support WebAssembly or is completely offline.
**Mitigations:**
- **WASM Check:** Basic feature detection for WASM. Show a fallback error state if unsupported.
- **Offline Handling:** Catch network errors during the model fetch phase and display a localized error toast.
