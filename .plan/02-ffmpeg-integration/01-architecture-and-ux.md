# Phase 1: Architecture, UX, and Risk Mitigation

## 1. Core Goal
Implement `/labs/ffmpeg` as "FFmpeg-WASM (The Media Processing Lab)", a client-side only video transcoding utility.
- **Theme:** Signal processor + Cyber Punk 2077 (using `accent` colors, `cyber-chamfer`, and terminal aesthetics).
- **Mobile First:** The UI must be highly optimized for small touch screens.
- **Privacy:** 100% in-browser processing via WebAssembly. Zero server uploads.

## 2. Architectural Constraints
- **Web Worker Offloading:** FFmpeg-WASM is extremely heavy. The core engine MUST run inside a Web Worker to prevent UI thread freezing.
- **Memory Limits (Mobile):** Hard cap input file sizes (e.g., 100MB max) on mobile devices to prevent Out of Memory (OOM) crashes.
- **Cross-Origin Isolation:** Multi-threading in FFmpeg requires `SharedArrayBuffer`. If the server lacks COOP/COEP headers, fallback gracefully to a single-threaded WASM build and display a visual warning.

## 3. UI/UX Strategy (Mobile Optimized)
- **Pipeline Nodes (Step-by-Step):** Do NOT build a giant form with 10 sliders. Instead, guide the user through discrete steps:
  1. Input Phase (Drag & Drop or Tap).
  2. Mode Selection (e.g., "Video Compressor", "GIF Generator", "Audio Stripper").
  3. Action Phase (Process & Output).
- **Presets Over Customization:** Offer "Quick-Hack" presets as the primary interaction method.
- **Advanced Overrides:** Hide complex sliders (crop X/Y, exact resolution, custom bitrate) behind an "OVERRIDE" toggle for power users.
- **Touch-Friendly Controls:** For trimming, use dual-range sliders with manual text input fallbacks. For cropping, provide aspect-ratio buttons (1:1, 16:9, 9:16) instead of complex drag-to-crop canvases.

## 4. Risk Mitigation & Implementation Mandates (For AI Implementor)
- **No Hallucinated FFmpeg Commands:** The implementor MUST use the exact, hardcoded FFmpeg string templates provided in Phase 2. Guessing or generating new FFmpeg arguments dynamically is strictly prohibited.
- **Strict I/O File Naming:** To avoid FFmpeg parsing errors, all files written to the WASM virtual filesystem must be renamed to simple, predictable strings (e.g., `input.mp4`, `output.gif`) regardless of the user's original filename.
- **Safe Output Formats Only:** Restrict direct browser playback options to universally supported formats (MP4 H.264, WebM VP8, GIF, MP3).
- **Atomic Design & Headless Logic:** 100% adherence to `SYSTEM_DESIGN.md`. Logic must live in `/hooks`. Components must be purely presentational.
