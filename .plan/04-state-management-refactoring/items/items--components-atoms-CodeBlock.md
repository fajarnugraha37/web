# Specification: components-atoms-CodeBlock.tsx

## 1. Problem Framing
Renders code snippets with a copy-to-clipboard function.

## 2. State Model
- **Ownership:** Internal local state (`copied`).

## 3. Findings & Recommendations
- Local state is appropriate. No global migration needed.
