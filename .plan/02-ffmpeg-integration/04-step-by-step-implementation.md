# Phase 4: Step-by-Step Implementation Guide

**ATTENTION AI IMPLEMENTOR:** You MUST follow this checklist linearly. Do not skip steps. Do not hallucinate FFmpeg commands outside of the provided templates in `02-ffmpeg-core-and-hooks.md`.

## Step 1: Install Dependencies
1. Check `package.json` for `@ffmpeg/ffmpeg`, `@ffmpeg/util`, and `@ffmpeg/core` (or `@ffmpeg/core-mt`).
2. If missing, run `bun add @ffmpeg/ffmpeg @ffmpeg/util @ffmpeg/core react-dropzone`.
3. *Risk Mitigation:* Ensure Next.js config allows `SharedArrayBuffer` headers. You may need to update `next.config.ts` to include:
   ```javascript
   headers: async () => [
     { source: '/labs/ffmpeg', headers: [
       { key: 'Cross-Origin-Embedder-Policy', value: 'require-corp' },
       { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' }
     ]}
   ]
   ```

## Step 2: Implement Headless Logic (Hooks)
1. Create `hooks/useFFmpegCore.ts`. Implement lazy loading (`ffmpeg.load()`), state management (`isLoaded`, `progress`, `logs`), and the core `exec` function.
2. Create `hooks/useFFmpegLabActions.ts`. This must map UI presets to the hardcoded FFmpeg string templates. Ensure file input validation (e.g., rejecting files > 100MB on mobile, using `useIsMobile`).

## Step 3: Build Atomic UI Components
1. **Atoms:** Create `RangeSlider.tsx`, `ProgressBar.tsx`, and `TerminalLogItem.tsx` in `components/atoms/`. Use Cyberpunk 2077 themes (`accent-secondary` for sliders, `.cyber-chamfer` for buttons).
2. **Molecules:** Create `FfmpegDropzone.tsx`, `PresetSelector.tsx`, and `AdvancedSettingsForm.tsx` in `components/molecules/`. 
3. **Styling Rule:** All components must use Tailwind utility classes exclusively. No inline styles.

## Step 4: Assemble the Organism
1. Create `components/organisms/FFmpegLabContent.tsx`. 
2. Import the hooks from Step 2.
3. Layout the components from Step 3. Ensure the mobile layout stacks correctly and the Advanced Settings are hidden behind an "OVERRIDE" toggle.
4. Integrate the terminal log viewer at the bottom, mimicking the `/labs/postgresql` terminal aesthetic.

## Step 5: Create the Page Route
1. Create `app/labs/ffmpeg/page.tsx`.
2. This must be a Server Component that exports Metadata and renders `<FFmpegLabContent />`.
3. Update `app/labs/page.tsx` (the Dashboard) to include a new card for the `FFmpeg-WASM` node.

## Step 6: Testing & Validation
1. Verify the `Cross-Origin-Isolation` headers are working (check console for `SharedArrayBuffer` support).
2. Test a basic video to GIF conversion (use the 2-pass palettegen template).
3. Test the "Fast Trim" feature, ensuring `-ss` and `-t` are placed *before* the input file argument.
4. Test on a mobile viewport (DevTools) to ensure the dropzone is tap-friendly and the advanced settings don't break the layout.
