# Phase 3: Atomic Components and Layout Blueprint

This document details the exact React component hierarchy required to build the `/labs/ffmpeg` UI following the Atomic Design standard outlined in `SYSTEM_DESIGN.md`. All UI logic is strictly presentation; actual ffmpeg interaction is piped down from the top-level Organism hook.

## 1. Atoms (`components/atoms/`)
*Visual primitives with zero business logic.*

- **`RangeSlider.tsx`:** A dual-thumb slider (min/max) for the TRIM feature. Uses standard CSS or `radix-ui` primitives if available. Must support controlled values.
- **`ProgressBar.tsx`:** A neon-styled horizontal bar. Receives a `value` (0-100) prop. Cyberpunk styling: glitched edges or segmented block fill (`-----     `).
- **`TerminalLogItem.tsx`:** A single line of text formatted with mono-space font, timestamp, and optional syntax highlighting (e.g., green for success, red for errors).
- **`VideoPreview.tsx`:** A wrapper around the native HTML5 `<video>` element. Receives a `src` (blob URL). Must have `controls` enabled but styled minimally.

## 2. Molecules (`components/molecules/`)
*Functional groups of atoms. Form controls and layout blocks.*

- **`FfmpegDropzone.tsx`:** Uses `react-dropzone`. Displays a dashed border area for drag-and-drop.
  - State: Drag active/inactive.
  - Action: `onFileSelected(file)`.
- **`PresetSelector.tsx`:** A list of buttons or a styled dropdown for selecting quick-hack modes (e.g., GIF Maker, Audio Extractor).
  - Highlights the currently active preset.
- **`AdvancedSettingsForm.tsx`:** Conditional UI that expands when "OVERRIDE" is clicked.
  - Contains fields for exact width/height, custom FPS, and a raw FFmpeg arguments input field.
  - Hidden by default on mobile.
- **`FfmpegControlPanel.tsx`:** Combines the `RangeSlider` (for trimming), format selection dropdown, and the "START TRANSCODE" primary action button.

## 3. Organisms (`components/organisms/`)
*Complex, stateful sections.*

- **`FFmpegLabContent.tsx`:** The master orchestrator.
  - Initializes `useFFmpegCore` and `useFFmpegLabActions`.
  - Maintains the global state of the Lab.
  - Layout Structure:
    1. **Header:** Title ("FFmpeg-WASM") and Status Card (Booting/Online).
    2. **Input Zone:** `FfmpegDropzone` OR `VideoPreview` (if file is loaded).
    3. **Configuration Zone:** `PresetSelector` -> `FfmpegControlPanel` -> `AdvancedSettingsForm`.
    4. **Execution Zone:** `ProgressBar` and a stylized terminal window streaming logs from the worker.
    5. **Output Zone:** Appears upon completion. Provides a download link or secondary `VideoPreview`.

## 4. Mobile Layout Constraints
- The `FfmpegControlPanel` must stack vertically on screens `< 768px`.
- The `AdvancedSettingsForm` MUST be collapsed by default to save vertical screen space.
- Terminal logs should auto-scroll but have a fixed maximum height (e.g., `h-32`) to prevent pushing the download button off-screen.
