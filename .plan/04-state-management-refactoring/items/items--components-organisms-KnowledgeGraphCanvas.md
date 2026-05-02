# Specification: components-organisms-KnowledgeGraphCanvas.tsx

## 1. Problem Framing
Orchestrates the 3D visualization and interaction for the Knowledge Graph lab.

## 2. State Model
- **Ownership:** Complex internal state (`hoveredNode`, `selectedNode`). 
- **Data Flow:** React Three Fiber (R3F) orchestrator.

## 3. Findings & Recommendations
- High-performance component with significant interactive state.
- Migration: Keep the 3D canvas state internal for performance, but if the selection (e.g., `selectedNode`) needs to drive external UI (like a info-sidebar), move that selection state to a global `useGraphStore`.
