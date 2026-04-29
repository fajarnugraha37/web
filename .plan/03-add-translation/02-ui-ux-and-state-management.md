# UI/UX & State Management

## 1. Design System & Aesthetics
Adhere to the existing Cyberpunk + Terminal visual language.
- **Background:** Scanline overlay with `pointer-events: none` and `0.03` opacity.
- **Neon Glow:** Utilize existing cyan/green/magenta neon accents for active states. Disable if `@media (prefers-reduced-motion: reduce)` or `deviceMemory <= 2GB`.
- **Typography:** Monospace fonts for logs, terminals, and progress indicators. Standard sans-serif for UI labels.

## 2. State Management (URL Sync)
Application state should be deep-linkable and shareable.
- **URL Query Params:** Language pairs sync to the URL (e.g., `?src=ind_Latn&tgt=eng_Latn`).
- **React State:** Use a custom hook (`useTranslationState`) wrapping `next/navigation`'s `useRouter` and `useSearchParams`.

## 3. Core User Flows

### 3.1 Language Pair Selection
- **Components:** Two dropdowns (Source, Target) and a swap button.
- **Supported Languages (v1):** `ind_Latn` (Indonesian), `eng_Latn` (English), `zho_Hans` (Chinese Simplified), `spa_Latn` (Spanish), `ara_Arab` (Arabic).
- **RTL Handling:** If the target is `_Arab`, dynamically apply `dir="rtl"` to the output text area. Use CSS logical properties (`padding-inline-start`, `text-align: start`).
- **Interaction:** The swap button rotates 180deg visually without flipping the layout structure.

### 3.2 Progress Download UX
The initial 150MB model download requires clear feedback.
- **Idle:** "Model belum siap. Klik untuk mengunduh (~150MB). Hanya sekali."
- **Downloading:** Determinate linear progress bar `[████░░░] 45%` with neon cyan glow. Update via `requestAnimationFrame` to avoid React re-render thrashing.
- **Loading:** "Memuat ke worker..." with a blinking terminal cursor `█`.
- **Ready:** "Pipeline aktif" badge.

### 3.3 Input Constraints & Warnings
To prevent Out of Memory (OOM) errors:
- **0–280 chars:** Normal state, grey counter.
- **280–300 chars:** Yellow counter, Toast warning: "Mendekati batas aman. Translasi mungkin lebih lambat."
- **>300 chars:** Red counter. On submit, show a blocking modal: "Melebihi 300 karakter. Risiko OOM/akurasi turun. Lanjutkan?".
- **Override:** If user proceeds, log `[OVERRIDE: N chars]` in the debug panel.

### 3.4 Simulated Token-by-Token Streaming
Since native streaming might not be perfectly supported out-of-the-box with the current NLLB pipeline in transformers.js, simulate it for perceived performance.
1. Run full inference in worker.
2. Split result by words.
3. Emit tokens to UI via `setInterval(50-80ms)`.
4. Append tokens with a fade-in effect and blinking cursor.

## 4. Debug Panel
A developer-focused terminal accordion below the translation UI.
- **Header:** `> SYSTEM LOG [▼]`
- **Format:** `[HH:MM:SS] [INFO|WARN|ERROR] message`
- **Controls:** Filter by level, Clear, Copy All.
- **Auto-scroll:** Keep scrolled to bottom unless the user manually scrolls up.
