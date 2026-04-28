# Phase 2: FFmpeg Core and Headless Hooks

## 1. Required Dependencies
- `@ffmpeg/ffmpeg` (v0.12+ MUST be used. Supports ES Modules + SharedArrayBuffer).
- `@ffmpeg/util` (For `fetchFile` utility).
- `@ffmpeg/core` (Or `@ffmpeg/core-mt` if multi-threading is confirmed).
- `react-dropzone` (For mobile-friendly, stable file dropping).

## 2. Headless Hook: `useFFmpegCore.ts`
This hook manages the low-level communication with the FFmpeg WebAssembly instance.

**Responsibilities:**
- Initializing the FFmpeg instance (Lazy loading `ffmpeg.load()`).
- Listening to progress events (`ffmpeg.on('progress')`) and updating a reactive state (0 to 100%).
- Listening to log events (`ffmpeg.on('log')`) and appending them to an array (for the terminal UI).
- Writing the input file to WASM memory (`ffmpeg.writeFile('input.ext', await fetchFile(file))`).
- Executing the command (`ffmpeg.exec([...args])`).
- Reading the output file and creating a blob URL for download/playback (`ffmpeg.readFile('output.ext')`).
- Memory Cleanup: Calling `ffmpeg.deleteFile()` on both input and output files after completion to prevent OOM.

## 3. Headless Hook: `useFFmpegLabActions.ts`
This hook acts as the middleman between the UI components (Presets, Modes) and `useFFmpegCore`. It constructs the exact arguments.

**FFmpeg String Templates (Hardcoded):**
The AI implementor MUST use these exact arrays for `exec()`.

**Template: Optimize to GIF (Palettegen 2-pass)**
```javascript
// High Quality GIF (15fps, 480p width)
// DO NOT DEVIATE. 
["-i", "input.mp4", "-vf", "fps=15,scale=480:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse", "-loop", "0", "output.gif"]
```

**Template: Audio Extraction (MP3)**
```javascript
// Extract audio, remove video stream.
["-i", "input.mp4", "-vn", "-c:a", "libmp3lame", "-q:a", "2", "output.mp3"]
```

**Template: Fast Trim (Seeking)**
```javascript
// NOTE: -ss and -t MUST be placed BEFORE -i input.mp4 for fast seeking.
// Variables: start_time (e.g., "00:00:05"), duration (e.g., "10")
["-ss", start_time, "-t", duration, "-i", "input.mp4", "-c", "copy", "output.mp4"]
```

**Template: Video Compression (H.264)**
```javascript
// Standard compression suitable for web.
["-i", "input.mp4", "-vcodec", "libx264", "-crf", "28", "-preset", "faster", "output.mp4"]
```

**Template: Resolution & Aspect Ratio**
```javascript
// Scale width to 1280, height proportional, force 16:9 ratio.
["-i", "input.mp4", "-vf", "scale=1280:-2,setdar=16/9", "-c:a", "copy", "output.mp4"]
```

## 4. State Management Flow
```typescript
interface FFmpegState {
  isLoaded: boolean;
  isProcessing: boolean;
  progress: number; // 0-100
  logs: string[];
  inputFile: File | null;
  outputUrl: string | null;
  selectedMode: 'GIF' | 'COMPRESS' | 'TRIM' | 'AUDIO' | 'CUSTOM';
  // ... parameters for selected mode
}
```
All state transitions must be handled within the hook, exposing only clear functions (e.g., `load()`, `process()`, `cancel()`) and derived state to the UI.
