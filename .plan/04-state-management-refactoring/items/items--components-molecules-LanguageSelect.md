# Specification: components-molecules-LanguageSelect.tsx

## 1. Problem Framing
Provides a language selection dropdown for translation lab.

## 2. State Model
- **Ownership:** Props-controlled (`value`, `onChange`).

## 3. Findings & Recommendations
- Uses language list from `hooks/useTranslationParams`. Presentational. No migration needed.
