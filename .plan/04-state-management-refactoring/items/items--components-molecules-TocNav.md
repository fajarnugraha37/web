# Specification: components-molecules-TocNav.tsx

## 1. Problem Framing
Provides interactive table of contents navigation for blog pages.

## 2. State Model
- **Ownership:** Uses `useActiveSection` hook to determine active section state.

## 3. Findings & Recommendations
- The navigation state is derived from the DOM (`useActiveSection`). This is highly efficient and avoids global state. No migration needed.
