# Specification: hooks/useTranslationParams.ts

## 1. Problem Framing
Manages translation language selection state by syncing it with URL search params.

## 2. State Model
- **Ownership:** Syncs directly with `searchParams` via Next.js router.

## 3. Findings & Recommendations
- Syncing state with the URL is a great pattern for shareable URLs. No migration needed, this pattern works well with React Query's `initialData` if needed.
