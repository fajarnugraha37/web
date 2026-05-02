# Specification: components-atoms-Toast.tsx

## 1. Problem Framing
Provides a system-wide toast notification system.

## 2. State Model
- **Ownership:** Internal local state (toasts array). Uses a global `addToastFn` to expose an imperative API.

## 3. Findings & Recommendations
- This currently uses a local `ToastProvider` with an exported imperative function `toast()`.
- Migration: Consider using a Zustand store for the toast list to make it cleaner and more decoupled from the provider component.
