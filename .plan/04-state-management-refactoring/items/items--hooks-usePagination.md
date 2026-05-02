# Specification: hooks/usePagination.ts

## 1. Problem Framing
Provides pagination logic for lists (calculating offsets and page ranges).

## 2. State Model
- **Ownership:** Internal local state (`currentPage`).

## 3. Findings & Recommendations
- Standard utility hook. No global migration needed.
