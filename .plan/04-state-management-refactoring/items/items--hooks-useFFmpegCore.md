# Specification: hooks/useFFmpegCore.ts

## 1. Problem Framing
Manages the FFmpeg-WASM engine lifecycle, logs, and progress.

## 2. State Model
- **Ownership:** Local state (status, logs, progress) and refs (ffmpeg instance).

## 3. Findings & Recommendations
- Migration: **High priority**. The FFmpeg instance and its status should be managed by a global Zustand store (`useFfmpegStore`) to share the engine instance across different UI organisms (ControlPanel, Dropzone) and prevent redundant initialization.
