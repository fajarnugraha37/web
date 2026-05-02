# Specification: components-molecules-MermaidDiagram.tsx

## 1. Problem Framing
Renders Mermaid charts with interactive zoom/pan capabilities.

## 2. State Model
- **Ownership:** Internal local state (`svgCode`, `isZoomed`, `mounted`).

## 3. Findings & Recommendations
- Standard interactive component. Internal state is appropriate. No migration needed.
