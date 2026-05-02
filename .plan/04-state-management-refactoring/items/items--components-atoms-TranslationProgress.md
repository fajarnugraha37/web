# Specification: components-atoms-TranslationProgress.tsx

## 1. Problem Framing
Displays download progress for translation models.

## 2. State Model
- **Ownership:** Props-controlled (derived from external worker state).

## 3. Findings & Recommendations
- Presentational. Logic resides in the parent/hook. No migration needed.
