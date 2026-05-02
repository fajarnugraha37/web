# Specification: components-molecules-FfmpegControlPanel.tsx

## 1. Problem Framing
Centralized UI for FFmpeg control (Run/Reset) and monitoring status.

## 2. State Model
- **Ownership:** Props-controlled. Logic delegated to `useFFmpegLabActions`.

## 3. Findings & Recommendations
- Presentational wrapper for logic handled in `hooks`. No migration needed.
