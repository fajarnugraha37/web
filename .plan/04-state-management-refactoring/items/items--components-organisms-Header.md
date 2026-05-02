# Specification: components-organisms-Header.tsx

## 1. Problem Framing
Orchestrates global navigation, search toggle, and mobile menu state.

## 2. State Model
- **Ownership:** Internal local state (`isSearchOpen`, `isMobileNavOpen`).

## 3. Findings & Recommendations
- Managing UI navigation state centrally. Migration: Moving these toggles to a global `useUIStore` (Zustand) would simplify cross-component interaction (e.g., closing search when opening mobile nav).
