# Specification: components-molecules-TagList.tsx

## 1. Problem Framing
Displays tags for categorization and handles tag filtering selection.

## 2. State Model
- **Ownership:** Props-controlled (`selectedTags`, `allTags`).

## 3. Findings & Recommendations
- Filtering state is managed by parent (passed via props). No migration needed.
