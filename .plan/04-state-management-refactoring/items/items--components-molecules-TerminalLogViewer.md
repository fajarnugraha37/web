# Specification: components-molecules-TerminalLogViewer.tsx

## 1. Problem Framing
Provides streaming terminal log view for lab processes.

## 2. State Model
- **Ownership:** Props-controlled (`logs`).

## 3. Findings & Recommendations
- Standard log component. Logic resides in the parent hook. No state management migration required.
