# Specification: components/KnowledgeGraph/KnowledgeGraphCanvas.tsx

## Overview
The `KnowledgeGraphCanvas` component is a complex 3D visualization tool that renders a blog post "network graph" using `react-three-fiber` and `d3-force-3d`. It displays articles as nodes and their semantic relationships as links.

## Functionality
*   **User Interface:**
    *   3D Canvas environment with nodes, links, and grid overlays.
    *   Interactive hover/select mechanics to show content details (`Html` overlays).
    *   Download sequence via export action in the overlay.
*   **Navigation:**
    *   Provides links (`<a>`) to individual blog pages.

## Behavior
*   Uses `d3-force-3d` to compute physics-based graph layout (nodes, links).
*   Implements `react-three-fiber` for 3D scene rendering, including Bloom and Noise post-processing.
*   Optimized `useFrame` updates for nodes/links to avoid unnecessary React re-renders.
*   Includes a visual "scanline" overlay and system status indicators.

## State Management
*   `hoveredNode`: ID of currently hovered node.
*   `selectedNode`: ID of currently selected node for expanded information.
*   `mounted`: Boolean for SSR-safe loading (prevents canvas rendering on server).

## Page/Component Structure
*   `Canvas`
    *   `PerspectiveCamera`
    *   `Scene`
        *   `Grid` (Visual guide)
        *   `Node` (Icosahedron meshes with HTML popovers)
        *   `Link` (Electro-flow line segments)
        *   `EffectComposer` (Post-processing)
        *   `OrbitControls` (Navigation)

## Logic & Data Handling
*   **Graph Physics:** `forceSimulation` initializes the graph layout using `d3-force-3d` in an `useEffect` hook.
*   **Performance:** Uses `ref` and `useFrame` for position updates of graph entities.
*   **Rendering:** Uses custom material (`MeshWobbleMaterial`) for the "cyberpunk" aesthetic.

## Dependencies
*   `@react-three/fiber`, `@react-three/drei`, `@react-three/postprocessing` (3D scene).
*   `d3-force-3d` (Graph physics).
*   `three` (3D math/primitives).
*   `lucide-react` (Icons).
*   `lib/graph-utils.ts` (Data structures).

## Potential Issues
*   **Complexity:** Highly complex component (3D math, physics, post-processing, DOM-within-canvas).
*   **Performance:** The 3D scene + physics simulation can be memory-intensive.
*   **Coupling:** Heavily coupled with the specific 3D library stack; refactoring would be a major rewrite.
*   **Maintainability:** Managing the lifecycle of the D3 simulation inside `useEffect` with Three.js state updates is difficult to debug.
