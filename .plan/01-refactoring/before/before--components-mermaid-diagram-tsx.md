# Specification: components/MermaidDiagram.tsx

## Overview
The `MermaidDiagram` component is an interactive viewer for Mermaid.js diagrams within the application. It handles the server/browser-side rendering of diagrams, providing interactive features like zoom, pan, and file exports (SVG/PNG).

## Functionality
*   **User Interface:**
    *   Inline SVG rendering of the diagram.
    *   Interactive toolbar (Zoom/Pan/Download controls) for the modal-based zoom view.
    *   Direct download options (SVG/PNG) for the diagram.
*   **Navigation:**
    *   None (Self-contained viewer).

## Behavior
*   Uses `mermaid` JS library to render SVG from text charts.
*   Uses `react-zoom-pan-pinch` for the zooming/panning interface.
*   Uses `html2canvas` for PNG generation.
*   Provides an "Inspect" modal view to see the diagram in high resolution.
*   Uses `createPortal` to render the full-screen modal into the `document.body`.

## State Management
*   `svgCode`: String containing the rendered SVG output from Mermaid.
*   `isZoomed`: Boolean state managing the full-screen modal visibility.
*   `mounted`: Boolean for handling client-side-only rendering.

## Page/Component Structure
*   `div` (Main container with floating toolbars)
    *   `div` (DangerouslySetInnerHTML for SVG preview)
*   `Portal`
    *   `AnimatePresence` + `motion.div` (Full-screen modal)
        *   `TransformWrapper`
            *   `TransformComponent`
                *   Zoomed SVG view

## Logic & Data Handling
*   **Rendering:** Uses `mermaid.render()` asynchronously.
*   **PNG Export:** Clones the SVG element, serializes to XML, converts to data URL, draws to canvas, and triggers download.
*   **Portal:** Uses `react-dom`'s `createPortal` to render the modal to the document root to bypass layout/overflow limitations.

## Dependencies
*   `mermaid` (Diagram engine).
*   `react-zoom-pan-pinch` (Interaction).
*   `html2canvas` (Rasterization).
*   `motion/react` (Animations).
*   `lucide-react` (Icons).

## Potential Issues
*   **Complexity:** Contains logic for DOM manipulation (`XMLSerializer`, `Image`, `canvas`), PDF/PNG conversion, and modal management.
*   **Security:** `dangerouslySetInnerHTML` is used. While the Mermaid library renders this safely from generated SVG strings, direct interaction with the SVG content could be a risk if the diagram content was untrusted.
*   **Performance:** Generating PNG screenshots requires rasterizing the entire diagram, which can be computationally intensive on the client side.
*   **Coupling:** Heavy dependence on browser-specific APIs (Canvas, DOM element cloning) which makes SSR/hydration complex.
