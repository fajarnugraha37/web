# Specification: components/CodeBlock.tsx

## Overview
The `CodeBlock` component provides a styled container for rendering code blocks in Markdown/MDX content. It includes a copy-to-clipboard feature and supports conditional rendering for `Mermaid` diagrams.

## Functionality
*   **User Interface:**
    *   `pre`/`code` wrapper for source code display.
    *   A floating "Copy" button that appears on hover (or stays visible on mobile).
*   **Rendering Logic:**
    *   Automatically detects Mermaid-compatible code blocks via the `className` prop and renders them using the `MermaidDiagram` component.
*   **Navigation:**
    *   Not applicable.

## Behavior
*   Provides code-copying functionality via the clipboard API.
*   Conditionally renders specialized components based on class names.

## State Management
*   `copied`: Boolean state to show success feedback after copying.

## Page/Component Structure
*   `div` (Relative container)
    *   `button` (Copy)
    *   `pre` (Code wrapper)
        *   `code`

## Logic & Data Handling
*   **Copying:** Uses `navigator.clipboard.writeText` to copy provided `code` string.
*   **Detection:** Checks `className` for "mermaid" to determine rendering path.

## Dependencies
*   `components/MermaidDiagram.tsx` (For diagram rendering).
*   `lucide-react` (Icons).

## Potential Issues
*   **Logic Coupling:** The component mixes code block rendering with diagram rendering logic. If more diagram types are added, this component will need constant modification.
*   **Clipboard API usage:** `navigator.clipboard` is not guaranteed in all contexts (e.g., non-HTTPS or certain sandboxed iframes). Current implementation includes basic error catching.
