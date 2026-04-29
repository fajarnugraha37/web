# UI/UX & State Management

## 1. Design System & Aesthetics
Adhere to the existing Cyberpunk + Terminal visual language.
- **Background:** Scanline overlay with `pointer-events: none` and `0.03` opacity.
- **Neon Glow:** Utilize existing cyan/green/magenta neon accents for active states. Disable if `@media (prefers-reduced-motion: reduce)` or `deviceMemory <= 2GB`.
- **Typography:** Monospace fonts for logs, terminals, and progress indicators. Standard sans-serif for UI labels.

## 2. State Management (URL Sync)
Application state should be deep-linkable and shareable.
- **URL Query Params:** Language pairs sync to the URL (e.g., `?src=ind_Latn&tgt=eng_Latn`).
- **React State:** Use a custom hook (`useTranslationParams`) wrapping `next/navigation`'s `useRouter` and `useSearchParams`. Auto-swaps target/source to prevent `ind_Latn -> ind_Latn` duplicate selection.

## 3. Core User Flows

### 3.1 Language Pair Selection
- **Components:** Two dropdowns (Source, Target) and a swap button.
- **Supported Languages:** `eng_Latn` (English), `ind_Latn` (Indonesian), `zho_Hans` (Chinese Simplified), `spa_Latn` (Spanish), `arb_Arab` (Arabic), `zsm_Latn` (Malay), `jpn_Jpan` (Japanese), `kor_Hang` (Korean), `deu_Latn` (German), `nld_Latn` (Dutch), `rus_Cyrl` (Russian).
- **RTL Handling:** If the target is `_Arab`, dynamically apply `dir="rtl"` to the output text area. Use CSS logical properties (`padding-inline-start`, `text-align: start`).
- **Interaction:** The swap button rotates 180deg visually without flipping the layout structure. When actively translating, the swap button turns into a spinner (`Loader2`).

### 3.2 Progress Download UX
The initial model download provides detailed multi-file feedback.
- **Idle/Init:** The component auto-initializes the worker on mount. The UI briefly shows "WAITING FOR ENGINE...".
- **Downloading:** Renders a list of progress bars for multiple concurrent files being fetched, showing filename, MB loaded/total, and percentage. Updates via React state bound to worker messages.
- **Loading:** "LOADING WORKER █" with a blinking terminal cursor.
- **Ready:** "✅ PIPELINE ACTIVE" badge.

### 3.3 Input Constraints & Warnings
To prevent Out of Memory (OOM) errors:
- **Normal:** 0–280 chars (or 0-180 if deviceMemory < 4GB). Grey counter.
- **Warning:** 280–300 chars. Yellow counter.
- **Limit Exceeded:** >300 chars. Red counter. On submit, shows a blocking modal: "Memory Warning. Teks melebihi batas aman... Lanjutkan?".
- **Override:** If user proceeds, logs `[OVERRIDE: N chars]` in the debug panel.

### 3.4 Real-time Translation & Streaming
- Auto-translation is triggered when the user changes a language dropdown and there is existing input text.
- Since native streaming isn't perfectly supported out-of-the-box with the current NLLB pipeline, results are emitted to UI via `setInterval(50ms)` token-by-token visual simulation.

## 4. Debug Panel
A developer-focused terminal accordion below the translation UI.
- **Header:** Terminal Log Viewer
- **Format:** `[HH:MM:SS] [INFO|WARN|ERROR] message`
- **Controls:** Clear Logs. Auto-scrolls.
