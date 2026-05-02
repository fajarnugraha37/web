# Specification: hooks/useFFmpegLabActions.ts

## 1. Problem Framing
Maps FFmpeg UI interactions (mode select, trimming) to specific FFmpeg command-line arguments.

## 2. State Model
- **Ownership:** Local state for all settings (mode, resolution, trimStart, etc.).

## 3. Findings & Recommendations
- This hook manages substantial UI parameter state. 
- Migration: These parameters should reside in a Zustand store to ensure consistent settings throughout the lab session and allow persistence/easy resets.
