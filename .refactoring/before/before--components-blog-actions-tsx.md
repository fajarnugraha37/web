# Specification: components/BlogActions.tsx

## Overview
The `BlogActions` component provides interactive features for blog posts, including copying content as Markdown, exporting articles to HTML/PDF formats, and sharing content via various social media platforms.

## Functionality
*   **User Interface:**
    *   **Copy Button:** Copies raw Markdown content to the clipboard.
    *   **Export Menu:** Opens a dropdown menu to trigger downloads (Markdown, HTML, PDF).
    *   **Share Menu:** Opens a dropdown menu listing share links for X, LinkedIn, WhatsApp, Telegram, and Facebook.
*   **Navigation:**
    *   Not applicable; interactions trigger browser actions or external links.

## Behavior
*   Uses `navigator.clipboard` for copy functionality.
*   Uses `html2canvas` and `jspdf` to convert the article DOM to PDF.
*   Renders dynamic HTML/PDF strings that include site styles for export fidelity.
*   Provides animation (via `motion/react`) for menu opening/closing.

## State Management
*   `activeMenu`: Tracks which menu is open ("export" or "share").
*   `copiedLink`/`copiedMd`: UI feedback states for copying actions.
*   `isExporting`: Boolean to manage UI transition during PDF export.

## Page/Component Structure
*   `div` (Main container)
    *   `Button` (Copy)
    *   `div` (Export Menu + `AnimatePresence` + `motion.div`)
    *   `div` (Share Menu + `AnimatePresence` + `motion.div`)

## Logic & Data Handling
*   **Export Logic:**
    *   `downloadMd()`: Generates a blob and triggers a download link.
    *   `downloadHtml()`: Sanitizes HTML (via `DOMPurify` implicitly via logic/browser) and triggers an export blob download.
    *   `downloadPdf()`: Uses `html2canvas` to render the content into a canvas and `jspdf` to convert the canvas result to PDF.
*   **Sharing:** Generates URL-encoded strings for various social sharing APIs.

## Dependencies
*   `lucide-react` (Icons).
*   `motion/react` (Animations).
*   `html2canvas`, `jspdf` (PDF conversion).
*   `components/Icons.tsx` (Shared icons).

## Potential Issues
*   **Tight Coupling:** The component directly references the DOM (`document.querySelector("article")`) to perform exports, which violates React's component-based encapsulation principles.
*   **Dependency Bloat:** PDF export logic is quite bulky for a single component; consider moving this to a standalone `export` utility service.
*   **Security:** Relying on `html2canvas` and DOM manipulation for PDF generation can be insecure and inconsistent across different browser environments if not carefully managed.
*   **Maintenance:** The component handles both UI rendering, DOM extraction, PDF engine setup, and URL generation, making it a "gendut" component.
