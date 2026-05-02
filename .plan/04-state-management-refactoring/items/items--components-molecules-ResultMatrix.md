# Specification: components-molecules-ResultMatrix.tsx

## 1. Problem Framing
Displays analytical query results in a virtualized table with export functionality.

## 2. State Model
- **Ownership:** Props-controlled (results, pagination).

## 3. Findings & Recommendations
- Standard data-driven UI. Internal state management is minimal (pagination state should remain in parent or hooks). No migration needed.
