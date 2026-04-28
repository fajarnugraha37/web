# Specification: app/labs/markdown/page.tsx

## Overview
The `MarkdownPlayground` component is a complex, in-browser Markdown editor featuring live preview, VIM mode support (via CodeMirror), file management (import/export), and syntax-highlighting. It provides a "zen-like" IDE experience for Markdown editing.

## Functionality
*   **User Interface:**
    *   **Editor Panel:** A full-featured `CodeMirror` editor with `vscodeDark` theme and VIM bindings.
    *   **Preview Panel:** A live rendered Markdown preview using `react-markdown` with GFM, Math, and Emoji support.
    *   **File Management:** Supports multiple open tabs, creating new files, renaming, duplicating, and wiping (deleting).
    *   **Import/Export:** Drag-and-drop file support, fetch from GitHub URLs, and export to Markdown, HTML, or PDF (via `jspdf` + `html2canvas`).
    *   **Zen Mode:** Full-screen preview toggle.
*   **Navigation:**
    *   No external routing; internal state management for active document tabs.
*   **Accessibility:**
    *   Includes keyboard shortcuts, semantic HTML, and focus management during modals.

## Behavior
*   Synchronizes scrolls between editor and preview.
*   Supports live Markdown preview and syntax highlighting for code blocks via MDX Components.
*   Handles GitHub alerts (`Note`, `Tip`, `Important`, etc.) using custom blockquote parsing.

## State Management
*   `files`: Array of `File` objects (id, name, content).
*   `activeFileId`: Currently selected tab ID.
*   `viewMode`: "editor", "split", "preview".
*   `syncStatus`: Status of auto-save/sync ("idle", "saving", "saved").
*   `modal`/`renameModal`/`deleteModal`: UI state for management modals.
*   `splitRatio`: Resizable layout state.

## Page/Component Structure
*   `PageTransition`
    *   `div` (Main Interface)
        *   `header` (Toolbar, File Tabs, Status)
        *   `DropZone` (File Ingestion)
        *   `main` (Editor + Preview split/pane)
            *   `CodeMirror` (Editor)
            *   `ReactMarkdown` (Preview)
        *   `aside` (Table of Contents - optional)
        *   `AnimatePresence` (Modals/Overlays for Import/Export/Rename/Delete)

## Logic & Data Handling
*   **Editor Logic:** Integrates `@uiw/react-codemirror` with VIM bindings.
*   **Markdown Parsing:** Complex processing of blockquotes to handle GitHub-style alerts and Mermaids.
*   **PDF/HTML Export:** Uses `jspdf` and `html2canvas` for screenshot-to-PDF generation.
*   **Storage Handling:** Runtime state is stored in memory (`files` array); browser `FileReader` API handles imports.

## Dependencies
*   `@uiw/react-codemirror` (Editor).
*   `react-markdown`, `remark-*`, `rehype-*` (Parsing).
*   `jspdf`, `html2canvas` (Export).
*   `lucide-react` (Icons).
*   `isomorphic-dompurify` (Sanitization).

## Potential Issues
*   **Highly complex monolithic component:** (over 600 lines) which makes it a prime candidate for refactoring.
*   **Tight coupling:** Between VIM mode, file management, and preview logic within one file.
*   **PDF Export Consistency:** Exporting to PDF via `html2canvas` may have layout rendering inconsistencies with complex CSS/Markdown layouts.
