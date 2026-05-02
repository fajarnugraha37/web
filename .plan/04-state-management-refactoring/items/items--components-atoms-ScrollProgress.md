# Specification: components-atoms-ScrollProgress.tsx

## 1. Problem Framing
Visual scroll progress indicator at the top of the viewport.

## 2. State Model
- **Ownership:** Uses `motion/react` hooks to track window scroll.

## 3. Findings & Recommendations
- Purely presentation/animation layer. No migration needed.
