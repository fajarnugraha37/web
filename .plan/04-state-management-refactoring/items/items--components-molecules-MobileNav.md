# Specification: components-molecules-MobileNav.tsx

## 1. Problem Framing
Mobile navigation drawer component.

## 2. State Model
- **Ownership:** Internal local state (`expandedLabs`). Parent controls overall `isOpen`.

## 3. Findings & Recommendations
- State is appropriately local to the UI component. No migration needed.
