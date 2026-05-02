# Specification: components-organisms-FFmpegLabContent.tsx

## 1. Problem Framing
The central interface for the FFmpeg lab. Orchestrates state across multiple inputs/outputs and coordinates media processing.

## 2. State Model
- **Ownership:** Delegates all complex business logic and state to `useFFmpegCore` and `useFFmpegLabActions`.
- **State:** Heavy client-side state, worker communication, and WASM memory references.

## 3. Findings & Recommendations
- This component is a complex organism. It correctly avoids rendering logic by using hooks.
- Migration: The `FFmpeg` state orchestration in `useFFmpegCore` and `useFFmpegLabActions` is a prime candidate for a dedicated Zustand store (`useFfmpegStore`) to consolidate the dispersed state (mode, progress, file references) and ensure better reactivity.
