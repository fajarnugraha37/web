# Specification: hooks/useSearchIndex.ts

## 1. Problem Framing
Fetches and provides searching capability for the site index using MiniSearch.

## 2. State Model
- **Ownership:** Local state (`query`, `miniSearch` instance).

## 3. Findings & Recommendations
- Migration: The search index instance should be initialized once globally (perhaps in a `useSearchStore`) rather than in individual component hooks to avoid redundant index building/memory usage.
